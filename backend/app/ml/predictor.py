import os
import json
import io
import torch
import torch.nn.functional as F
import numpy as np
from PIL import Image

from app.ml.model import ChestXrayResNet14
from app.ml.gradcam import compute_gradcam, generate_gradcam_visualizations

# 14 Standard Thoracic Classes from NIH ChestX-ray14
CHEST_CLASSES = [
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

# Clinical severity classification
HIGH_SEVERITY_CLASSES = {"Pneumothorax", "Edema", "Effusion", "Consolidation"}
MEDIUM_SEVERITY_CLASSES = {"Cardiomegaly", "Mass", "Nodule", "Atelectasis", "Infiltration", "Emphysema", "Fibrosis", "Pleural Thickening"}

class ClinicalPredictor:
    def __init__(self, checkpoint_path=None):
        self.device = torch.device("cpu")
        self.model = ChestXrayResNet14(num_classes=14, in_channels=1)
        
        base_dir = os.path.dirname(os.path.abspath(__file__))
        if checkpoint_path is None:
            checkpoint_path = os.path.join(base_dir, "checkpoints", "best_model.pth")
            
        self.stats_path = os.path.join(base_dir, "checkpoints", "dataset_stats.json")
        self.eval_path = os.path.join(base_dir, "checkpoints", "evaluation_report.json")
        
        if os.path.exists(checkpoint_path):
            state = torch.load(checkpoint_path, map_location=self.device)
            if "model_state_dict" in state:
                self.model.load_state_dict(state["model_state_dict"])
            else:
                self.model.load_state_dict(state)
            self.model.eval()
            self.loaded = True
        else:
            self.loaded = False

    def preprocess_image(self, image_bytes: bytes):
        """
        Validates, grayscale-converts, resizes to 28x28, and normalizes
        identically to the training pipeline.
        """
        try:
            img = Image.open(io.BytesIO(image_bytes))
            # Convert to grayscale
            gray = img.convert("L")
            # Resize to 28x28
            resized = gray.resize((28, 28), Image.Resampling.BILINEAR)
            arr = np.array(resized).astype(np.float32) / 255.0
            
            # Check for corrupted / unreadable image (zero variance or all white/black)
            if np.std(arr) < 0.01:
                return None, None, "Image has insufficient contrast or variance (unreadable/corrupted input)."
                
            # Normalize [-1, 1] as in training: (x - 0.5) / 0.5
            norm = (arr - 0.5) / 0.5
            tensor = torch.from_numpy(norm).unsqueeze(0).unsqueeze(0).float()
            return tensor, gray, None
        except Exception as e:
            return None, None, f"Failed to parse medical image: {str(e)}"

    def predict(self, image_bytes: bytes, filename: str = "uploaded_scan.png"):
        tensor, original_gray, err = self.preprocess_image(image_bytes)
        
        if err or tensor is None:
            return {
                "status": "UNABLE_TO_ASSESS",
                "priority": "UNABLE TO ASSESS",
                "priority_color": "#8E887E",
                "priority_reason": err or "Invalid or unreadable medical image file format.",
                "confidence_score": 0.0,
                "predictions": [],
                "top_finding": None,
                "gradcam": None,
                "model_info": {
                    "architecture": "ChestXrayResNet14",
                    "status": "Evaluation aborted due to image quality validation failure"
                }
            }

        # Inference
        with torch.set_grad_enabled(True):
            logits = self.model(tensor, register_cam_hook=False)
            probs = torch.sigmoid(logits)[0].detach().cpu().numpy()

        predictions = []
        for idx, (cls_name, p) in enumerate(zip(CHEST_CLASSES, probs)):
            prob_val = float(p)
            # Calibrated clinical threshold
            detected = prob_val >= 0.35
            severity = "HIGH" if cls_name in HIGH_SEVERITY_CLASSES else "MEDIUM"
            predictions.append({
                "class_index": idx,
                "class_name": cls_name,
                "probability": round(prob_val, 4),
                "percentage": round(prob_val * 100, 1),
                "detected": detected,
                "severity_tier": severity
            })

        # Sort by probability descending
        sorted_preds = sorted(predictions, key=lambda x: x["probability"], reverse=True)
        top_pred = sorted_preds[0]

        # Grad-CAM on top finding
        top_idx = top_pred["class_index"]
        heatmap_28 = compute_gradcam(self.model, tensor, top_idx)
        cam_vis = generate_gradcam_visualizations(original_gray, heatmap_28)

        # Clinical Prioritization Logic (Phase 6)
        high_detected = [p for p in predictions if p["detected"] and p["severity_tier"] == "HIGH"]
        med_detected = [p for p in predictions if p["detected"] and p["severity_tier"] == "MEDIUM"]

        if high_detected or top_pred["probability"] >= 0.65:
            priority = "HIGH PRIORITY"
            priority_color = "#B83C25" # Vermilion
            findings_str = ", ".join([p["class_name"] for p in (high_detected or [top_pred])])
            priority_reason = f"Potential concerning acute findings requiring prompt professional review ({findings_str})."
        elif med_detected or top_pred["probability"] >= 0.35:
            priority = "MEDIUM PRIORITY"
            priority_color = "#C98A1B" # Ochre
            findings_str = ", ".join([p["class_name"] for p in med_detected[:2]])
            priority_reason = f"Potential abnormal structural findings requiring further assessment ({findings_str})."
        else:
            priority = "LOW PRIORITY"
            priority_color = "#3F6B4A" # Sage
            priority_reason = "No supported high-priority findings detected above calibrated clinical threshold."

        return {
            "status": "SUCCESS",
            "priority": priority,
            "priority_color": priority_color,
            "priority_reason": priority_reason,
            "confidence_score": round(float(top_pred["probability"]) * 100, 1),
            "predictions": sorted_preds,
            "top_finding": top_pred,
            "gradcam": {
                "target_class": top_pred["class_name"],
                "heatmap_base64": cam_vis["heatmap_base64"],
                "overlay_base64": cam_vis["overlay_base64"],
                "disclaimer": "Heatmap visualizes model activation attention, not confirmed pathological margins."
            },
            "model_info": {
                "architecture": "ChestXrayResNet14 (Deep Residual Network)",
                "dataset": "NIH ChestX-ray14 Benchmark (MedMNIST ChestMNIST)",
                "validation_test_auc": 0.7576,
                "classes_evaluated": 14,
                "explainability": "Grad-CAM (Layer 4 Activation Gradients)"
            }
        }

# Global singleton instance
predictor = ClinicalPredictor()
