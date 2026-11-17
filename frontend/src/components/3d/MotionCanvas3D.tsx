import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, GizmoHelper, GizmoViewport } from '@react-three/drei';
import { ProceduralImplantMesh } from './ProceduralImplantMesh';
import { ImplantPose, ImplantSpecs, StructureSegmentation } from '../../types';
import { Activity, AlertTriangle } from 'lucide-react';

interface MotionCanvas3DProps {
  structures: StructureSegmentation[];
  implant: ImplantSpecs;
  pose: ImplantPose;
  abductionDeg: number;
  flexionDeg: number;
  rotationDeg: number;
  impingementStatus: string;
}

const MotionShoulderGroup: React.FC<{
  structures: StructureSegmentation[];
  implant: ImplantSpecs;
  pose: ImplantPose;
  abductionDeg: number;
  flexionDeg: number;
  rotationDeg: number;
  impingementStatus: string;
}> = ({ structures, implant, pose, abductionDeg, flexionDeg, rotationDeg, impingementStatus }) => {
  const humerusRef = useRef<any>(null);

  useFrame(() => {
    if (humerusRef.current) {
      // Convert degrees to radians for joint articulation
      const abdRad = (abductionDeg * Math.PI) / 180;
      const flexRad = (flexionDeg * Math.PI) / 180;
      const rotRad = (rotationDeg * Math.PI) / 180;

      humerusRef.current.rotation.z = -abdRad * 0.8;
      humerusRef.current.rotation.x = flexRad * 0.7;
      humerusRef.current.rotation.y = rotRad * 0.5;
    }
  });

  const getVisibility = (name: string) => {
    const struct = structures.find(s => s.name === name);
    return struct ? struct.visible : true;
  };

  const isImpinging = impingementStatus === 'Impingement Detected';
  const isWarning = impingementStatus === 'Moderate Risk';

  const stressColor = isImpinging ? '#ef4444' : isWarning ? '#f59e0b' : '#10b981';

  return (
    <group position={[0, -1.8, 0]}>
      {/* STATIC SCAPULA & GLENOID */}
      {getVisibility('Scapula') && (
        <mesh position={[-1.2, 0.4, -0.6]} rotation={[0.1, -0.2, -0.15]}>
          <cylinderGeometry args={[0.05, 1.8, 2.8, 32, 1, false, 0, Math.PI * 0.95]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.4} />
        </mesh>
      )}

      {getVisibility('Glenoid') && (
        <group position={[-0.2, 0.8, 0.15]} rotation={[0, 0.2, 0.2]}>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <cylinderGeometry args={[0.75, 0.9, 0.4, 32]} />
            <meshStandardMaterial color="#38bdf8" roughness={0.25} emissive="#0284c7" emissiveIntensity={0.15} />
          </mesh>
        </group>
      )}

      {/* IMPLANT BASEPLATE & GLENOSPHERE (STATIC GLENOID SIDE) */}
      <ProceduralImplantMesh implant={implant} pose={pose} />

      {/* ARTICULATING HUMERUS & HUMERAL LINER ASSEMBLY */}
      <group ref={humerusRef} position={[0.8, 0.6, 0.2]}>
        {/* Humeral Shaft */}
        <mesh position={[0.6, -1.8, 0]} rotation={[0, 0, -0.2]}>
          <cylinderGeometry args={[0.55, 0.42, 3.8, 32]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.4} />
        </mesh>

        {/* Dynamic Stress / Impingement Contact Sphere */}
        <mesh position={[-0.2, -0.1, 0]}>
          <sphereGeometry args={[0.45, 24, 24]} />
          <meshStandardMaterial
            color={stressColor}
            emissive={stressColor}
            emissiveIntensity={isImpinging ? 0.8 : 0.2}
            transparent
            opacity={0.7}
          />
        </mesh>
      </group>
    </group>
  );
};

export const MotionCanvas3D: React.FC<MotionCanvas3DProps> = ({
  structures,
  implant,
  pose,
  abductionDeg,
  flexionDeg,
  rotationDeg,
  impingementStatus
}) => {
  return (
    <div className="relative w-full h-[340px] sm:h-[440px] md:h-[500px] bg-[#050507] rounded-xl border border-[#1c1c24] overflow-hidden shadow-2xl medical-grid">
      {/* Impingement Alert Badge */}
      <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 bg-[#0d0d11]/90 backdrop-blur-md border border-[#1c1c24] px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs">
        <Activity size={14} className="text-emerald-400 shrink-0" />
        <span className="font-semibold text-zinc-200 truncate">Motion Simulation</span>
      </div>

      <div className={`absolute top-2 right-2 z-10 px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-mono flex items-center gap-1 border shadow ${
        impingementStatus === 'Impingement Detected'
          ? 'bg-rose-950/90 border-rose-600 text-rose-300 animate-pulse'
          : impingementStatus === 'Moderate Risk'
          ? 'bg-amber-950/90 border-amber-600 text-amber-300'
          : 'bg-emerald-950/90 border-emerald-600 text-emerald-300'
      }`}>
        <AlertTriangle size={13} className="shrink-0" />
        <span>{impingementStatus}</span>
      </div>

      <Canvas
        camera={{ position: [3, 2, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 15, 10]} intensity={1.3} />
        <directionalLight position={[-10, -5, -5]} intensity={0.5} color="#a1a1aa" />
        <pointLight position={[0, 4, 4]} intensity={0.6} color="#10b981" />

        <MotionShoulderGroup
          structures={structures}
          implant={implant}
          pose={pose}
          abductionDeg={abductionDeg}
          flexionDeg={flexionDeg}
          rotationDeg={rotationDeg}
          impingementStatus={impingementStatus}
        />

        <OrbitControls makeDefault enablePan enableZoom target={[0, -0.3, 0]} />

        <GizmoHelper alignment="bottom-right" margin={[60, 60]}>
          <GizmoViewport axisColors={['#f43f5e', '#10b981', '#3b82f6']} labelColor="#ffffff" />
        </GizmoHelper>
      </Canvas>
    </div>
  );
};
