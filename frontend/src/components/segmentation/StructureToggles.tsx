import React from 'react';
import { StructureSegmentation } from '../../types';
import { Eye, EyeOff, Layers } from 'lucide-react';

interface StructureTogglesProps {
  structures: StructureSegmentation[];
  onToggle: (name: string) => void;
}

export const StructureToggles: React.FC<StructureTogglesProps> = ({ structures, onToggle }) => {
  return (
    <div className="bg-[#FFFFFF] border border-[#E2D9CB] rounded-2xl p-4 space-y-3 shadow-xs">
      <div className="flex items-center justify-between border-b border-[#E2D9CB] pb-2.5">
        <h3 className="font-bold text-[#2B2723] text-xs flex items-center gap-2">
          <Layers size={15} className="text-[#B83C25]" /> Anatomical Structures
        </h3>
        <span className="text-[11px] font-mono text-[#6B635A] bg-[#FAF9F5] px-2 py-0.5 rounded-full border border-[#E2D9CB]">
          {structures.filter(s => s.visible).length} Visible
        </span>
      </div>

      <div className="space-y-2">
        {structures.map((struct) => (
          <div
            key={struct.name}
            onClick={() => onToggle(struct.name)}
            className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between text-xs ${
              struct.visible
                ? 'bg-[#FAF9F5] border-[#E2D9CB] text-[#2B2723] shadow-2xs'
                : 'bg-[#F6F3EE] border-[#E2D9CB]/50 text-[#6B635A] opacity-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span
                className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs border border-black/10"
                style={{ backgroundColor: struct.color }}
              />
              <div>
                <span className="font-bold block leading-none">{struct.name}</span>
                <span className="text-[10px] font-mono text-[#6B635A] mt-1 block">
                  {struct.volume_cc} cc | Dice: {struct.quality_score}
                </span>
              </div>
            </div>

            <button className="text-[#5A534A] hover:text-[#B83C25] p-1">
              {struct.visible ? <Eye size={15} className="text-[#B83C25]" /> : <EyeOff size={15} />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
