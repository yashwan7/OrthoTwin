import React, { useState } from 'react';
import { useOrthoTwin } from '../../context/OrthoTwinContext';
import { OverlayCanvas3D } from '../3d/OverlayCanvas3D';
import { GitCompare, UploadCloud, CheckCircle2, ArrowRight, Layers } from 'lucide-react';

export const PlanVsRealityView: React.FC = () => {
  const { structures, selectedImplant, implantPose, planVsReality, setActiveStep } = useOrthoTwin();
  const [postOpLoaded, setPostOpLoaded] = useState<boolean>(true);

  return (
    <div className="space-y-6 max-w-[1360px] mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="font-mono text-xs tracking-widest text-[#B83C25] font-semibold uppercase mb-1">
            POST-OPERATIVE VERIFICATION
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2B2723] tracking-tight">
            Plan vs Reality — Post-Op 3D Alignment
          </h2>
          <p className="text-[#5A534A] text-xs sm:text-sm mt-0.5 max-w-2xl">
            Compare planned pre-op implant target pose against actual post-op CT reconstruction.
          </p>
        </div>

        <button
          onClick={() => setActiveStep('reports')}
          className="btn btn-ghost text-xs"
        >
          <span>Surgical Report</span>
          <span className="arr">→</span>
        </button>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT: 3D Overlay Visualizer */}
        <div className="lg:col-span-8 bg-[#FFFFFF] border border-[#E2D9CB] rounded-3xl p-5 shadow-sm space-y-4">
          <OverlayCanvas3D
            structures={structures}
            implant={selectedImplant}
            plannedPose={planVsReality.planned_pose}
            actualPose={planVsReality.actual_pose}
            overallScore={planVsReality.overall_alignment_score}
          />
        </div>

        {/* RIGHT: Deviation Metrics & Upload Box */}
        <div className="lg:col-span-4 space-y-5">
          {/* Post-Op CT Data Loader Box */}
          <div className="bg-[#FFFFFF] border border-[#E2D9CB] rounded-2xl p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#2B2723] text-xs flex items-center gap-2">
                <UploadCloud size={15} className="text-[#B83C25]" /> Post-Op Follow-up CT
              </span>
              <span className="text-[11px] font-mono font-bold bg-[#DCE7D6] text-[#2B5236] px-2.5 py-0.5 rounded-full border border-[#BED2B5]">
                Loaded
              </span>
            </div>
            <p className="text-[#5A534A] text-xs leading-relaxed">
              Post-operative scan reconstructed and co-registered via ICP point-to-plane optimization.
            </p>
          </div>

          {/* Deviation Metrics Table */}
          <div className="bg-[#FFFFFF] border border-[#E2D9CB] rounded-2xl p-5 space-y-4 shadow-xs">
            <h4 className="font-bold text-[#2B2723] text-xs font-mono uppercase tracking-wider border-b border-[#EEE7DB] pb-2">
              Surgical Placement Deviations
            </h4>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center p-3 rounded-xl bg-[#FAF9F5] border border-[#E2D9CB]">
                <span className="text-[#5A534A]">Inclination Error</span>
                <span className="font-bold text-[#C98A1B]">+{planVsReality.inclination_dev_deg}°</span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-xl bg-[#FAF9F5] border border-[#E2D9CB]">
                <span className="text-[#5A534A]">Version Error</span>
                <span className="font-bold text-[#3F6B4A]">{planVsReality.version_dev_deg}°</span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-xl bg-[#FAF9F5] border border-[#E2D9CB]">
                <span className="text-[#5A534A]">Translation Error</span>
                <span className="font-bold text-[#3F6B4A]">{planVsReality.translation_dev_mm} mm</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#DCE7D6] border border-[#BED2B5] text-[#2B5236] font-bold text-center">
                Alignment Fidelity: {planVsReality.overall_alignment_score}% (High Agreement)
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveStep('reports')}
            className="w-full btn btn-primary text-xs shadow-md"
          >
            <span>Proceed to Surgical Report</span>
            <span className="arr">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};
