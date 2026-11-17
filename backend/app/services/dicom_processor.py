from typing import Dict, Any, List

def process_ct_upload(file_count: int = 240, filename: str = "demo_shoulder_ct.zip") -> Dict[str, Any]:
    """
    Simulates CT / DICOM DICOM processing, metadata extraction and series validation.
    """
    return {
        "status": "success",
        "patient_id": "ORT-2026-001",
        "file_count": file_count,
        "series_description": "Shoulder CT Thin Slice (0.625mm)",
        "slice_count": 240,
        "resolution": "512x512 x 240 slices",
        "pixel_spacing": [0.488, 0.488, 0.625],
        "kvp": 120,
        "exposure": 200,
        "message": "CT dataset parsed and validated successfully. 240 slices indexed."
    }
