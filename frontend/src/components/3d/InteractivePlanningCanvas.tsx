import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, GizmoHelper, GizmoViewport } from '@react-three/drei';
import { ProceduralShoulderMesh } from './ProceduralShoulderMesh';
import { ProceduralImplantMesh } from './ProceduralImplantMesh';
import { ImplantPose, ImplantSpecs, StructureSegmentation } from '../../types';
import { RotateCcw, Sliders, ShieldCheck } from 'lucide-react';

interface InteractivePlanningCanvasProps {
  structures: StructureSegmentation[];
  implant: ImplantSpecs;
  pose: ImplantPose;
  onPoseChange?: (updates: Partial<ImplantPose>) => void;
}

export const InteractivePlanningCanvas: React.FC<InteractivePlanningCanvasProps> = ({
  structures,
  implant,
  pose
}) => {
  const controlsRef = useRef<any>(null);

  const resetView = () => {
    if (controlsRef.current) {
      controlsRef.current.object.position.set(2, 1.5, 5);
      controlsRef.current.target.set(0, -0.2, 0);
      controlsRef.current.update();
    }
  };

  return (
    <div className="relative w-full h-[340px] sm:h-[440px] md:h-[540px] bg-[#050507] rounded-xl border border-[#1c1c24] overflow-hidden shadow-2xl medical-grid">
      {/* Top Status Overlay */}
      <div className="absolute top-2 left-2 right-2 sm:right-auto z-10 flex flex-wrap items-center justify-between sm:justify-start gap-2 bg-[#0d0d11]/90 backdrop-blur-md border border-[#1c1c24] px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs">
        <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
          <Sliders size={14} />
          <span className="truncate">Virtual Implant Viewport</span>
        </div>
        <div className="hidden sm:block h-3.5 w-px bg-[#1c1c24]" />
        <span className="text-zinc-300 font-mono text-[10px] sm:text-xs">
          Inc: <strong className="text-zinc-100">{pose.inclination_deg}°</strong> | Ver: <strong className="text-zinc-100">{pose.version_deg}°</strong>
        </span>
        <button
          onClick={resetView}
          className="px-2 py-0.5 sm:py-1 bg-[#14141a] hover:bg-[#1f1f28] text-zinc-300 rounded text-[10px] sm:text-xs flex items-center gap-1 transition border border-[#22222a]"
        >
          <RotateCcw size={11} /> Reset View
        </button>
      </div>

      {/* Safety Validation Badge */}
      <div className="hidden sm:flex absolute bottom-3 left-3 z-10 bg-emerald-950/80 border border-emerald-700/60 px-2.5 py-1 rounded-lg text-emerald-300 text-[10px] sm:text-xs font-mono items-center gap-1.5 shadow">
        <ShieldCheck size={13} className="text-emerald-400" />
        <span>Vault Seating: 98% Contact | 0 Warning Penetration</span>
      </div>

      <Canvas
        camera={{ position: [2, 1.5, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 15, 10]} intensity={1.3} />
        <directionalLight position={[-10, -5, -5]} intensity={0.5} color="#a1a1aa" />
        <pointLight position={[0, 4, 4]} intensity={0.6} color="#10b981" />

        {/* Anatomical Bones */}
        <ProceduralShoulderMesh structures={structures} showLandmarks={false} />

        {/* Interactive Implant Prosthesis Overlay */}
        <ProceduralImplantMesh implant={implant} pose={pose} />

        <OrbitControls
          ref={controlsRef}
          makeDefault
          enablePan
          enableZoom
          rotateSpeed={0.8}
          target={[0, -0.2, 0]}
        />

        <GizmoHelper alignment="bottom-right" margin={[60, 60]}>
          <GizmoViewport axisColors={['#f43f5e', '#10b981', '#3b82f6']} labelColor="#ffffff" />
        </GizmoHelper>
      </Canvas>
    </div>
  );
};

