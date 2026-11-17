export interface PatientInfo {
  patient_id: string;
  name: string;
  age: number;
  sex: string;
  scan_date: string;
  modality: string;
  procedure: string;
  hospital: string;
}

export interface StructureSegmentation {
  name: string;
  color: string;
  visible: boolean;
  volume_cc: number;
  voxel_count: number;
  quality_score: number;
}

export interface SegmentationStep {
  step: number;
  name: string;
  status: 'pending' | 'in_progress' | 'complete';
  duration_sec: number;
}

export interface LandmarkPoint {
  id: string;
  name: string;
  coordinates: [number, number, number];
  confidence: number;
  description: string;
}

export interface AnatomicalMeasurements {
  glenoid_inclination: number;
  glenoid_version: number;
  humeral_head_diameter: number;
  humeral_offset: number;
  center_of_rotation: [number, number, number];
  glenoid_vault_depth: number;
  scapular_spine_angle: number;
}

export interface ImplantSpecs {
  id: string;
  name: string;
  type: 'Reverse Shoulder' | 'Anatomical Total Shoulder' | 'Stemless' | 'Custom Demo Implant';
  category: string;
  manufacturer_neutral_id: string;
  description: string;
  dimensions: {
    glenosphere_diameter_mm?: number[];
    humeral_head_radius_mm?: number[];
    baseplate_diameter_mm?: number;
    humeral_stem_sizes?: number[];
    lateralization_mm?: number[];
    cage_diameter_mm?: number[];
    wedge_angle_deg?: number;
    stem_sizes?: number[];
    glenosphere_offset_mm?: number;
  };
  material: string;
  glenosphere_options: number[];
  stem_sizes: number[];
}

export interface ImplantPose {
  implant_id: string;
  translation_x: number; // medial/lateral mm
  translation_y: number; // superior/inferior mm
  translation_z: number; // anterior/posterior mm
  rotation_x: number;    // pitch/inclination deg
  rotation_y: number;    // yaw/version deg
  rotation_z: number;    // roll deg
  inclination_deg: number;
  version_deg: number;
  offset_mm: number;
  glenosphere_size_mm: number;
  stem_size: number;
}

export interface KinematicSimulationResult {
  max_abduction: number;
  max_flexion: number;
  max_external_rotation: number;
  max_internal_rotation: number;
  scapular_notch_clearance_mm: number;
  impingement_status: 'Low Risk' | 'Moderate Risk' | 'Impingement Detected';
  impingement_angle_deg: number | null;
  joint_stability_score: number;
  deltoid_lever_arm_increase_pct: number;
  contact_stress_peak_mpa: number;
}

export interface PlanVsRealityComparison {
  planned_pose: ImplantPose;
  actual_pose: ImplantPose;
  inclination_dev_deg: number;
  version_dev_deg: number;
  translation_dev_mm: number;
  overall_alignment_score: number;
  status: string;
}

export interface SurgicalReport {
  report_id: string;
  patient: PatientInfo;
  triage?: ClinicalTriageResult;
  measurements: AnatomicalMeasurements;
  implant: ImplantSpecs;
  planned_pose: ImplantPose;
  simulation: KinematicSimulationResult;
  plan_vs_reality?: PlanVsRealityComparison;
  summary: string;
  disclaimer: string;
  generated_at: string;
}

// ─── Disease Findings & Clinical Triage ────────────────────────────────────────

export type DiseaseSeverity = 'None' | 'Mild' | 'Moderate' | 'Severe';
export type TriagePriority  = 'Urgent' | 'High' | 'Routine' | 'Monitor';

export interface DiseaseSign {
  id: string;
  name: string;                       // e.g. "Posterior Glenoid Bone Loss"
  category: string;                   // e.g. "Bone Morphology"
  severity: DiseaseSeverity;
  confidence: number;                 // 0–1 AI confidence
  value: string;                      // e.g. "23% deficit"
  clinicalNote: string;               // 1-line clinical interpretation
  walchClass?: string;                // e.g. "Walch B2"
  flaggedForReview: boolean;
}

export interface ClinicalTriageResult {
  triage_priority: TriagePriority;
  complexity_score: number;            // 0–100
  recommended_intervention: string;
  time_to_consult: string;             // e.g. "Within 2 weeks"
  disease_signs: DiseaseSign[];
  ai_summary: string;
  generated_at: string;
}

// ─── Workflow Steps ─────────────────────────────────────────────────────────────

export type WorkflowStepId = 
  | 'dashboard'
  | 'triage'
  | 'upload'
  | 'segmentation'
  | 'reconstruction'
  | 'landmarks'
  | 'implants'
  | 'planning'
  | 'simulation'
  | 'plan-vs-reality'
  | 'reports';
