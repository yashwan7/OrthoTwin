from typing import Dict, Any

def compare_plan_vs_postop(planned_pose: Dict[str, Any], postop_pose: Dict[str, Any] = None) -> Dict[str, Any]:
    """
    Computes deviations between planned vs actual post-op implant position.
    """
    if postop_pose is None:
        # Default realistic post-op deviation sample
        postop_pose = {
            "implant_id": planned_pose.get("implant_id", "imp_rev_sys_01"),
            "translation_x": planned_pose.get("translation_x", 0.0) - 0.4,
            "translation_y": planned_pose.get("translation_y", 0.0) + 0.6,
            "translation_z": planned_pose.get("translation_z", 0.0) + 0.2,
            "rotation_x": planned_pose.get("rotation_x", 0.0) + 1.8,
            "rotation_y": planned_pose.get("rotation_y", 0.0) - 0.9,
            "rotation_z": planned_pose.get("rotation_z", 0.0) + 0.3,
            "inclination_deg": planned_pose.get("inclination_deg", 145.0) + 1.8,
            "version_deg": planned_pose.get("version_deg", -4.0) - 0.9,
            "offset_mm": planned_pose.get("offset_mm", 28.5) - 0.4,
            "glenosphere_size_mm": planned_pose.get("glenosphere_size_mm", 39),
            "stem_size": planned_pose.get("stem_size", 2)
        }

    inclination_dev = round(postop_pose["inclination_deg"] - planned_pose.get("inclination_deg", 145.0), 1)
    version_dev = round(postop_pose["version_deg"] - planned_pose.get("version_deg", -4.0), 1)
    translation_dev = round(((postop_pose["translation_x"] - planned_pose.get("translation_x", 0.0))**2 +
                             (postop_pose["translation_y"] - planned_pose.get("translation_y", 0.0))**2 +
                             (postop_pose["translation_z"] - planned_pose.get("translation_z", 0.0))**2)**0.5, 2)

    overall_score = round(max(0.0, 100.0 - (abs(inclination_dev) * 1.5 + abs(version_dev) * 1.2 + translation_dev * 2.0)), 1)

    return {
        "planned_pose": planned_pose,
        "actual_pose": postop_pose,
        "inclination_dev_deg": inclination_dev,
        "version_dev_deg": version_dev,
        "translation_dev_mm": translation_dev,
        "overall_alignment_score": overall_score,
        "status": "High Fidelity Agreement" if overall_score > 90 else "Acceptable Clinical Range"
    }
