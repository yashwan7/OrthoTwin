import os
import time
import json
import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
import torchvision.transforms as transforms
from sklearn.metrics import roc_auc_score, accuracy_score, precision_recall_fscore_support
from app.ml.model import ChestXrayResNet14
from app.ml.dataset_utils import CHESTXRAY14_CLASSES

class ChestNPZDataset(Dataset):
    def __init__(self, images, labels, transform=None):
        # Images are [N, 28, 28] uint8
        self.images = images
        self.labels = labels.astype(np.float32)
        self.transform = transform

    def __len__(self):
        return len(self.images)

    def __getitem__(self, idx):
        img = self.images[idx] # (28, 28)
        # Convert to PIL Image or float tensor
        img = img.astype(np.float32) / 255.0
        # Add channel dim: (1, 28, 28)
        tensor_img = torch.tensor(img, dtype=torch.float32).unsqueeze(0)
        # Normalize
        tensor_img = (tensor_img - 0.5) / 0.5

        if self.transform:
            tensor_img = self.transform(tensor_img)

        target = torch.tensor(self.labels[idx], dtype=torch.float32)
        return tensor_img, target

def get_dataloaders(data_path="backend/app/ml/data/chestmnist.npz", batch_size=128, max_train_samples=None):
    data = np.load(data_path)
    train_imgs, train_lbls = data["train_images"], data["train_labels"]
    val_imgs, val_lbls = data["val_images"], data["val_labels"]
    test_imgs, test_lbls = data["test_images"], data["test_labels"]

    if max_train_samples and max_train_samples < len(train_imgs):
        train_imgs = train_imgs[:max_train_samples]
        train_lbls = train_lbls[:max_train_samples]

    train_transform = transforms.Compose([
        transforms.RandomHorizontalFlip(p=0.5),
        transforms.RandomRotation(degrees=7)
    ])

    train_ds = ChestNPZDataset(train_imgs, train_lbls, transform=train_transform)
    val_ds = ChestNPZDataset(val_imgs, val_lbls, transform=None)
    test_ds = ChestNPZDataset(test_imgs, test_lbls, transform=None)

    train_loader = DataLoader(train_ds, batch_size=batch_size, shuffle=True, num_workers=0)
    val_loader = DataLoader(val_ds, batch_size=batch_size, shuffle=False, num_workers=0)
    test_loader = DataLoader(test_ds, batch_size=batch_size, shuffle=False, num_workers=0)

    # Compute positive weights for BCE loss
    pos_counts = np.sum(train_lbls, axis=0)
    neg_counts = len(train_lbls) - pos_counts
    # Clamped positive weights to balance rare classes while keeping optimization stable
    pos_weights = np.clip(neg_counts / np.maximum(pos_counts, 1), 1.0, 20.0)
    pos_weights_tensor = torch.tensor(pos_weights, dtype=torch.float32)

    return train_loader, val_loader, test_loader, pos_weights_tensor, len(train_ds)

def evaluate_metrics(model, dataloader, device):
    model.eval()
    all_preds = []
    all_targets = []
    total_loss = 0.0
    criterion = nn.BCEWithLogitsLoss()

    with torch.no_grad():
        for images, targets in dataloader:
            images = images.to(device)
            targets = targets.to(device)
            logits = model(images)
            loss = criterion(logits, targets)
            total_loss += loss.item() * len(images)

            probs = torch.sigmoid(logits).cpu().numpy()
            all_preds.append(probs)
            all_targets.append(targets.cpu().numpy())

    all_preds = np.vstack(all_preds)
    all_targets = np.vstack(all_targets)
    avg_loss = total_loss / len(dataloader.dataset)

    # Per-class ROC-AUC
    auc_scores = []
    class_metrics = []
    binary_preds = (all_preds >= 0.5).astype(int)

    for i, c_name in enumerate(CHESTXRAY14_CLASSES):
        # Calculate AUC only if positive samples exist in split
        if len(np.unique(all_targets[:, i])) > 1:
            auc = roc_auc_score(all_targets[:, i], all_preds[:, i])
            auc_scores.append(auc)
        else:
            auc = 0.5

        acc = accuracy_score(all_targets[:, i], binary_preds[:, i])
        prec, rec, f1, _ = precision_recall_fscore_support(all_targets[:, i], binary_preds[:, i], average='binary', zero_division=0)
        
        # Specificity = TN / (TN + FP)
        tn = np.sum((all_targets[:, i] == 0) & (binary_preds[:, i] == 0))
        fp = np.sum((all_targets[:, i] == 0) & (binary_preds[:, i] == 1))
        specificity = float(tn / (tn + fp)) if (tn + fp) > 0 else 0.0

        class_metrics.append({
            "class": c_name,
            "roc_auc": round(float(auc), 4),
            "accuracy": round(float(acc), 4),
            "sensitivity": round(float(rec), 4),
            "specificity": round(float(specificity), 4),
            "precision": round(float(prec), 4),
            "f1_score": round(float(f1), 4)
        })

    mean_auc = float(np.mean(auc_scores)) if auc_scores else 0.5
    return avg_loss, mean_auc, class_metrics, all_preds, all_targets

def run_training(epochs=5, batch_size=128, lr=1e-3, data_path="backend/app/ml/data/chestmnist.npz"):
    os.makedirs("backend/app/ml/checkpoints", exist_ok=True)
    device = torch.device("mps" if torch.backends.mps.is_available() else "cpu")
    print(f"Using execution device: {device}")

    train_loader, val_loader, test_loader, pos_weights, n_train = get_dataloaders(data_path, batch_size=batch_size)
    print(f"Loaded {n_train} training, {len(val_loader.dataset)} validation, {len(test_loader.dataset)} test samples.")

    model = ChestXrayResNet14(num_classes=14, in_channels=1).to(device)
    criterion = nn.BCEWithLogitsLoss(pos_weight=pos_weights.to(device))
    optimizer = torch.optim.AdamW(model.parameters(), lr=lr, weight_decay=1e-4)
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=epochs, eta_min=1e-5)

    best_val_auc = 0.0
    best_checkpoint_path = "backend/app/ml/checkpoints/best_model.pth"
    history = []

    print(f"\n--- Starting Model Training ({epochs} Epochs) ---")
    start_time = time.time()

    for epoch in range(1, epochs + 1):
        model.train()
        running_loss = 0.0
        batch_count = 0

        for images, targets in train_loader:
            images = images.to(device)
            targets = targets.to(device)

            optimizer.zero_grad()
            logits = model(images)
            loss = criterion(logits, targets)
            loss.backward()
            optimizer.step()

            running_loss += loss.item()
            batch_count += 1
            if batch_count % 150 == 0:
                print(f"  Epoch [{epoch}/{epochs}] Batch [{batch_count}/{len(train_loader)}] Loss: {loss.item():.4f}")

        scheduler.step()
        train_loss = running_loss / len(train_loader)

        # Validation evaluation
        val_loss, val_auc, _, _, _ = evaluate_metrics(model, val_loader, device)
        print(f"Epoch {epoch:02d} Complete -> Train Loss: {train_loss:.4f} | Val Loss: {val_loss:.4f} | Val Mean ROC-AUC: {val_auc:.4f}")

        history.append({
            "epoch": epoch,
            "train_loss": round(train_loss, 4),
            "val_loss": round(val_loss, 4),
            "val_roc_auc": round(val_auc, 4),
            "lr": round(optimizer.param_groups[0]["lr"], 6)
        })

        if val_auc > best_val_auc:
            best_val_auc = val_auc
            torch.save({
                "epoch": epoch,
                "model_state_dict": model.state_dict(),
                "optimizer_state_dict": optimizer.state_dict(),
                "val_auc": val_auc,
                "classes": CHESTXRAY14_CLASSES
            }, best_checkpoint_path)
            print(f"  >>> Checkpoint saved! New best Val ROC-AUC: {val_auc:.4f}")

    total_time = time.time() - start_time
    print(f"\nTraining completed in {total_time/60:.2f} minutes.")

    # Save training configuration & history
    config = {
        "dataset": "NIH ChestX-ray14 (ChestMNIST)",
        "architecture": "ChestXrayResNet14",
        "total_images": 112120,
        "epochs": epochs,
        "batch_size": batch_size,
        "learning_rate": lr,
        "classes": CHESTXRAY14_CLASSES,
        "best_val_auc": round(best_val_auc, 4),
        "training_time_seconds": round(total_time, 2)
    }
    with open("backend/app/ml/checkpoints/training_config.json", "w") as f:
        json.dump(config, f, indent=2)

    with open("backend/app/ml/checkpoints/training_history.json", "w") as f:
        json.dump(history, f, indent=2)

    # Final independent test set evaluation
    print("\n--- Running Final Evaluation on Independent Test Set (22,433 samples) ---")
    checkpoint = torch.load(best_checkpoint_path, map_location=device)
    model.load_state_dict(checkpoint["model_state_dict"])
    test_loss, test_auc, class_metrics, _, _ = evaluate_metrics(model, test_loader, device)

    eval_summary = {
        "test_samples": len(test_loader.dataset),
        "test_loss": round(test_loss, 4),
        "mean_roc_auc": round(test_auc, 4),
        "per_class_metrics": class_metrics
    }
    with open("backend/app/ml/checkpoints/evaluation_report.json", "w") as f:
        json.dump(eval_summary, f, indent=2)

    print(f"Independent Test Mean ROC-AUC: {test_auc:.4f}")
    for cm in class_metrics:
        print(f"  {cm['class']:<20} | AUC: {cm['roc_auc']:.4f} | Sens/Recall: {cm['sensitivity']:.4f} | Spec: {cm['specificity']:.4f} | F1: {cm['f1_score']:.4f}")

    return eval_summary

if __name__ == "__main__":
    run_training(epochs=4, batch_size=128, lr=1e-3)
