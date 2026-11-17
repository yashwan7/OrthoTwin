import os
import json
import numpy as np

# Official 14 thoracic disease labels from NIH ChestX-ray14 / ChestMNIST
CHESTXRAY14_CLASSES = [
    "Atelectasis",
    "Cardiomegaly",
    "Effusion",
    "Infiltration",
    "Mass",
    "Nodule",
    "Pneumonia",
    "Pneumothorax",
    "Consolidation",
    "Edema",
    "Emphysema",
    "Fibrosis",
    "Pleural Thickening",
    "Hernia"
]

def load_chestmnist_stats(data_path="backend/app/ml/data/chestmnist.npz"):
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Dataset not found at {data_path}")

    data = np.load(data_path)
    train_labels = data["train_labels"]
    val_labels = data["val_labels"]
    test_labels = data["test_labels"]

    total_train = len(train_labels)
    class_stats = []
    pos_weights = []

    for i, class_name in enumerate(CHESTXRAY14_CLASSES):
        pos_count = int(np.sum(train_labels[:, i]))
        neg_count = total_train - pos_count
        prevalence = pos_count / total_train
        # Pos weight for BCEWithLogitsLoss: num_neg / num_pos
        weight = float(neg_count / max(pos_count, 1))
        pos_weights.append(weight)

        class_stats.append({
            "index": i,
            "name": class_name,
            "positive_train_samples": pos_count,
            "prevalence_pct": round(prevalence * 100, 2),
            "bce_pos_weight": round(weight, 2)
        })

    summary = {
        "dataset_name": "NIH ChestX-ray14 (ChestMNIST standardized)",
        "num_classes": len(CHESTXRAY14_CLASSES),
        "classes": CHESTXRAY14_CLASSES,
        "sample_counts": {
            "train": int(len(train_labels)),
            "val": int(len(val_labels)),
            "test": int(len(test_labels)),
            "total": int(len(train_labels) + len(val_labels) + len(test_labels))
        },
        "class_statistics": class_stats,
        "pos_weights": pos_weights
    }
    return summary

if __name__ == "__main__":
    stats = load_chestmnist_stats()
    os.makedirs("backend/app/ml/checkpoints", exist_ok=True)
    with open("backend/app/ml/checkpoints/dataset_stats.json", "w") as f:
        json.dump(stats, f, indent=2)

    print("=== NIH ChestX-ray14 Statistics ===")
    print(f"Total images: {stats['sample_counts']['total']} (Train: {stats['sample_counts']['train']}, Val: {stats['sample_counts']['val']}, Test: {stats['sample_counts']['test']})")
    for item in stats["class_statistics"]:
        print(f"[{item['index']:02d}] {item['name']:<20} | Pos: {item['positive_train_samples']:>6} ({item['prevalence_pct']:>5.2f}%) | Weight: {item['bce_pos_weight']:>6.2f}")
