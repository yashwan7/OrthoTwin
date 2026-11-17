import torch
import torch.nn as nn
import torch.nn.functional as F

class BasicBlock(nn.Module):
    expansion = 1

    def __init__(self, in_planes, planes, stride=1):
        super(BasicBlock, self).__init__()
        self.conv1 = nn.Conv2d(in_planes, planes, kernel_size=3, stride=stride, padding=1, bias=False)
        self.bn1 = nn.BatchNorm2d(planes)
        self.conv2 = nn.Conv2d(planes, planes, kernel_size=3, stride=1, padding=1, bias=False)
        self.bn2 = nn.BatchNorm2d(planes)

        self.shortcut = nn.Sequential()
        if stride != 1 or in_planes != self.expansion * planes:
            self.shortcut = nn.Sequential(
                nn.Conv2d(in_planes, self.expansion * planes, kernel_size=1, stride=stride, bias=False),
                nn.BatchNorm2d(self.expansion * planes)
            )

    def forward(self, x):
        out = F.relu(self.bn1(self.conv1(x)))
        out = self.bn2(self.conv2(out))
        out += self.shortcut(x)
        out = F.relu(out)
        return out


class ChestXrayResNet14(nn.Module):
    """
    Deep Residual Network tailored for Multi-Label Thoracic Disease Classification
    on the NIH ChestX-ray14 dataset.
    Features:
    - 1-channel Grayscale CT/X-Ray input
    - 4 residual stages for hierarchical anatomical feature extraction
    - Final stage (layer4) exposed for Grad-CAM explainability hooks
    - 14 independent sigmoid logit outputs
    """
    def __init__(self, num_classes=14, in_channels=1):
        super(ChestXrayResNet14, self).__init__()
        self.in_planes = 32

        # Initial stem
        self.conv1 = nn.Conv2d(in_channels, 32, kernel_size=3, stride=1, padding=1, bias=False)
        self.bn1 = nn.BatchNorm2d(32)

        # 4 Residual Stages
        self.layer1 = self._make_layer(BasicBlock, 32, 2, stride=1)
        self.layer2 = self._make_layer(BasicBlock, 64, 2, stride=2)
        self.layer3 = self._make_layer(BasicBlock, 128, 2, stride=2)
        self.layer4 = self._make_layer(BasicBlock, 256, 2, stride=2)

        # Classification Head
        self.avg_pool = nn.AdaptiveAvgPool2d((1, 1))
        self.dropout = nn.Dropout(p=0.3)
        self.fc = nn.Linear(256 * BasicBlock.expansion, num_classes)

        # Gradient storage for Grad-CAM
        self.gradients = None
        self.activations = None

    def _make_layer(self, block, planes, num_blocks, stride):
        strides = [stride] + [1] * (num_blocks - 1)
        layers = []
        for s in strides:
            layers.append(block(self.in_planes, planes, s))
            self.in_planes = planes * block.expansion
        return nn.Sequential(*layers)

    def activations_hook(self, grad):
        self.gradients = grad

    def forward(self, x, register_cam_hook=False):
        x = F.relu(self.bn1(self.conv1(x)))
        x = self.layer1(x)
        x = self.layer2(x)
        x = self.layer3(x)

        # Stage 4 feature map is used for Grad-CAM
        feat = self.layer4(x)
        if register_cam_hook:
            self.activations = feat
            h = feat.register_hook(self.activations_hook)

        pooled = self.avg_pool(feat)
        flattened = torch.flatten(pooled, 1)
        dropped = self.dropout(flattened)
        logits = self.fc(dropped)
        return logits

    def get_activations_gradient(self):
        return self.gradients

    def get_activations(self):
        return self.activations
