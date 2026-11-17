import React from 'react';
import { useOrthoTwin } from '../../context/OrthoTwinContext';
import { InteractivePlanningCanvas } from '../3d/InteractivePlanningCanvas';
import { TransformControlsPanel } from './TransformControlsPanel';
import { ArrowRight, Sliders, ShieldCheck } from 'lucide-react';

export const PlanningView: React.FC = () => {
  const {
    structures,
    selectedImplant,
    implantPose,
    updateImplantPose,
    resetImplantPose,
    setActiveStep
  } = useOrthoTwin();

  const handleConfirmPlacement = () => {
    setActiveStep('simulation');
  };

  return (
    <div className="space-y-6 max-w-[1360px] mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="font-mono text-xs tracking-widest text-[#B83C25] font-semibold uppercase mb-1">
            VIRTUAL IMPLANT PLACEMENT
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2B2723] tracking-tight">
            Patient-Specific Prosthesis Planning
          </h2>
          <p className="text-[#5A534A] text-xs sm:text-sm mt-0.5">
            Precise 3D positioning, orientation, inclination angle, and version adjustment.
          </p>
        </div>

        <button
          onClick={handleConfirmPlacement}
          className="btn btn-ghost text-xs"
        >
          <span>Biomechanics Simulation</span>
          <span className="arr">→</span>
        </button>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT: Interactive 3D Viewport */}
        <div className="lg:col-span-8 bg-[#FFFFFF] border border-[#E2D9CB] rounded-3xl p-5 shadow-sm space-y-4">
          <InteractivePlanningCanvas
            structures={structures}
            implant={selectedImplant}
            pose={implantPose}
            onPoseChange={updateImplantPose}
          />
        </div>

        {/* RIGHT: Transform & Placement Parameters */}
        <div className="lg:col-span-4">
          <TransformControlsPanel
            implant={selectedImplant}
            pose={implantPose}
            onPoseChange={updateImplantPose}
            onReset={resetImplantPose}
            onConfirm={handleConfirmPlacement}
          />
        </div>
      </div>
    </div>
  );
};
