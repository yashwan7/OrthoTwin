import React, { useState } from 'react';
import { useOrthoTwin } from '../../context/OrthoTwinContext';
import { StructureToggles } from './StructureToggles';
import { CheckCircle2, Clock, Cpu, ArrowRight, Layers, Sliders } from 'lucide-react';

export const SegmentationView: React.FC = () => {
  const { structures, toggleStructureVisibility, setActiveStep } = useOrthoTwin();
  const [sliceIndex, setSliceIndex] = useState<number>(120);

  const pipelineSteps = [
    { name: 'Pre-processing & Filtering', duration: '2.1s', status: 'Complete' },
    { name: 'Bone Detection (MONAI U-Net)', duration: '5.4s', status: 'Complete' },
    { name: 'Anatomical Multi-Label Segmentation', duration: '4.2s', status: 'Complete' },
    { name: '3D Landmark Detection', duration: '2.5s', status: 'Complete' },
  ];

  return (
    <div className="space-y-6 max-w-[1360px] mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="font-mono text-xs tracking-widest text-[#B83C25] font-semibold uppercase mb-1">
            STEP 02 · ANATOMICAL ISOLATION
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2B2723] tracking-tight">
            AI Segmentation & Bone Surface Isolation
          </h2>
          <p className="text-[#5A534A] text-xs sm:text-sm mt-0.5">
            Deep-learning bone structure segmentation isolating humerus, scapula, and glenoid surface.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-[#FFFFFF] border border-[#E2D9CB] px-3.5 py-1.5 rounded-full text-xs font-mono flex items-center gap-2 shadow-2xs">
            <Clock size={14} className="text-[#B83C25] shrink-0" />
            <span className="text-[#6B635A]">Processing:</span>
            <strong className="text-[#2B2723]">14.2 sec</strong>
          </div>

          <div className="bg-[#DCE7D6] border border-[#BED2B5] px-3.5 py-1.5 rounded-full text-xs font-mono text-[#2B5236] font-bold flex items-center gap-1.5 shadow-2xs">
            <CheckCircle2 size={14} className="text-[#3F6B4A] shrink-0" />
            <span>Mean Dice: 0.962</span>
          </div>
        </div>
      </div>

      {/* Main 3-Column Workstation Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: Original CT Slice Viewer */}
        <div className="lg:col-span-4 bg-[#FFFFFF] border border-[#E2D9CB] rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#E2D9CB] pb-2.5 text-xs">
              <span className="font-bold text-[#2B2723]">Original DICOM Slice</span>
              <span className="font-mono text-[11px] text-[#2B2723] bg-[#FAF9F5] px-2.5 py-0.5 rounded-full border border-[#E2D9CB]">
                Slice {sliceIndex}
              </span>
            </div>

            <div className="relative w-full h-[240px] sm:h-[300px] md:h-[320px] bg-[#2B2723] rounded-2xl border border-[#D8CDBB] overflow-hidden flex items-center justify-center medical-grid shadow-inner">
              <svg className="w-full h-full" viewBox="0 0 400 400">
                <ellipse cx="200" cy="200" rx="140" ry="120" fill="#3F3934" opacity={0.5} />
                <path d="M 140 140 Q 180 180 170 260 Q 200 240 210 190 Z" fill="#F6F3EE" stroke="#A89E8F" strokeWidth="2" />
                <circle cx="260" cy="195" r="55" fill="#A89E8F" stroke="#F6F3EE" strokeWidth="2" />
              </svg>
              <div className="absolute top-3 left-3 text-[10px] font-mono text-[#FAF9F5] bg-[#2B2723]/90 border border-[#5A534A] px-2 py-0.5 rounded">
                RAW DICOM
              </div>
            </div>
          </div>

          <div className="pt-4">
            <input
              type="range"
              min="1"
              max="240"
              value={sliceIndex}
              onChange={(e) => setSliceIndex(Number(e.target.value))}
              className="w-full h-1.5 bg-[#E2D9CB] rounded-lg appearance-none cursor-pointer accent-[#B83C25]"
            />
          </div>
        </div>

        {/* CENTER: AI Segmented CT Slice */}
        <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#E59A85] rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#E2D9CB] pb-2.5 text-xs">
              <span className="font-bold text-[#B83C25] flex items-center gap-1.5">
                <Cpu size={15} /> AI Segmented Slice Overlay
              </span>
              <span className="font-mono text-[10px] text-[#8E2C18] bg-[#F6D8CF] px-2.5 py-0.5 rounded-full border border-[#E59A85] font-bold">
                Mask Active
              </span>
            </div>

            <div className="relative w-full h-[240px] sm:h-[300px] md:h-[320px] bg-[#2B2723] rounded-2xl border border-[#D8CDBB] overflow-hidden flex items-center justify-center medical-grid shadow-inner">
              <svg className="w-full h-full" viewBox="0 0 400 400">
                {/* Soft Tissue Mask */}
                {structures.find(s => s.name === 'Soft Tissue')?.visible && (
                  <ellipse cx="200" cy="200" rx="140" ry="120" fill="#ec4899" opacity={0.35} />
                )}
                {/* Scapula Mask */}
                {structures.find(s => s.name === 'Scapula')?.visible && (
                  <path d="M 140 140 Q 180 180 170 260 Q 200 240 210 190 Z" fill="#3F6B4A" opacity={0.8} stroke="#2B5236" strokeWidth="2" />
                )}
                {/* Glenoid Surface Overlay */}
                {structures.find(s => s.name === 'Glenoid')?.visible && (
                  <path d="M 200 180 Q 215 200 205 230 Z" fill="#B83C25" opacity={0.9} stroke="#F2CDC1" strokeWidth="3" />
                )}
                {/* Humerus Mask */}
                {structures.find(s => s.name === 'Humerus')?.visible && (
                  <circle cx="260" cy="195" r="55" fill="#3b82f6" opacity={0.8} stroke="#1d4ed8" strokeWidth="2" />
                )}
              </svg>
              <div className="absolute top-3 left-3 text-[10px] font-mono text-[#FAF9F5] bg-[#2B2723]/90 border border-[#5A534A] px-2 py-0.5 rounded">
                MONAI MULTI-LABEL MASKS
              </div>
            </div>
          </div>

          <div className="pt-3 flex justify-between text-xs font-mono text-[#5A534A]">
            <span>Synchronized slice cross-section</span>
            <span className="text-[#B83C25] font-semibold">Slice {sliceIndex}</span>
          </div>
        </div>

        {/* RIGHT: Structures Panel & Pipeline Steps */}
        <div className="lg:col-span-3 space-y-4">
          <StructureToggles structures={structures} onToggle={toggleStructureVisibility} />

          {/* Pipeline Tracker */}
          <div className="bg-[#FFFFFF] border border-[#E2D9CB] rounded-2xl p-4 space-y-3 shadow-xs">
            <h4 className="text-xs font-bold text-[#2B2723] uppercase font-mono tracking-wider">
              Segmentation Stages
            </h4>
            <div className="space-y-1.5 text-xs">
              {pipelineSteps.map((st, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-[#FAF9F5] border border-[#EEE7DB] text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-[#3F6B4A] shrink-0" />
                    <span className="text-[#2B2723] font-medium">{st.name}</span>
                  </div>
                  <span className="font-mono text-[#6B635A] text-[10px]">{st.duration}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveStep('reconstruction')}
            className="w-full btn btn-primary text-xs shadow-md"
          >
            <span>View 3D Digital Twin</span>
            <span className="arr">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};
