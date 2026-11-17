import React from 'react';
import { useOrthoTwin } from '../../context/OrthoTwinContext';
import { User, Cpu, AlertCircle, Menu, X } from 'lucide-react';

interface HeaderProps {
  onToggleMobileMenu?: () => void;
  isMobileMenuOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu, isMobileMenuOpen }) => {
  const { patient } = useOrthoTwin();

  return (
    <header className="h-16 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#E2D9CB] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-[0_2px_12px_rgba(70,45,20,0.04)]">
      {/* Left: Mobile Menu Toggle & Patient Context */}
      <div className="flex items-center gap-3">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="p-2 rounded-xl bg-[#FFFFFF] hover:bg-[#ECE6DB] border border-[#E2D9CB] text-[#2B2723] md:hidden flex items-center justify-center transition active:scale-95 shadow-sm"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X size={20} className="text-[#B83C25]" /> : <Menu size={20} />}
          </button>
        )}

        <div className="flex items-center gap-2 bg-[#FFFFFF] px-3 py-1.5 rounded-full border border-[#E2D9CB] text-xs shadow-sm">
          <User size={14} className="text-[#B83C25] shrink-0" />
          <span className="font-semibold text-[#2B2723] truncate max-w-[120px] sm:max-w-none">{patient.name}</span>
          <span className="text-[#6B635A] font-mono text-[11px] hidden sm:inline">({patient.patient_id})</span>
        </div>
        
        <div className="hidden md:flex items-center gap-3 text-xs text-[#5A534A] font-mono">
          <span>Age: <strong className="text-[#2B2723]">{patient.age}</strong></span>
          <span className="text-[#D8CDBB]">•</span>
          <span>Sex: <strong className="text-[#2B2723]">{patient.sex}</strong></span>
          <span className="text-[#D8CDBB]">•</span>
          <span>Procedure: <strong className="text-[#B83C25] font-semibold">{patient.procedure}</strong></span>
        </div>
      </div>

      {/* Right System Info & Disclaimer */}
      <div className="flex items-center gap-2 sm:gap-3 text-xs">
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF9F5] text-[#6B635A] border border-[#E2D9CB] text-[11px]">
          <AlertCircle size={13} className="text-[#C98A1B]" />
          <span>Clinical Decision Support · Not an Autonomous Diagnosis</span>
        </div>

        <div className="flex items-center gap-2 bg-[#DCE7D6] text-[#2B5236] px-3 py-1 rounded-full font-mono text-[11px] font-semibold border border-[#BED2B5] shadow-xs">
          <span className="live w-2 h-2 rounded-full bg-[#3F6B4A] inline-block" />
          <span>AI TWIN READY</span>
        </div>
      </div>
    </header>
  );
};
