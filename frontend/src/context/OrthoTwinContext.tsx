import React, { createContext, useContext, useState } from 'react';
import {
  PatientInfo,
  AnatomicalMeasurements,
  LandmarkPoint,
  ImplantSpecs,
  ImplantPose,
  KinematicSimulationResult,
  PlanVsRealityComparison,
  StructureSegmentation,
  WorkflowStepId,
  SurgicalReport,
  ClinicalTriageResult,
} from '../types';
import {
  DEFAULT_PATIENT,
  DEFAULT_STRUCTURES,
  DEFAULT_MEASUREMENTS,
  DEFAULT_LANDMARKS,
  DEFAULT_IMPLANTS,
  DEFAULT_PLANNED_POSE,
  DEFAULT_SIMULATION,
  DEFAULT_PLAN_VS_REALITY,
  DEFAULT_TRIAGE,
  runSimulation
} from '../services/api';

interface OrthoTwinContextType {
  activeStep: WorkflowStepId;
  setActiveStep: (step: WorkflowStepId) => void;
  
  patient: PatientInfo;
  setPatient: React.Dispatch<React.SetStateAction<PatientInfo>>;

  ctUploaded: boolean;
  setCtUploaded: (val: boolean) => void;
  ctFileCount: number;
  setCtFileCount: (count: number) => void;

  segmentationComplete: boolean;
  setSegmentationComplete: (val: boolean) => void;
  structures: StructureSegmentation[];
  toggleStructureVisibility: (name: string) => void;

  measurements: AnatomicalMeasurements;
  landmarks: LandmarkPoint[];

  implants: ImplantSpecs[];
  selectedImplant: ImplantSpecs;
  setSelectedImplant: (implant: ImplantSpecs) => void;

  implantPose: ImplantPose;
  updateImplantPose: (updates: Partial<ImplantPose>) => void;
  resetImplantPose: () => void;

  simulationResult: KinematicSimulationResult;
  simAngleAbduction: number;
  setSimAngleAbduction: (angle: number) => void;
  simAngleFlexion: number;
  setSimAngleFlexion: (angle: number) => void;
  simAngleRotation: number;
  setSimAngleRotation: (angle: number) => void;

  planVsReality: PlanVsRealityComparison;

  triage: ClinicalTriageResult;
  
  loadDemoPatient: () => void;
  generateReportData: () => SurgicalReport;
}

const OrthoTwinContext = createContext<OrthoTwinContextType | undefined>(undefined);

export const OrthoTwinProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeStep, setActiveStep] = useState<WorkflowStepId>('dashboard');
  const [patient, setPatient] = useState<PatientInfo>(DEFAULT_PATIENT);
  const [ctUploaded, setCtUploaded] = useState<boolean>(true);
  const [ctFileCount, setCtFileCount] = useState<number>(240);
  const [segmentationComplete, setSegmentationComplete] = useState<boolean>(true);
  const [structures, setStructures] = useState<StructureSegmentation[]>(DEFAULT_STRUCTURES);
  const [measurements] = useState<AnatomicalMeasurements>(DEFAULT_MEASUREMENTS);
  const [landmarks] = useState<LandmarkPoint[]>(DEFAULT_LANDMARKS);
  const [implants] = useState<ImplantSpecs[]>(DEFAULT_IMPLANTS);
  const [selectedImplant, setSelectedImplant] = useState<ImplantSpecs>(DEFAULT_IMPLANTS[0]);
  const [implantPose, setImplantPose] = useState<ImplantPose>(DEFAULT_PLANNED_POSE);

  // Simulation controls
  const [simAngleAbduction, setSimAngleAbductionState] = useState<number>(45);
  const [simAngleFlexion, setSimAngleFlexionState] = useState<number>(30);
  const [simAngleRotation, setSimAngleRotationState] = useState<number>(0);
  const [simulationResult, setSimulationResult] = useState<KinematicSimulationResult>(DEFAULT_SIMULATION);

  const [planVsReality] = useState<PlanVsRealityComparison>(DEFAULT_PLAN_VS_REALITY);
  const [triage] = useState<ClinicalTriageResult>(DEFAULT_TRIAGE);

  const toggleStructureVisibility = (name: string) => {
    setStructures(prev =>
      prev.map(s => s.name === name ? { ...s, visible: !s.visible } : s)
    );
  };

  const updateImplantPose = (updates: Partial<ImplantPose>) => {
    setImplantPose(prev => {
      const next = { ...prev, ...updates };
      // Recalculate kinematics live
      runSimulation(next, simAngleAbduction, simAngleFlexion).then(res => setSimulationResult(res));
      return next;
    });
  };

  const resetImplantPose = () => {
    setImplantPose(DEFAULT_PLANNED_POSE);
    runSimulation(DEFAULT_PLANNED_POSE, simAngleAbduction, simAngleFlexion).then(res => setSimulationResult(res));
  };

  const setSimAngleAbduction = (angle: number) => {
    setSimAngleAbductionState(angle);
    runSimulation(implantPose, angle, simAngleFlexion).then(res => setSimulationResult(res));
  };

  const setSimAngleFlexion = (angle: number) => {
    setSimAngleFlexionState(angle);
    runSimulation(implantPose, simAngleAbduction, angle).then(res => setSimulationResult(res));
  };

  const setSimAngleRotation = (angle: number) => {
    setSimAngleRotationState(angle);
  };

  const loadDemoPatient = () => {
    setPatient(DEFAULT_PATIENT);
    setCtUploaded(true);
    setCtFileCount(240);
    setSegmentationComplete(true);
    setStructures(DEFAULT_STRUCTURES);
    setSelectedImplant(DEFAULT_IMPLANTS[0]);
    setImplantPose(DEFAULT_PLANNED_POSE);
    setSimAngleAbductionState(45);
    setSimAngleFlexionState(30);
    setSimAngleRotationState(0);
    setSimulationResult(DEFAULT_SIMULATION);
    setActiveStep('dashboard');
  };

  const generateReportData = (): SurgicalReport => {
    return {
      report_id: `REP-${patient.patient_id}-2026`,
      patient,
      triage,
      measurements,
      implant: selectedImplant,
      planned_pose: implantPose,
      simulation: simulationResult,
      plan_vs_reality: planVsReality,
      summary: `Pre-operative CT analysis completed for ${patient.name} (ID: ${patient.patient_id}). ` +
               `Procedure: ${patient.procedure}. AI-detected disease findings: Severe posterior glenoid bone loss (Walch B2, 23% deficit), ` +
               `end-stage glenohumeral osteoarthritis, and glenoid retroversion deformity (−14.2°). ` +
               `Clinical Triage Priority: URGENT (Complexity Score: 87/100). ` +
               `Anatomical glenoid inclination is ${measurements.glenoid_inclination}° ` +
               `with ${Math.abs(measurements.glenoid_version)}° retroversion. ` +
               `Virtual planning confirmed placement of ${selectedImplant.name} (Size ${implantPose.glenosphere_size_mm}mm glenosphere) ` +
               `at target inclination ${implantPose.inclination_deg}° and version ${implantPose.version_deg}°. ` +
               `Biomechanical simulation predicts maximum abduction of ${simulationResult.max_abduction}° with ${simulationResult.impingement_status} status ` +
               `and ${simulationResult.scapular_notch_clearance_mm}mm scapular notch clearance.`,
      disclaimer: `PROTOTYPE DECISION-SUPPORT SOFTWARE FOR RESEARCH AND DEMONSTRATION PURPOSES ONLY. ` +
                  `Not intended for autonomous clinical decision-making, direct diagnostic use, or regulatory-approved surgical execution. ` +
                  `All AI-detected disease findings must be reviewed and confirmed by a qualified orthopedic surgeon before any clinical action.`,
      generated_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
  };

  return (
    <OrthoTwinContext.Provider value={{
      activeStep,
      setActiveStep,
      patient,
      setPatient,
      ctUploaded,
      setCtUploaded,
      ctFileCount,
      setCtFileCount,
      segmentationComplete,
      setSegmentationComplete,
      structures,
      toggleStructureVisibility,
      measurements,
      landmarks,
      implants,
      selectedImplant,
      setSelectedImplant,
      implantPose,
      updateImplantPose,
      resetImplantPose,
      simulationResult,
      simAngleAbduction,
      setSimAngleAbduction,
      simAngleFlexion,
      setSimAngleFlexion,
      simAngleRotation,
      setSimAngleRotation,
      planVsReality,
      triage,
      loadDemoPatient,
      generateReportData
    }}>
      {children}
    </OrthoTwinContext.Provider>
  );
};

export const useOrthoTwin = () => {
  const context = useContext(OrthoTwinContext);
  if (!context) {
    throw new Error('useOrthoTwin must be used within an OrthoTwinProvider');
  }
  return context;
};
