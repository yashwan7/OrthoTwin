import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, GizmoHelper, GizmoViewport } from '@react-three/drei';
import { ProceduralShoulderMesh } from './ProceduralShoulderMesh';
import { ProceduralImplantMesh } from './ProceduralImplantMesh';
import { ImplantPose, ImplantSpecs, StructureSegmentation } from '../../types';
import { Layers, Target, CheckCircle2 } from 'lucide-react';

interface OverlayCanvas3DProps {
  structures: StructureSegmentation[];
  implant: ImplantSpecs;
  plannedPose: ImplantPose;
  actualPose: ImplantPose;
  overallScore: number;
}

export const OverlayCanvas3D: React.FC<OverlayCanvas3DProps> = ({
  structures,
  implant,
  plannedPose,
  actualPose,
  overallScore
}) => {
  return (
    <div className="relative w-full h-[340px] sm:h-[440px] md:h-[500px] bg-[#050507] rounded-xl border border-[#1c1c24] overflow-hidden shadow-2xl medical-grid">
      {/* Title & Legend Overlay */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 bg-[#0d0d11]/90 backdrop-blur-md border border-[#1c1c24] px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs">
        <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
          <Layers size={14} className="shrink-0" />
          <span>Plan vs Post-Op Overlay</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs font-mono">
          <span className="flex items-center gap-1 text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block shadow-[0_0_8px_#10b981]" />
            Planned
          </span>
          <span className="flex items-center gap-1 text-fuchsia-300">
            <span className="w-2 h-2 rounded-full bg-fuchsia-500 inline-block shadow-[0_0_8px_#d946ef]" />
            Actual
          </span>
        </div>
      </div>

      {/* Alignment Fidelity Score Badge */}
      <div className="absolute top-2 right-2 z-10 bg-emerald-950/90 border border-emerald-600 px-2.5 py-1 sm:py-1.5 rounded-lg text-emerald-300 text-[10px] sm:text-xs font-mono flex items-center gap-1.5 shadow-lg">
        <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
        <div>
          <div className="text-[9px] text-emerald-400/80 uppercase tracking-wider hidden sm:block">Fidelity</div>
          <div className="text-xs sm:text-sm font-bold text-white">{overallScore}% Match</div>
        </div>
      </div>

      <Canvas
        camera={{ position: [2.5, 1.8, 5.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 15, 10]} intensity={1.3} />
        <directionalLight position={[-10, -5, -5]} intensity={0.5} color="#a1a1aa" />
        <pointLight position={[0, 4, 4]} intensity={0.6} color="#10b981" />

        {/* Patient Bones */}
        <ProceduralShoulderMesh structures={structures} showLandmarks={false} />

        {/* Planned Pose (Cyan Wireframe / Semi-transparent) */}
        <ProceduralImplantMesh
          implant={implant}
          pose={plannedPose}
          isTransparent
          overrideColor="#00e5ff"
        />

        {/* Post-Op Actual Pose (Magenta Solid Mesh) */}
        <ProceduralImplantMesh
          implant={implant}
          pose={actualPose}
          overrideColor="#d946ef"
        />

        <OrbitControls makeDefault enablePan enableZoom target={[0, -0.3, 0]} />

        <GizmoHelper alignment="bottom-right" margin={[60, 60]}>
          <GizmoViewport axisColors={['#f43f5e', '#10b981', '#3b82f6']} labelColor="#ffffff" />
        </GizmoHelper>
      </Canvas>
    </div>
  );
};
