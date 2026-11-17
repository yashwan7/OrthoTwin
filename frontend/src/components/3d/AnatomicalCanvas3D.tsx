import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, GizmoHelper, GizmoViewport } from '@react-three/drei';
import { ProceduralShoulderMesh } from './ProceduralShoulderMesh';
import { StructureSegmentation } from '../../types';
import { RotateCcw, Eye, Compass } from 'lucide-react';

interface AnatomicalCanvas3DProps {
  structures: StructureSegmentation[];
  showLandmarks?: boolean;
  selectedLandmarkId?: string | null;
  onSelectLandmark?: (id: string) => void;
}

export const AnatomicalCanvas3D: React.FC<AnatomicalCanvas3DProps> = ({
  structures,
  showLandmarks = true,
  selectedLandmarkId = null,
  onSelectLandmark
}) => {
  const controlsRef = useRef<any>(null);

  const setViewPreset = (view: 'front' | 'back' | 'superior' | 'inferior' | 'medial' | 'lateral') => {
    if (!controlsRef.current) return;

    const distance = 8;
    switch (view) {
      case 'front':
        controlsRef.current.object.position.set(0, 0, distance);
        break;
      case 'back':
        controlsRef.current.object.position.set(0, 0, -distance);
        break;
      case 'superior':
        controlsRef.current.object.position.set(0, distance, 0.01);
        break;
      case 'inferior':
        controlsRef.current.object.position.set(0, -distance, 0.01);
        break;
      case 'medial':
        controlsRef.current.object.position.set(-distance, 0, 0);
        break;
      case 'lateral':
        controlsRef.current.object.position.set(distance, 0, 0);
        break;
    }
    controlsRef.current.target.set(0, -0.5, 0);
    controlsRef.current.update();
  };

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.object.position.set(3, 2, 7);
      controlsRef.current.target.set(0, -0.5, 0);
      controlsRef.current.update();
    }
  };

  return (
    <div className="relative w-full h-[340px] sm:h-[440px] md:h-[520px] bg-[#050507] rounded-xl border border-[#1c1c24] overflow-hidden shadow-2xl medical-grid">
      {/* Viewport Header Controls */}
      <div className="absolute top-2 left-2 right-2 sm:right-auto z-10 flex flex-wrap items-center gap-1.5 bg-[#0d0d11]/90 backdrop-blur-md border border-[#1c1c24] p-1.5 rounded-lg text-[11px] sm:text-xs max-h-[110px] overflow-y-auto">
        <span className="text-emerald-400 font-semibold px-1 flex items-center gap-1">
          <Eye size={13} /> Views
        </span>
        <div className="h-3.5 w-px bg-[#1c1c24] mx-0.5" />
        <button onClick={() => setViewPreset('front')} className="px-1.5 py-0.5 rounded bg-[#14141a] hover:bg-emerald-950/50 hover:text-emerald-300 transition text-zinc-300 border border-[#22222a]">Front</button>
        <button onClick={() => setViewPreset('back')} className="px-1.5 py-0.5 rounded bg-[#14141a] hover:bg-emerald-950/50 hover:text-emerald-300 transition text-zinc-300 border border-[#22222a]">Back</button>
        <button onClick={() => setViewPreset('superior')} className="px-1.5 py-0.5 rounded bg-[#14141a] hover:bg-emerald-950/50 hover:text-emerald-300 transition text-zinc-300 border border-[#22222a]">Sup</button>
        <button onClick={() => setViewPreset('inferior')} className="px-1.5 py-0.5 rounded bg-[#14141a] hover:bg-emerald-950/50 hover:text-emerald-300 transition text-zinc-300 border border-[#22222a]">Inf</button>
        <button onClick={() => setViewPreset('medial')} className="px-1.5 py-0.5 rounded bg-[#14141a] hover:bg-emerald-950/50 hover:text-emerald-300 transition text-zinc-300 border border-[#22222a]">Med</button>
        <button onClick={() => setViewPreset('lateral')} className="px-1.5 py-0.5 rounded bg-[#14141a] hover:bg-emerald-950/50 hover:text-emerald-300 transition text-zinc-300 border border-[#22222a]">Lat</button>
        <div className="h-3.5 w-px bg-[#1c1c24] mx-0.5" />
        <button onClick={resetCamera} className="p-0.5 rounded bg-[#14141a] hover:bg-emerald-950/50 text-zinc-300 flex items-center gap-1 px-1.5 border border-[#22222a]">
          <RotateCcw size={11} /> Reset
        </button>
      </div>

      {/* 3D Viewport Title Badge */}
      <div className="hidden sm:flex absolute bottom-3 left-3 z-10 bg-[#0d0d11]/90 backdrop-blur-md px-2.5 py-1 rounded-md border border-[#1c1c24] text-[10px] sm:text-xs font-mono text-zinc-400 items-center gap-1.5">
        <Compass size={13} className="text-emerald-400" />
        <span>3D Patient Reconstruction (ORT-2026-001)</span>
      </div>

      {/* R3F Canvas */}
      <Canvas
        camera={{ position: [3, 2, 7], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 15, 10]} intensity={1.2} />
        <directionalLight position={[-10, -10, -5]} intensity={0.4} color="#a1a1aa" />
        <pointLight position={[0, 5, 5]} intensity={0.6} color="#10b981" />

        <ProceduralShoulderMesh
          structures={structures}
          showLandmarks={showLandmarks}
          selectedLandmarkId={selectedLandmarkId}
          onSelectLandmark={onSelectLandmark}
        />

        <OrbitControls
          ref={controlsRef}
          makeDefault
          enablePan
          enableZoom
          rotateSpeed={0.8}
          target={[0, -0.5, 0]}
        />

        <GizmoHelper alignment="bottom-right" margin={[60, 60]}>
          <GizmoViewport axisColors={['#f43f5e', '#10b981', '#3b82f6']} labelColor="#ffffff" />
        </GizmoHelper>
      </Canvas>
    </div>
  );
};
