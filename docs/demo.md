# OrthoTwin Demo Walkthrough Guide

OrthoTwin demonstrates a complete clinical decision-support workflow — from CT imaging to AI disease detection, case prioritization, and surgical planning.

Follow this step-by-step guide to evaluate the full end-to-end workflow:

1. **Launch Application**: Open the web application workstation in your browser.
2. **Click "Load Demo Patient"**: From the left sidebar or top banner, click **Load Demo Patient**. This pre-populates patient `ORT-2026-001` with 240 synthetic CT slices and runs the full AI pipeline.
3. **Dashboard — Triage Alert**: On the Dashboard, observe the red **Clinical Triage Alert Banner** showing AI-detected disease findings and an URGENT priority flag. Click it to open the Clinical Triage view.
4. **Clinical Triage (Decision Support Core)**: Navigate to **Clinical Triage**. Review the complexity score ring (87/100), 4 findings flagged for immediate review (posterior bone loss, joint collapse, retroversion, humeral migration), and the AI-generated case summary recommending Reverse TSA with custom augmented baseplate within 1–2 weeks.
5. **Explore CT Upload & 2D Viewer**: Navigate to **Upload CT**. Use the slice slider (1-240) to scrub through DICOM slices, change planes (Axial, Coronal, Sagittal), and adjust windowing.
6. **AI Segmentation**: Navigate to **Segmentation**. Compare raw CT vs segmented CT slices side-by-side. Toggle structure visibility (Scapula, Humerus, Glenoid).
7. **3D Reconstruction & Measurements**: Navigate to **3D Model**. Rotate/pan/zoom the 3D shoulder model. Test anatomical view presets (Front, Back, Superior, Lateral) and review AI-derived measurements (Inclination 12.4°, Retroversion -4.2°, Humeral offset 28.5mm).
8. **Anatomical Landmarks**: Navigate to **Landmarks**. Select landmark spheres in 3D (Glenoid Center, Superior/Inferior Rims, Scapular Axis) to view exact X, Y, Z coordinates in mm and AI confidence percentages.
9. **Implant Library**: Navigate to **Implant Library**. Select between vendor-neutral systems (Reverse Shoulder, Total Shoulder, Stemless, Custom Augmented Baseplate — indicated by the triage engine for this case).
10. **Virtual Implant Planning**: Navigate to **Planning**. Adjust inclination sliders (e.g. 145°), version angle (-4.0°), glenosphere size (39mm), and 3D translation coordinates. Click **Confirm Placement**.
11. **Biomechanics Simulation**: Navigate to **Simulation**. Drag the Abduction slider (0-140°) and observe joint articulation, dynamic impingement warning status, and scapular notch clearance metrics.
12. **Plan vs Reality**: Navigate to **Plan vs Reality**. Inspect the 3D overlay comparing planned position (Cyan) vs post-op scan (Magenta), and review the deviation metrics matrix.
13. **Generate Report**: Navigate to **Reports**. Click **Export PDF**, **Download JSON**, or **Print Report** to generate the final surgical planning document — including AI disease findings and clinical triage summary.

