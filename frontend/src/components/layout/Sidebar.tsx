import React from 'react';
import { useOrthoTwin } from '../../context/OrthoTwinContext';
import { WorkflowStepId } from '../../types';
import {
  LayoutDashboard,
  UploadCloud,
  Layers,
  Box,
  Sliders,
  Activity,
  GitCompare,
  FileSpreadsheet,
  ActivitySquare,
  PlayCircle,
  X,
  Stethoscope,
  ArrowRight,
} from 'lucide-react';

interface NavItem {
  id: WorkflowStepId;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { activeStep, setActiveStep, loadDemoPatient } = useOrthoTwin();

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'triage', label: 'Prioritisation', icon: Stethoscope, badge: 'AI' },
    { id: 'upload', label: 'Upload CT & Scans', icon: UploadCloud },
    { id: 'segmentation', label: 'AI Segmentation', icon: Layers },
    { id: 'reconstruction', label: '3D Digital Twin', icon: Box },
    { id: 'landmarks', label: 'Anatomical Landmarks', icon: ActivitySquare },
    { id: 'implants', label: 'Implant Library', icon: Sliders },
    { id: 'planning', label: 'Virtual Planning', icon: Sliders, badge: 'P0' },
    { id: 'simulation', label: 'Biomechanics Sim', icon: Activity },
    { id: 'plan-vs-reality', label: 'Plan vs Reality', icon: GitCompare },
    { id: 'reports', label: 'Surgical Report', icon: FileSpreadsheet },
  ];

  const handleStepClick = (id: WorkflowStepId) => {
    setActiveStep(id);
    if (onClose) onClose();
  };

  const sidebarContent = (
    <aside className="w-64 bg-[#FAF9F5] border-r border-[#E2D9CB] flex flex-col h-full select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#E2D9CB] flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Official Bone & Vermilion Logo Icon */}
          <svg width="34" height="34" viewBox="0 0 38 38" aria-hidden="true" className="shrink-0">
            <circle cx="17" cy="19" r="12" fill="#F2CDC1" stroke="#B83C25" strokeWidth="2"></circle>
            <path d="M24 5 L33 5 L33 14" fill="none" stroke="#2B2723" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"></path>
            <circle cx="17" cy="19" r="3.5" fill="#B83C25"></circle>
          </svg>
          <div>
            <h1 className="font-bold text-lg text-[#2B2723] tracking-tight leading-none">OrthoTwin</h1>
            <p className="text-[11px] text-[#5A534A] font-medium tracking-tight mt-0.5 font-mono">
              Surgical Decision Twin
            </p>
          </div>
        </div>

        {/* Mobile Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg bg-[#FFFFFF] text-[#5A534A] hover:text-[#2B2723] border border-[#E2D9CB]"
            aria-label="Close Sidebar"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {/* ── Decision Support Section ─────────────────────────── */}
        <div className="px-3 pb-1.5 text-[11px] uppercase font-semibold text-[#6B635A] font-mono tracking-wider">
          Decision Support
        </div>

        <button
          onClick={() => handleStepClick('dashboard')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
            activeStep === 'dashboard'
              ? 'bg-[#FFFFFF] text-[#B83C25] border border-[#E2D9CB] shadow-sm font-semibold'
              : 'text-[#5A534A] hover:text-[#2B2723] hover:bg-[#ECE6DB]/60'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <LayoutDashboard size={16} className={activeStep === 'dashboard' ? 'text-[#B83C25]' : 'text-[#6B635A] group-hover:text-[#2B2723]'} />
            <span>Overview & Cases</span>
          </div>
        </button>

        <button
          onClick={() => handleStepClick('triage')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
            activeStep === 'triage'
              ? 'bg-[#F6D8CF] text-[#8E2C18] border border-[#E59A85] shadow-xs font-bold'
              : 'text-[#8E2C18] bg-[#FDF2EE]/70 hover:bg-[#F6D8CF]/80 border border-[#F2CDC1]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Stethoscope size={16} className="text-[#B83C25]" />
            <span>Clinical Triage</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#B83C25] text-white font-bold">
            URGENT
          </span>
        </button>

        {/* ── Surgical Workflow Section ────────────────────────── */}
        <div className="px-3 pt-4 pb-1.5 text-[11px] uppercase font-semibold text-[#6B635A] font-mono tracking-wider">
          Patient Workflow
        </div>

        {navItems.filter(i => i.id !== 'dashboard' && i.id !== 'triage').map((item) => {
          const Icon = item.icon;
          const isActive = activeStep === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleStepClick(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-[#FFFFFF] text-[#B83C25] border border-[#E2D9CB] shadow-sm font-semibold'
                  : 'text-[#5A534A] hover:text-[#2B2723] hover:bg-[#ECE6DB]/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  size={15}
                  className={`transition-colors ${
                    isActive ? 'text-[#B83C25]' : 'text-[#6B635A] group-hover:text-[#2B2723]'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-[#EFE9DF] text-[#5A534A] border border-[#D8CDBB]">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Demo Patient Fast Load Action */}
      <div className="p-4 border-t border-[#E2D9CB] bg-[#F6F3EE]">
        <button
          onClick={() => {
            loadDemoPatient();
            if (onClose) onClose();
          }}
          className="w-full btn btn-primary text-xs shadow-md group"
        >
          <PlayCircle size={15} />
          <span>Load Demo Case</span>
          <span className="arr text-xs">→</span>
        </button>
        <p className="text-[10px] text-center text-[#6B635A] mt-2 font-mono">
          ORT-2026-001 · 240 Thin-Slice CT
        </p>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-screen sticky top-0 z-30">
        {sidebarContent}
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-[#2B2723]/60 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          <div className="relative w-64 max-w-[80vw] h-full z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
