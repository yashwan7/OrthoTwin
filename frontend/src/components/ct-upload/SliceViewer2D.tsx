import React, { useState } from 'react';
import { Sliders, Sun, Eye, Layers } from 'lucide-react';

export const SliceViewer2D: React.FC = () => {
  const [sliceIndex, setSliceIndex] = useState<number>(120);
  const [plane, setPlane] = useState<'axial' | 'coronal' | 'sagittal'>('axial');
  const [windowLevel, setWindowLevel] = useState<number>(400);
  const [contrast, setContrast] = useState<number>(100);

  const radius = Math.max(20, 90 - Math.abs(sliceIndex - 120) * 0.5);
  const humerusOffsetX = (sliceIndex - 120) * 0.4;

  return (
    <div className="bg-[#FAF9F5] border border-[#E2D9CB] rounded-2xl p-4 sm:p-5 flex flex-col space-y-4">
      {/* Viewer Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs border-b border-[#E2D9CB] pb-3">
        <div className="flex items-center gap-2">
          <Layers size={16} className="text-[#B83C25] shrink-0" />
          <span className="font-bold text-[#2B2723]">2D Multi-Planar Slice Viewer</span>
          <span className="text-[#6B635A] font-mono text-[11px] bg-[#FFFFFF] px-2.5 py-0.5 rounded-full border border-[#E2D9CB]">
            {sliceIndex} / 240
          </span>
        </div>

        {/* Anatomical Plane Toggles */}
        <div className="flex items-center gap-1 bg-[#FFFFFF] p-1 rounded-full border border-[#E2D9CB]">
          {(['axial', 'coronal', 'sagittal'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPlane(p)}
              className={`px-3 py-1 rounded-full capitalize text-[11px] font-mono transition ${
                plane === p ? 'bg-[#B83C25] text-white font-bold shadow-xs' : 'text-[#5A534A] hover:text-[#2B2723]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Slice View Canvas Window */}
      <div className="relative w-full h-[260px] sm:h-[320px] md:h-[360px] bg-[#2B2723] rounded-2xl border border-[#D8CDBB] overflow-hidden flex items-center justify-center medical-grid shadow-inner">
        {/* Synthetic DICOM Slice Render */}
        <svg className="w-full h-full" viewBox="0 0 400 400">
          <defs>
            <filter id="boneGlow">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Soft Tissue Contour */}
          <ellipse
            cx="200"
            cy="200"
            rx={radius * 1.8}
            ry={radius * 1.5}
            fill="#3F3934"
            opacity={0.6}
          />

          {/* Scapular Body & Glenoid Bone Cross Section */}
          <path
            d={`M ${140 - humerusOffsetX} 140 Q 180 180 170 260 Q 200 240 210 190 Z`}
            fill="#F6F3EE"
            stroke="#D8CDBB"
            strokeWidth="2"
            filter="url(#boneGlow)"
          />

          {/* Proximal Humerus Head Cross Section */}
          <circle
            cx={260 + humerusOffsetX}
            cy="195"
            r={radius * 0.7}
            fill="#EFE9DF"
            stroke="#D8CDBB"
            strokeWidth="2"
          />

          {/* Cortical Bone Edges & Medullary Cavity */}
          <circle
            cx={260 + humerusOffsetX}
            cy="195"
            r={radius * 0.4}
            fill="#1C1A17"
          />

          {/* Center Crosshair Lines */}
          <line x1="200" y1="0" x2="200" y2="400" stroke="rgba(242, 205, 193, 0.3)" strokeDasharray="4" />
          <line x1="0" y1="200" x2="400" y2="200" stroke="rgba(242, 205, 193, 0.3)" strokeDasharray="4" />
        </svg>

        {/* Slice Metadata Overlay */}
        <div className="absolute top-3 left-3 text-[10px] font-mono text-[#FAF9F5] bg-[#2B2723]/90 border border-[#5A534A] px-2.5 py-1 rounded-md">
          Spacing: 0.488mm | {plane.toUpperCase()}
        </div>

        <div className="absolute bottom-3 right-3 text-[10px] font-mono text-[#FAF9F5] bg-[#2B2723]/90 border border-[#5A534A] px-2.5 py-1 rounded-md">
          WL: {windowLevel} | WW: {contrast * 4}
        </div>
      </div>

      {/* Scrubbing & Viewing Controls */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between text-xs font-mono text-[#5A534A]">
          <span className="flex items-center gap-1.5 font-bold text-[#2B2723]">
            <Eye size={13} className="text-[#B83C25]" /> Slice Position
          </span>
          <span>Index: {sliceIndex} / 240</span>
        </div>
        <input
          type="range"
          min="1"
          max="240"
          value={sliceIndex}
          onChange={(e) => setSliceIndex(Number(e.target.value))}
          className="w-full h-1.5 bg-[#E2D9CB] rounded-lg appearance-none cursor-pointer accent-[#B83C25]"
        />

        <div className="grid grid-cols-2 gap-4 pt-1 text-xs font-mono text-[#5A534A]">
          <div>
            <div className="flex justify-between mb-1">
              <span>Window Level</span>
              <span className="text-[#2B2723] font-bold">{windowLevel} HU</span>
            </div>
            <input
              type="range"
              min="0"
              max="1000"
              value={windowLevel}
              onChange={(e) => setWindowLevel(Number(e.target.value))}
              className="w-full h-1 bg-[#E2D9CB] rounded appearance-none accent-[#B83C25]"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span>Contrast</span>
              <span className="text-[#2B2723] font-bold">{contrast}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="200"
              value={contrast}
              onChange={(e) => setContrast(Number(e.target.value))}
              className="w-full h-1 bg-[#E2D9CB] rounded appearance-none accent-[#B83C25]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
