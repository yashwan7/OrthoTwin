import React from 'react';
import { useOrthoTwin } from '../../context/OrthoTwinContext';
import { ImplantCard } from './ImplantCard';
import { Sliders, ArrowRight, Shield, Layers } from 'lucide-react';

export const ImplantLibraryView: React.FC = () => {
  const { implants, selectedImplant, setSelectedImplant, setActiveStep } = useOrthoTwin();

  return (
    <div className="space-y-6 max-w-[1360px] mx-auto pb-10">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#ECE6DB] border border-[#DCD2C2] p-6 sm:p-8 rounded-3xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-[#B83C25] text-xs font-mono uppercase font-bold mb-1">
            <Shield size={14} /> Multi-Manufacturer Vendor Neutral Library
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2B2723] tracking-tight">
            Shoulder Arthroplasty Implant Library
          </h2>
          <p className="text-[#5A534A] text-xs sm:text-sm mt-1 max-w-2xl">
            Compare anatomical, reverse, stemless, and patient-specific wedge prosthesis geometries without manufacturer lock-in.
          </p>
        </div>

        <button
          onClick={() => setActiveStep('planning')}
          className="btn btn-primary text-xs shadow-md"
        >
          <span>Open Planning Canvas</span>
          <span className="arr">→</span>
        </button>
      </div>

      {/* Implant Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {implants.map((imp) => (
          <ImplantCard
            key={imp.id}
            implant={imp}
            isSelected={selectedImplant.id === imp.id}
            onSelect={() => setSelectedImplant(imp)}
          />
        ))}
      </div>
    </div>
  );
};
