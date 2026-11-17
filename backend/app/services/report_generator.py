from typing import Dict, Any
from datetime import datetime

def generate_surgical_report(patient: Dict[str, Any], measurements: Dict[str, Any], implant: Dict[str, Any], planned_pose: Dict[str, Any], simulation: Dict[str, Any], plan_vs_reality: Dict[str, Any] = None) -> Dict[str, Any]:
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    report_id = f"REP-{patient.get('patient_id', 'ORT-2026-001')}-2026"

    summary_text = (
        f"Pre-operative CT analysis completed for {patient.get('name', 'Patient')} (ID: {patient.get('patient_id')}). "
        f"Selected implant procedure: {patient.get('procedure')}. Anatomical glenoid inclination is {measurements.get('glenoid_inclination')}° "
        f"with {abs(measurements.get('glenoid_version'))}° retroversion. "
        f"Virtual planning confirmed placement of {implant.get('name')} (Size {planned_pose.get('glenosphere_size_mm')}mm glenosphere) "
        f"at target inclination {planned_pose.get('inclination_deg')}° and version {planned_pose.get('version_deg')}°. "
        f"Biomechanical simulation predicts maximum abduction of {simulation.get('max_abduction')}° with {simulation.get('impingement_status')} status "
        f"and {simulation.get('scapular_notch_clearance_mm')}mm scapular clearance."
    )

    disclaimer = (
        "PROTOTYPE DECISION-SUPPORT SOFTWARE FOR RESEARCH AND DEMONSTRATION PURPOSES ONLY. "
        "Not intended for autonomous clinical decision-making, direct diagnostic use, or regulatory-approved surgical execution."
    )

    return {
        "report_id": report_id,
        "patient": patient,
        "measurements": measurements,
        "implant": implant,
        "planned_pose": planned_pose,
        "simulation": simulation,
        "plan_vs_reality": plan_vs_reality,
        "summary": summary_text,
        "disclaimer": disclaimer,
        "generated_at": timestamp
    }
