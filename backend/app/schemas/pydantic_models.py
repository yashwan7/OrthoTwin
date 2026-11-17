from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class PatientInfo(BaseModel):
    patient_id: str = "ORT-2026-001"
    name: str = "John Doe (De-identified)"
    age: int = 52
    sex: str = "Male"
    scan_date: str = "2026-05-10"
    modality: str = "CT"
    procedure: str = "Reverse Shoulder Arthroplasty"
    hospital: str = "Metro Orthopedic Center"

class CTUploadResponse(BaseModel):
    status: str
    patient_id: str
    file_count: int
    series_description: str
    slice_count: int
    resolution: str
    message: str

class StructureSegmentation(BaseModel):
    name: str
    color: str
    visible: bool = True
    volume_cc: float
    voxel_count: int
    quality_score: float

class SegmentationResult(BaseModel):
    status: str
    processing_time_sec: float
    dice_score: float
    structures: List[StructureSegmentation]
    steps: List[Dict[str, Any]]

class LandmarkPoint(BaseModel):
    id: str
    name: str
    coordinates: List[float]  # [x, y, z] in mm
    confidence: float
    description: str

class AnatomicalMeasurements(BaseModel):
    glenoid_inclination: float  # degrees
    glenoid_version: float  # degrees (- = retroversion)
    humeral_head_diameter: float  # mm
    humeral_offset: float  # mm
    center_of_rotation: List[float]  # [x, y, z]
    glenoid_vault_depth: float  # mm
    scapular_spine_angle: float  # degrees

class ImplantSpecs(BaseModel):
    id: str
    name: str
    type: str  # Reverse Shoulder, Total Shoulder, Stemless, Modular
    category: str
    manufacturer_neutral_id: str
    description: str
    dimensions: Dict[str, Any]
    material: str
    glenosphere_options: List[int]  # e.g. [36, 39, 42]
    stem_sizes: List[int]

class ImplantPose(BaseModel):
    implant_id: str
    translation_x: float = 0.0  # mm (medial/lateral)
    translation_y: float = 0.0  # mm (superior/inferior)
    translation_z: float = 0.0  # mm (anterior/posterior)
    rotation_x: float = 0.0  # degrees (pitch/inclination)
    rotation_y: float = 0.0  # degrees (yaw/version)
    rotation_z: float = 0.0  # degrees (roll)
    inclination_deg: float = 145.0
    version_deg: float = -4.0
    offset_mm: float = 28.5
    glenosphere_size_mm: int = 39
    stem_size: int = 2

class KinematicSimulationRequest(BaseModel):
    flexion_deg: float = 0.0
    abduction_deg: float = 0.0
    internal_rotation_deg: float = 0.0
    pose: ImplantPose

class KinematicSimulationResult(BaseModel):
    max_abduction: float
    max_flexion: float
    max_external_rotation: float
    max_internal_rotation: float
    scapular_notch_clearance_mm: float
    impingement_status: str  # Low Risk, Moderate Risk, Impingement Detected
    impingement_angle_deg: Optional[float] = None
    joint_stability_score: float  # 0-100%
    deltoid_lever_arm_increase_pct: float
    contact_stress_peak_mpa: float

class PlanVsRealityComparison(BaseModel):
    planned_pose: ImplantPose
    actual_pose: ImplantPose
    inclination_dev_deg: float
    version_dev_deg: float
    translation_dev_mm: float
    overall_alignment_score: float
    status: str

class SurgicalReport(BaseModel):
    report_id: str
    patient: PatientInfo
    measurements: AnatomicalMeasurements
    implant: ImplantSpecs
    planned_pose: ImplantPose
    simulation: KinematicSimulationResult
    plan_vs_reality: Optional[PlanVsRealityComparison] = None
    summary: str
    disclaimer: str
    generated_at: str
