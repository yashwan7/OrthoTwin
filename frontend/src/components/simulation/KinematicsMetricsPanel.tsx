import React from 'react';
import { KinematicSimulationResult } from '../../types';
import { Activity, AlertTriangle, ShieldCheck, Zap, RotateCcw } from 'lucide-react';

interface KinematicsMetricsPanelProps {
  simulation: KinematicSimulationResult;
  abduction: number;
  flexion: number;
  rotation: number;
  onAbductionChange: (v: number) => void;
  onFlexionChange: (v: number) => void;
  onRotationChange: (v: number) => void;
}

export const KinematicsMetricsPanel: React.FC<KinematicsMetricsPanelProps> = ({
  simulation,
  abduction,
  flexion,
  rotation,
  onAbductionChange,
  onFlexionChange,
  onRotationChange
}) => {
  return (
    <div className="bg-[#FFFFFF] border border-[#E2D9CB] rounded-2xl p-5 space-y-5 shadow-xs">
      <div className="flex items-center justify-between border-b border-[#E2D9CB] pb-3">
        <h3 className="font-bold text-[#2B2723] text-xs flex items-center gap-2">
          <Activity size={16} className="text-[#B83C25]" /> Dynamic Kinematics Controls
        </h3>
        <span className="text-[11px] font-mono text-[#2B5236] bg-[#DCE7D6] px-2.5 py-0.5 rounded-full border border-[#BED2B5] font-bold">
          Simulation Active
        </span>
      </div>

      {/* Movement Sliders */}
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-xs font-mono mb-1.5">
            <span className="text-[#2B2723] font-medium">Abduction Joint Articulation</span>
            <span className="text-[#B83C25] font-bold">{abduction}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="140"
            value={abduction}
            onChange={(e) => onAbductionChange(Number(e.target.value))}
            className="w-full h-1.5 bg-[#E2D9CB] rounded-lg appearance-none cursor-pointer accent-[#B83C25]"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono mb-1.5">
            <span className="text-[#2B2723] font-medium">Forward Flexion Angle</span>
            <span className="text-[#B83C25] font-bold">{flexion}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="135"
            value={flexion}
            onChange={(e) => onFlexionChange(Number(e.target.value))}
            className="w-full h-1.5 bg-[#E2D9CB] rounded-lg appearance-none cursor-pointer accent-[#B83C25]"
          />
        </div>
      </div>

      {/* Impingement & Clearance Metrics */}
      <div className="bg-[#FAF9F5] p-4 rounded-xl border border-[#E2D9CB] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-[#5A534A] uppercase font-bold">Impingement Risk Status</span>
          <span className={`text-xs font-bold font-mono px-2.5 py-0.5 rounded-full border ${
            simulation.impingement_status === 'Low Risk'
              ? 'bg-[#DCE7D6] text-[#2B5236] border-[#BED2B5]'
              : 'bg-[#F6D8CF] text-[#8E2C18] border-[#E59A85]'
          }`}>
            {simulation.impingement_status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-1">
          <div className="bg-[#FFFFFF] p-2.5 rounded-lg border border-[#E2D9CB]">
            <span className="text-[#6B635A] block text-[10px]">Notch Clearance</span>
            <span className="text-[#2B2723] font-bold text-sm">{simulation.scapular_notch_clearance_mm} mm</span>
          </div>
          <div className="bg-[#FFFFFF] p-2.5 rounded-lg border border-[#E2D9CB]">
            <span className="text-[#6B635A] block text-[10px]">Joint Stability</span>
            <span className="text-[#2B5236] font-bold text-sm">{simulation.joint_stability_score}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
