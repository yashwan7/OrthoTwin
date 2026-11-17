import React, { useState } from 'react';
import { OrthoTwinProvider, useOrthoTwin } from './context/OrthoTwinContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardView } from './components/dashboard/DashboardView';
import { ClinicalTriageView } from './components/triage/ClinicalTriageView';
import { CTUploadView } from './components/ct-upload/CTUploadView';
import { SegmentationView } from './components/segmentation/SegmentationView';
import { ReconstructionView } from './components/3d-reconstruction/ReconstructionView';
import { LandmarkPanel } from './components/landmarks/LandmarkPanel';
import { ImplantLibraryView } from './components/implant-library/ImplantLibraryView';
import { PlanningView } from './components/planning/PlanningView';
import { SimulationView } from './components/simulation/SimulationView';
import { PlanVsRealityView } from './components/plan-vs-reality/PlanVsRealityView';
import { ReportView } from './components/report/ReportView';
import { WorkflowStepId } from './types';
import {
  LayoutDashboard,
  UploadCloud,
  Box,
  Sliders,
  Activity,
  FileSpreadsheet,
  Stethoscope,
} from 'lucide-react';

interface MainContentProps {
  onToggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

const MainContent: React.FC<MainContentProps> = ({ onToggleMobileMenu, isMobileMenuOpen }) => {
  const { activeStep, setActiveStep } = useOrthoTwin();

  const renderActiveStep = () => {
    switch (activeStep) {
      case 'dashboard':
        return <DashboardView />;
      case 'triage':
        return <ClinicalTriageView />;
      case 'upload':
        return <CTUploadView />;
      case 'segmentation':
        return <SegmentationView />;
      case 'reconstruction':
        return <ReconstructionView />;
      case 'landmarks':
        return <LandmarkPanel />;
      case 'implants':
        return <ImplantLibraryView />;
      case 'planning':
        return <PlanningView />;
      case 'simulation':
        return <SimulationView />;
      case 'plan-vs-reality':
        return <PlanVsRealityView />;
      case 'reports':
        return <ReportView />;
      default:
        return <DashboardView />;
    }
  };

  const mobileNavItems: { id: WorkflowStepId; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard',   label: 'Dash',   icon: LayoutDashboard },
    { id: 'triage',      label: 'Triage', icon: Stethoscope     },
    { id: 'upload',      label: 'CT',     icon: UploadCloud     },
    { id: 'planning',    label: 'Plan',   icon: Sliders         },
    { id: 'simulation',  label: 'Sim',    icon: Activity        },
    { id: 'reports',     label: 'Report', icon: FileSpreadsheet },
  ];

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F6F3EE] text-[#2B2723] min-h-screen">
      <Header onToggleMobileMenu={onToggleMobileMenu} isMobileMenuOpen={isMobileMenuOpen} />
      
      <main className="flex-1 p-3 sm:p-6 pb-20 md:pb-6 overflow-y-auto max-w-[1600px] w-full mx-auto">
        {renderActiveStep()}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-lg border-t border-[#E2D9CB] px-2 py-1.5 flex items-center justify-around shadow-lg">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeStep === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveStep(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-medium transition ${
                isActive
                  ? 'text-[#B83C25] font-bold bg-[#F2CDC1]/40'
                  : 'text-[#6B635A] hover:text-[#2B2723]'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-[#B83C25]' : 'text-[#6B635A]'} />
              <span className="mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  return (
    <OrthoTwinProvider>
      <div className="flex min-h-screen bg-[#F6F3EE] text-[#2B2723] font-sans antialiased">
        <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        <MainContent
          onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
          isMobileMenuOpen={mobileMenuOpen}
        />
      </div>
    </OrthoTwinProvider>
  );
}

export default App;

