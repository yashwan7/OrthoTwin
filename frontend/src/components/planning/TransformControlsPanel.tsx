import React from 'react';
import { ImplantPose, ImplantSpecs } from '../../types';
import { Sliders, RotateCcw, Check, ShieldCheck, AlertCircle } from 'lucide-react';

interface TransformControlsPanelProps {
  implant: ImplantSpecs;
  pose: ImplantPose;
  onPoseChange: (updates: Partial<ImplantPose>) => void;
  onReset: () => void;
  onConfirm: () => void;
}

export const TransformControlsPanel: React.FC<TransformControlsPanelProps> = ({
  implant,
  pose,
  onPoseChange,
  onReset,
  onConfirm
}) => {
  return (
    <div className="bg-[#FFFFFF] border border-[#E2D9CB] rounded-2xl p-5 space-y-5 shadow-xs">
      <div className="flex items-center justify-between border-b border-[#E2D9CB] pb-3">
        <h3 className="font-bold text-[#2B2723] text-xs flex items-center gap-2">
          <Sliders size={16} className="text-[#B83C25]" /> Placement Parameters
        </h3>
        <button
          onClick={onReset}
          className="text-xs text-[#5A534A] hover:text-[#B83C25] flex items-center gap-1 font-mono transition"
        >
          <RotateCcw size={12} /> Reset Pose
        </button>
      </div>

      {/* Implant Size Selector */}
      {implant.glenosphere_options.length > 0 && (
        <div className="space-y-2">
          <label className="text-[#5A534A] text-xs font-mono font-medium block">Glenosphere Diameter Size</label>
          <div className="grid grid-cols-3 gap-2">
            {implant.glenosphere_options.map((sz) => (
              <button
                key={sz}
                onClick={() => onPoseChange({ glenosphere_size_mm: sz })}
                className={`py-2 rounded-xl text-xs font-mono border transition ${
                  pose.glenosphere_size_mm === sz
                    ? 'bg-[#B83C25] border-[#9E321E] text-white font-bold shadow-xs'
                    : 'bg-[#FAF9F5] border-[#E2D9CB] text-[#5A534A] hover:text-[#2B2723]'
                }`}
              >
                {sz} mm
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Angles: Inclination & Version */}
      <div className="space-y-4 pt-1">
        <div>
          <div className="flex justify-between text-xs font-mono mb-1.5">
            <span className="text-[#2B2723] font-medium">Target Inclination Angle</span>
            <span className="text-[#B83C25] font-bold">{pose.inclination_deg}°</span>
          </div>
          <input
            type="range"
            min="120"
            max="155"
            step="0.5"
            value={pose.inclination_deg}
            onChange={(e) => onPoseChange({ inclination_deg: Number(e.target.value) })}
            className="w-full h-1.5 bg-[#E2D9CB] rounded-lg appearance-none cursor-pointer accent-[#B83C25]"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono mb-1.5">
            <span className="text-[#2B2723] font-medium">Target Version Angle</span>
            <span className="text-[#B83C25] font-bold">{pose.version_deg}°</span>
          </div>
          <input
            type="range"
            min="-15"
            max="15"
            step="0.5"
            value={pose.version_deg}
            onChange={(e) => onPoseChange({ version_deg: Number(e.target.value) })}
            className="w-full h-1.5 bg-[#E2D9CB] rounded-lg appearance-none cursor-pointer accent-[#B83C25]"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono mb-1.5">
            <span className="text-[#2B2723] font-medium">Medial / Lateral Offset</span>
            <span className="text-[#B83C25] font-bold">{pose.offset_mm} mm</span>
          </div>
          <input
            type="range"
            min="15"
            max="40"
            step="0.5"
            value={pose.offset_mm}
            onChange={(e) => onPoseChange({ offset_mm: Number(e.target.value) })}
            className="w-full h-1.5 bg-[#E2D9CB] rounded-lg appearance-none cursor-pointer accent-[#B83C25]"
          />
        </div>
      </div>

      {/* Confirm Button */}
      <div className="pt-2">
        <button
          onClick={onConfirm}
          className="w-full btn btn-primary text-xs shadow-md"
        >
          <Check size={16} />
          <span>Confirm Placement & Simulate</span>
          <span className="arr">→</span>
        </button>
      </div>
    </div>
  );
};
