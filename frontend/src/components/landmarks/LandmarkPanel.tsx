import React, { useState } from 'react';
import { useOrthoTwin } from '../../context/OrthoTwinContext';
import { AnatomicalCanvas3D } from '../3d/AnatomicalCanvas3D';
import { LandmarkPoint } from '../../types';
import { Target, CheckCircle2, ArrowRight, ActivitySquare } from 'lucide-react';

export const LandmarkPanel: React.FC = () => {
  const { structures, landmarks, setActiveStep } = useOrthoTwin();
  const [selectedLandmarkId, setSelectedLandmarkId] = useState<string>('lm_glenoid_center');

  const selectedLm = landmarks.find(lm => lm.id === selectedLandmarkId) || landmarks[0];

  return (
    <div className="space-y-6 max-w-[1360px] mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="font-mono text-xs tracking-widest text-[#B83C25] font-semibold uppercase mb-1">
            ANATOMICAL GEOMETRY
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2B2723] tracking-tight">
            Automated 3D Landmark Localization
          </h2>
          <p className="text-[#5A534A] text-xs sm:text-sm mt-0.5">
            Key structural point detection for patient-specific alignment, vault axis calculation, and resection planning.
          </p>
        </div>

        <button
          onClick={() => setActiveStep('implants')}
          className="btn btn-primary text-xs shadow-md"
        >
          <span>Select Implants</span>
          <span className="arr">→</span>
        </button>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT: 3D Viewport with Landmarks */}
        <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#E2D9CB] rounded-3xl p-5 shadow-sm space-y-4">
          <AnatomicalCanvas3D
            structures={structures}
            showLandmarks={true}
            selectedLandmarkId={selectedLandmarkId}
            onSelectLandmark={setSelectedLandmarkId}
          />
        </div>

        {/* RIGHT: Landmark Point List & Detailed Coordinates */}
        <div className="lg:col-span-5 space-y-4">
          {/* Selected Landmark Details Card */}
          <div className="bg-[#FFFFFF] border border-[#B83C25]/50 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-[#E2D9CB] pb-2.5">
              <span className="text-xs font-mono text-[#B83C25] uppercase font-bold flex items-center gap-1.5">
                <Target size={15} /> Active Selected Landmark
              </span>
              <span className="text-xs font-mono text-[#2B5236] bg-[#DCE7D6] px-2.5 py-0.5 rounded-full border border-[#BED2B5] font-bold">
                Confidence: {(selectedLm.confidence * 100).toFixed(1)}%
              </span>
            </div>

            <div>
              <h4 className="text-base font-bold text-[#2B2723]">{selectedLm.name}</h4>
              <p className="text-xs text-[#5A534A] mt-1">{selectedLm.description}</p>
            </div>

            <div className="bg-[#FAF9F5] p-3 rounded-xl border border-[#E2D9CB] font-mono text-xs">
              <span className="text-[#6B635A] block text-[10px] uppercase mb-1">Coordinates [X, Y, Z] (mm)</span>
              <div className="text-[#B83C25] font-bold text-sm">
                [{selectedLm.coordinates.map(c => c.toFixed(1)).join(', ')}]
              </div>
            </div>
          </div>

          {/* All Landmarks List */}
          <div className="bg-[#FFFFFF] border border-[#E2D9CB] rounded-2xl p-4 shadow-xs space-y-2 max-h-[380px] overflow-y-auto">
            <h4 className="text-xs font-bold text-[#2B2723] uppercase font-mono tracking-wider mb-2">
              Detected Anatomical Landmarks ({landmarks.length})
            </h4>
            {landmarks.map((lm) => (
              <div
                key={lm.id}
                onClick={() => setSelectedLandmarkId(lm.id)}
                className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between text-xs ${
                  lm.id === selectedLandmarkId
                    ? 'bg-[#FDF2EE] border-[#B83C25] text-[#2B2723] shadow-xs'
                    : 'bg-[#FAF9F5] border-[#EEE7DB] text-[#5A534A] hover:border-[#D8CDBB]'
                }`}
              >
                <div>
                  <div className="font-bold text-[#2B2723]">{lm.name}</div>
                  <div className="font-mono text-[10px] text-[#6B635A] mt-0.5">
                    [{lm.coordinates.map(c => c.toFixed(0)).join(', ')}]
                  </div>
                </div>
                <div className="text-right font-mono text-[11px] font-semibold text-[#3F6B4A]">
                  {(lm.confidence * 100).toFixed(0)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
