from typing import List, Dict, Any

def get_anatomical_landmarks() -> List[Dict[str, Any]]:
    """
    Returns detected 3D anatomical landmarks and measurements.
    """
    return [
        {
            "id": "lm_glenoid_center",
            "name": "Glenoid Center",
            "coordinates": [-12.4, 104.2, 5.8],
            "confidence": 0.965,
            "description": "Geometric centroid of the glenoid articular surface."
        },
        {
            "id": "lm_glenoid_sup_rim",
            "name": "Glenoid Superior Rim",
            "coordinates": [-11.8, 120.1, 7.2],
            "confidence": 0.942,
            "description": "Superior margin of glenoid vault rim."
        },
        {
            "id": "lm_glenoid_inf_rim",
            "name": "Glenoid Inferior Rim",
            "coordinates": [-13.0, 88.5, 4.4],
            "confidence": 0.958,
            "description": "Inferior landmark for baseplate seating."
        },
        {
            "id": "lm_scapular_axis",
            "name": "Scapular Spine Axis",
            "coordinates": [45.2, 110.0, -18.4],
            "confidence": 0.931,
            "description": "Reference axis along scapular spine plane."
        },
        {
            "id": "lm_humeral_center",
            "name": "Humeral Head Center",
            "coordinates": [22.8, 106.5, 6.1],
            "confidence": 0.978,
            "description": "Center of best-fit sphere for proximal humeral head."
        },
        {
            "id": "lm_humeral_axis",
            "name": "Humeral Shaft Axis",
            "coordinates": [25.1, 42.0, 2.0],
            "confidence": 0.950,
            "description": "Longitudinal intramedullary axis of humerus."
        }
    ]

def get_anatomical_measurements() -> Dict[str, Any]:
    return {
        "glenoid_inclination": 12.4,
        "glenoid_version": -4.2,
        "humeral_head_diameter": 46.8,
        "humeral_offset": 28.5,
        "center_of_rotation": [-12.4, 104.2, 5.8],
        "glenoid_vault_depth": 24.2,
        "scapular_spine_angle": 14.8
    }
