import React from 'react';
import { useOrthoTwin } from '../../context/OrthoTwinContext';
import { MotionCanvas3D } from '../3d/MotionCanvas3D';
import { KinematicsMetricsPanel } from './KinematicsMetricsPanel';
import { ArrowRight, Activity, ShieldAlert } from 'lucide-react';

export const SimulationView: React.FC = () => {
  const {
    structures,
    selectedImplant,
    implantPose,
    simulationResult,
    simAngleAbduction,
    setSimAngleAbduction,
    simAngleFlexion,
    setSimAngleFlexion,
    simAngleRotation,
    setSimAngleRotation,
    setActiveStep
  } = useOrthoTwin();

  return (
    <div className="space-y-6 max-w-[1360px] mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="font-mono text-xs tracking-widest text-[#B83C25] font-semibold uppercase mb-1">
            BIOMECHANICAL SIMULATION
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2B2723] tracking-tight">
            Shoulder Joint Kinematics & Impingement Analysis
          </h2>
          <p className="text-[#5A534A] text-xs sm:text-sm mt-0.5">
            Dynamic shoulder kinematics, range of motion estimation, and scapular notch clearance.
          </p>
        </div>

        <button
          onClick={() => setActiveStep('plan-vs-reality')}
          className="btn btn-ghost text-xs"
        >
          <span>Plan vs Post-Op Reality</span>
          <span className="arr">→</span>
        </button>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT: Motion Viewport */}
        <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#E2D9CB] rounded-3xl p-5 shadow-sm space-y-4">
          <MotionCanvas3D
            structures={structures}
            implant={selectedImplant}
            pose={implantPose}
            abductionDeg={simAngleAbduction}
            flexionDeg={simAngleFlexion}
            rotationDeg={simAngleRotation}
            impingementStatus={simulationResult.impingement_status}
          />
        </div>

        {/* RIGHT: Motion Controls & Metrics Panel */}
        <div className="lg:col-span-5 space-y-5">
          <KinematicsMetricsPanel
            simulation={simulationResult}
            abduction={simAngleAbduction}
            flexion={simAngleFlexion}
            rotation={simAngleRotation}
            onAbductionChange={setSimAngleAbduction}
            onFlexionChange={setSimAngleFlexion}
            onRotationChange={setSimAngleRotation}
          />

          <button
            onClick={() => setActiveStep('reports')}
            className="w-full btn btn-primary text-xs shadow-md"
          >
            <span>Generate Surgical Report</span>
            <span className="arr">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};
