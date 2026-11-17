# OrthoTwin System & AI Pipeline Architecture

OrthoTwin is a **clinical decision-support tool** that analyzes approved CT/DICOM medical imaging datasets to identify potential signs of orthopedic disease and help healthcare professionals prioritize cases for further surgical assessment. For triaged cases it generates a patient-specific 3D digital twin, supports vendor-neutral implant planning, and simulates post-operative mechanical outcomes.

## Pipeline Flow

```
[CT DICOM Upload]
       │
       ▼
[Pre-Processing & Resampling]
       │
       ▼
[Deep Learning Segmentation (MONAI / PyTorch)]
       │
       ├──> Isolates Scapula, Humerus, Glenoid Vault
       │
       ▼
[AI Disease Detection & Clinical Triage]        ◄── PRIMARY DECISION-SUPPORT STAGE
       │
       ├──> Posterior Glenoid Bone Loss (Walch Classification)
       ├──> Glenohumeral Joint Space Collapse (OA Grade)
       ├──> Glenoid Retroversion Deformity
       ├──> Superior Humeral Head Migration (Rotator Cuff Pathology)
       ├──> Subchondral Sclerosis & Cysts
       ├──> Osteophyte Formation
       ├──> Complexity Score (0–100) & Triage Priority (Urgent/High/Routine/Monitor)
       │
       ▼
[Surface Reconstruction & 3D Landmarking]
       │
       ├──> Glenoid Center, Rim, Scapular Axis, Humeral Head
       │
       ▼
[Vendor-Neutral Implant Planning]
       │
       ├──> Translation (X, Y, Z), Rotation, Inclination (120-150°), Version (-15° to +15°)
       │
       ▼
[Biomechanical Simulation Engine]
       │
       ├──> Articulation, Max Abduction/Flexion, Scapular Notch Clearance, Impingement
       │
       ▼
[Plan vs Post-Op Reality Overlay]
       │
       ├──> Inclination/Version/Translation Deviations
       │
       ▼
[Surgical Planning Report Generation]
       │
       └──> AI Disease Findings + Triage Priority + Implant Plan + Simulation Outcomes
```

## Backend Services (FastAPI)

- `dicom_processor.py`: DICOM slice indexing, metadata validation, spacing extraction.
- `segmentation_engine.py`: Multi-label bone structure segmentation (Scapula, Humerus, Glenoid).
- `triage_engine.py`: AI disease sign detection, severity scoring, and clinical triage prioritization.
- `landmark_detector.py`: 3D spatial coordinate landmark detection & confidence scoring.
- `mesh_generator.py`: Vendor-neutral implant geometry definitions and 3D surface mesh generation.
- `biomechanics_engine.py`: Shoulder kinematics simulation, contact stress, and scapular notch clearance calculation.
- `plan_vs_reality_engine.py`: Pre-op planned vs post-op actual CT alignment deviation matrix.
- `report_generator.py`: Structured surgical report compilation including AI triage summary & JSON/PDF generation.

## Frontend (React + TypeScript + Three.js)

- `ClinicalTriageView.tsx`: **Primary clinical interface** — displays AI-detected disease signs, severity scores, Walch classification, and case triage priority with actionable next steps.
- `DashboardView.tsx`: Overview with inline triage alert banner and workflow pipeline tracker.
- `@react-three/fiber` & `@react-three/drei`: Hardware-accelerated WebGL 3D rendering for anatomical bones, landmarks, vendor-neutral implants, dynamic biomechanical movement, and plan-vs-reality 3D overlay.
- `OrthoTwinContext.tsx`: Unified state management supporting one-click **Load Demo Patient** for immediate GPU-free evaluation.
- `PrintReportTemplate.tsx`: Structured report export including AI disease findings and triage assessment.

