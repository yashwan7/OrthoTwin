import React from 'react';
import { ImplantSpecs } from '../../types';
import { Sliders, CheckCircle2, ShieldCheck, Box } from 'lucide-react';

interface ImplantCardProps {
  implant: ImplantSpecs;
  isSelected: boolean;
  onSelect: () => void;
}

export const ImplantCard: React.FC<ImplantCardProps> = ({ implant, isSelected, onSelect }) => {
  return (
    <div
      onClick={onSelect}
      className={`border rounded-2xl p-5 transition-all cursor-pointer flex flex-col justify-between space-y-4 group relative overflow-hidden shadow-xs ${
        isSelected
          ? 'bg-[#FDF2EE] border-[#B83C25] shadow-md ring-2 ring-[#F2CDC1]'
          : 'bg-[#FFFFFF] border-[#E2D9CB] hover:border-[#B83C25]/60 hover:bg-[#FAF9F5]'
      }`}
    >
      {/* Vendor Neutral Badge */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#EFE9DF] text-[#2B2723] border border-[#D8CDBB] uppercase">
          {implant.type}
        </span>
        <span className="text-[10px] font-mono text-[#6B635A]">
          {implant.manufacturer_neutral_id}
        </span>
      </div>

      <div>
        <h3 className="font-bold text-[#2B2723] text-base group-hover:text-[#B83C25] transition">
          {implant.name}
        </h3>
        <p className="text-[#5A534A] text-xs mt-1.5 leading-relaxed">
          {implant.description}
        </p>
      </div>

      {/* Geometry Dimensions */}
      <div className="bg-[#FAF9F5] p-3 rounded-xl border border-[#E2D9CB] text-xs font-mono space-y-1">
        <div className="text-[10px] text-[#6B635A] uppercase font-bold">Geometry Specifications</div>
        {implant.glenosphere_options.length > 0 && (
          <div className="text-[#5A534A] text-[11px]">
            Glenosphere: <strong className="text-[#B83C25]">{implant.glenosphere_options.join(' / ')} mm</strong>
          </div>
        )}
        <div className="text-[#5A534A] text-[11px]">
          Material: <strong className="text-[#2B2723]">{implant.material}</strong>
        </div>
      </div>

      {/* Select Action */}
      <div className="pt-2 border-t border-[#EEE7DB] flex items-center justify-between text-xs">
        <span className="text-[#6B635A] font-mono text-[11px]">Neutral Spec</span>
        <button
          className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition ${
            isSelected
              ? 'bg-[#B83C25] text-white font-bold shadow-xs'
              : 'bg-[#ECE6DB] text-[#2B2723] group-hover:bg-[#B83C25] group-hover:text-white'
          }`}
        >
          {isSelected ? (
            <>
              <CheckCircle2 size={13} />
              <span>Selected</span>
            </>
          ) : (
            <span>Select System</span>
          )}
        </button>
      </div>
    </div>
  );
};
