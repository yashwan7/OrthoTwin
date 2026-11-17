import React from 'react';
import { AnatomicalMeasurements } from '../../types';
import { Ruler, Activity, Compass, Info } from 'lucide-react';

interface MeasurementsPanelProps {
  measurements: AnatomicalMeasurements;
}

export const MeasurementsPanel: React.FC<MeasurementsPanelProps> = ({ measurements }) => {
  return (
    <div className="bg-[#FFFFFF] border border-[#E2D9CB] rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs">
      <div className="flex items-center justify-between border-b border-[#E2D9CB] pb-2.5">
        <h3 className="font-bold text-[#2B2723] text-xs flex items-center gap-2">
          <Ruler size={15} className="text-[#B83C25]" /> Anatomical Morphometry
        </h3>
        <span className="text-[11px] font-mono font-bold text-[#2B5236] bg-[#DCE7D6] px-2.5 py-0.5 rounded-full border border-[#BED2B5]">
          AI Derived
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="bg-[#FAF9F5] p-3 rounded-xl border border-[#E2D9CB]">
          <span className="text-[#6B635A] block text-[10px] uppercase font-mono">Glenoid Inclination</span>
          <strong className="text-xl font-bold text-[#2B2723] font-mono mt-0.5 block">
            {measurements.glenoid_inclination}°
          </strong>
          <span className="text-[11px] text-[#3F6B4A] font-medium">Superior tilt (+12.4°)</span>
        </div>

        <div className="bg-[#FAF9F5] p-3 rounded-xl border border-[#E2D9CB]">
          <span className="text-[#6B635A] block text-[10px] uppercase font-mono">Glenoid Version</span>
          <strong className="text-xl font-bold text-[#2B2723] font-mono mt-0.5 block">
            {measurements.glenoid_version}°
          </strong>
          <span className="text-[11px] text-[#C98A1B] font-medium font-mono">Retroversion (-4.2°)</span>
        </div>

        <div className="bg-[#FAF9F5] p-3 rounded-xl border border-[#E2D9CB]">
          <span className="text-[#6B635A] block text-[10px] uppercase font-mono">Humeral Head Diameter</span>
          <strong className="text-base font-bold text-[#2B2723] font-mono mt-0.5 block">
            {measurements.humeral_head_diameter} mm
          </strong>
          <span className="text-[10px] text-[#6B635A] font-mono">Sphere fit R=23.4mm</span>
        </div>

        <div className="bg-[#FAF9F5] p-3 rounded-xl border border-[#E2D9CB]">
          <span className="text-[#6B635A] block text-[10px] uppercase font-mono">Humeral Offset</span>
          <strong className="text-base font-bold text-[#2B2723] font-mono mt-0.5 block">
            {measurements.humeral_offset} mm
          </strong>
          <span className="text-[10px] text-[#6B635A] font-mono">Lateralization ref</span>
        </div>
      </div>

      <div className="bg-[#FAF9F5] p-3 rounded-xl border border-[#E2D9CB] text-xs font-mono">
        <span className="text-[#6B635A] block text-[10px] uppercase mb-1">Center of Rotation (X, Y, Z)</span>
        <div className="text-[#B83C25] font-bold">
          [{measurements.center_of_rotation.join(', ')}] mm
        </div>
      </div>
    </div>
  );
};
