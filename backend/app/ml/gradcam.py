import torch
import torch.nn.functional as F
import numpy as np
import io
import base64
from PIL import Image
import matplotlib
matplotlib.use('Agg')
import matplotlib.cm as cm

def compute_gradcam(model, input_tensor, target_class_idx):
    """
    Computes Grad-CAM (Gradient-weighted Class Activation Mapping) on the
    ChestXrayResNet14 model for a specified target class index.
    
    Args:
        model: ChestXrayResNet14 instance (in eval mode, but requires_grad active for CAM)
        input_tensor: torch.Tensor of shape (1, 1, 28, 28)
        target_class_idx: int (0 to 13)
        
    Returns:
        heatmap_np: 2D numpy array [28, 28] with values normalized [0, 1]
    """
    model.eval()
    
    # Enable gradients for the input tensor and feature map
    input_tensor = input_tensor.clone().detach().requires_grad_(True)
    
    # Forward pass with CAM hook enabled
    logits = model(input_tensor, register_cam_hook=True)
    
    # Zero all previous gradients
    model.zero_grad()
    
    # Target score
    score = logits[0, target_class_idx]
    score.backward(retain_graph=False)
    
    # Extract gradients and activations from the model
    gradients = model.get_activations_gradient()
    activations = model.get_activations()
    
    if gradients is None or activations is None:
        return np.zeros((28, 28), dtype=np.float32)
        
    # Global average pooling on gradients to obtain feature weights alpha_k
    pooled_gradients = torch.mean(gradients, dim=[0, 2, 3])
    
    # Weight each activation channel by its gradient significance
    for i in range(activations.size(1)):
        activations[:, i, :, :] *= pooled_gradients[i]
        
    # Sum over channels and apply ReLU to highlight features with positive influence
    heatmap = torch.mean(activations, dim=1).squeeze()
    heatmap = F.relu(heatmap)
    
    # Normalize heatmap
    if torch.max(heatmap) > 0:
        heatmap = heatmap / torch.max(heatmap)
        
    heatmap_np = heatmap.detach().cpu().numpy()
    
    # Ensure dimensions match 28x28
    if heatmap_np.shape != (28, 28):
        h_tensor = torch.from_numpy(heatmap_np).unsqueeze(0).unsqueeze(0)
        h_upsampled = F.interpolate(h_tensor, size=(28, 28), mode='bilinear', align_corners=False)
        heatmap_np = h_upsampled.squeeze().numpy()
        
    return heatmap_np


def generate_gradcam_visualizations(original_image_pil, heatmap_28x28, colormap_name="magma", alpha=0.55):
    """
    Generates high-resolution Grad-CAM overlays and heatmaps formatted for web delivery.
    
    Args:
        original_image_pil: PIL.Image (Grayscale or RGB)
        heatmap_28x28: 2D numpy array [28, 28] values [0, 1]
        colormap_name: matplotlib colormap ('magma', 'inferno', 'jet')
        alpha: blend factor
        
    Returns:
        dict: {
            "heatmap_base64": "data:image/png;base64,...",
            "overlay_base64": "data:image/png;base64,...",
            "peak_intensity": float
        }
    """
    orig_w, orig_h = original_image_pil.size
    
    # Resize heatmap to match original image dimensions using cubic interpolation
    heatmap_img = Image.fromarray((heatmap_28x28 * 255).astype(np.uint8)).resize(
        (orig_w, orig_h), resample=Image.Resampling.BICUBIC
    )
    heatmap_resized = np.array(heatmap_img) / 255.0
    
    # Apply colormap
    cmap = matplotlib.colormaps.get_cmap(colormap_name)
    colored_heatmap = cmap(heatmap_resized)[:, :, :3] # RGB [0, 1]
    colored_heatmap_uint8 = (colored_heatmap * 255).astype(np.uint8)
    
    # Base grayscale image
    orig_gray = original_image_pil.convert("RGB")
    orig_np = np.array(orig_gray).astype(np.float32) / 255.0
    
    # Blend overlay
    overlay_np = (1 - alpha) * orig_np + alpha * colored_heatmap
    overlay_np = np.clip(overlay_np, 0.0, 1.0)
    overlay_uint8 = (overlay_np * 255).astype(np.uint8)
    
    # Encode Heatmap Only
    heatmap_pil = Image.fromarray(colored_heatmap_uint8)
    buf_heat = io.BytesIO()
    heatmap_pil.save(buf_heat, format="PNG")
    heat_b64 = "data:image/png;base64," + base64.b64encode(buf_heat.getvalue()).decode("utf-8")
    
    # Encode Overlay
    overlay_pil = Image.fromarray(overlay_uint8)
    buf_over = io.BytesIO()
    overlay_pil.save(buf_over, format="PNG")
    over_b64 = "data:image/png;base64," + base64.b64encode(buf_over.getvalue()).decode("utf-8")
    
    return {
        "heatmap_base64": heat_b64,
        "overlay_base64": over_b64,
        "peak_intensity": float(np.max(heatmap_28x28))
    }
