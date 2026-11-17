import React from 'react';
import { useOrthoTwin } from '../../context/OrthoTwinContext';
import { AnatomicalCanvas3D } from '../3d/AnatomicalCanvas3D';
import { MeasurementsPanel } from './MeasurementsPanel';
import { StructureToggles } from '../segmentation/StructureToggles';
import { ArrowRight, Box, ShieldCheck, Compass } from 'lucide-react';

export const ReconstructionView: React.FC = () => {
  const { structures, toggleStructureVisibility, measurements, setActiveStep } = useOrthoTwin();

  return (
    <div className="space-y-6 max-w-[1360px] mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="font-mono text-xs tracking-widest text-[#B83C25] font-semibold uppercase mb-1">
            STEP 03 · 3D DIGITAL TWIN
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2B2723] tracking-tight">
            Patient-Specific 3D Shoulder Digital Twin
          </h2>
          <p className="text-[#5A534A] text-xs sm:text-sm mt-0.5">
            Interactive 3D anatomical visualization of scapula, glenoid surface, and proximal humerus.
          </p>
        </div>

        <button
          onClick={() => setActiveStep('landmarks')}
          className="btn btn-ghost text-xs"
        >
          <span>Examine Landmarks</span>
          <span className="arr">→</span>
        </button>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT: 3D Viewport */}
        <div className="lg:col-span-8 bg-[#FFFFFF] border border-[#E2D9CB] rounded-3xl p-5 shadow-sm space-y-4">
          <AnatomicalCanvas3D
            structures={structures}
            showLandmarks={false}
          />
        </div>

        {/* RIGHT: Measurements & Controls */}
        <div className="lg:col-span-4 space-y-5">
          <MeasurementsPanel measurements={measurements} />

          <StructureToggles structures={structures} onToggle={toggleStructureVisibility} />

          <button
            onClick={() => setActiveStep('implants')}
            className="w-full btn btn-primary text-xs shadow-md"
          >
            <span>Proceed to Implant Selection</span>
            <span className="arr">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};
