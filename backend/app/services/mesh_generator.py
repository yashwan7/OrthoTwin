from typing import List, Dict, Any

def get_implant_library() -> List[Dict[str, Any]]:
    return [
        {
            "id": "imp_rev_sys_01",
            "name": "OrthoTwin Universal Reverse Shoulder System",
            "type": "Reverse Shoulder",
            "category": "Reverse Arthroplasty",
            "manufacturer_neutral_id": "VN-RSA-2026-REV",
            "description": "Modular reverse shoulder prosthesis with 135°/145° inclination baseplate options.",
            "dimensions": {
                "glenosphere_diameter_mm": [36, 39, 42],
                "baseplate_diameter_mm": 25,
                "humeral_stem_sizes": [1, 2, 3, 4],
                "lateralization_mm": [0, 3, 6]
            },
            "material": "Ti-6Al-4V + Porous CoCr + UHMWPE",
            "glenosphere_options": [36, 39, 42],
            "stem_sizes": [1, 2, 3, 4]
        },
        {
            "id": "imp_anat_sys_02",
            "name": "OrthoTwin Anatomical Total Shoulder System",
            "type": "Anatomical Total Shoulder",
            "category": "Anatomical Arthroplasty",
            "manufacturer_neutral_id": "VN-TSA-2026-ANA",
            "description": "Anatomical glenoid component with keeled/pegged back and anatomical humeral head.",
            "dimensions": {
                "humeral_head_radius_mm": [40, 44, 48, 52],
                "glenoid_component_sizes": ["S", "M", "L", "XL"],
                "stem_sizes": [1, 2, 3, 5]
            },
            "material": "CoCrMo + Cross-linked Polyethylene",
            "glenosphere_options": [],
            "stem_sizes": [1, 2, 3, 5]
        },
        {
            "id": "imp_stemless_03",
            "name": "OrthoTwin Metaphyseal Stemless Shoulder",
            "type": "Stemless",
            "category": "Bone Preserving",
            "manufacturer_neutral_id": "VN-STL-2026-MET",
            "description": "Stemless proximal humeral fixation cage for maximum bone preservation.",
            "dimensions": {
                "cage_diameter_mm": [28, 32, 36],
                "head_height_mm": [14, 16, 18]
            },
            "material": "Porous Titanium 3D Printed",
            "glenosphere_options": [36, 39],
            "stem_sizes": [0]
        },
        {
            "id": "imp_custom_04",
            "name": "OrthoTwin Custom Augmented Baseplate System",
            "type": "Custom Demo Implant",
            "category": "Complex Revision",
            "manufacturer_neutral_id": "VN-CUST-2026-AUG",
            "description": "Patient-specific 10° posterior wedge augmented baseplate for severe glenoid bone loss.",
            "dimensions": {
                "wedge_angle_deg": 10,
                "glenosphere_offset_mm": 4
            },
            "material": "Additive Manufactured Ti6Al4V",
            "glenosphere_options": [39, 42],
            "stem_sizes": [2, 3]
        }
    ]
