import React from 'react';
import { ImplantPose, ImplantSpecs } from '../../types';

interface ProceduralImplantMeshProps {
  implant: ImplantSpecs;
  pose: ImplantPose;
  isTransparent?: boolean;
  overrideColor?: string;
}

export const ProceduralImplantMesh: React.FC<ProceduralImplantMeshProps> = ({
  implant,
  pose,
  isTransparent = false,
  overrideColor
}) => {
  // Convert mm pose offsets to 3D world units (scale: 1 unit ~ 20mm)
  const scale = 0.05;

  const posX = (pose.translation_x || 0) * scale - 0.2;
  const posY = (pose.translation_y || 0) * scale + 0.8;
  const posZ = (pose.translation_z || 0) * scale + 0.35;

  // Degrees to Radians
  const rotX = (pose.rotation_x || 0) * (Math.PI / 180) + ((pose.inclination_deg - 145) * 0.015);
  const rotY = (pose.rotation_y || 0) * (Math.PI / 180) + (pose.version_deg * 0.015);
  const rotZ = (pose.rotation_z || 0) * (Math.PI / 180);

  const glenoRadius = (pose.glenosphere_size_mm || 39) * 0.018;

  const metalColor = overrideColor || "#e2e8f0";
  const polyColor = overrideColor || "#38bdf8";

  return (
    <group position={[posX, posY, posZ]} rotation={[rotX, rotY, rotZ]}>
      {/* GLENOID BASEPLATE & PEGS */}
      <group name="GlenoidBaseplate" position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        {/* Baseplate disc */}
        <mesh>
          <cylinderGeometry args={[0.38, 0.38, 0.12, 32]} />
          <meshStandardMaterial
            color={metalColor}
            metalness={0.9}
            roughness={0.2}
            transparent={isTransparent}
            opacity={isTransparent ? 0.4 : 1.0}
          />
        </mesh>
        {/* Central Anchoring Peg */}
        <mesh position={[0, -0.25, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.4, 16]} />
          <meshStandardMaterial
            color={metalColor}
            metalness={0.95}
            roughness={0.15}
            transparent={isTransparent}
            opacity={isTransparent ? 0.4 : 1.0}
          />
        </mesh>
        {/* Peripheral Screw Trajectories */}
        <mesh position={[0.2, -0.2, 0]} rotation={[0, 0, 0.15]}>
          <cylinderGeometry args={[0.04, 0.04, 0.35, 12]} />
          <meshStandardMaterial color="#00e5ff" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[-0.2, -0.2, 0]} rotation={[0, 0, -0.15]}>
          <cylinderGeometry args={[0.04, 0.04, 0.35, 12]} />
          <meshStandardMaterial color="#00e5ff" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* GLENOSPHERE HEAD */}
      {implant.type !== 'Anatomical Total Shoulder' && (
        <group name="Glenosphere" position={[0.18, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <mesh>
            <sphereGeometry args={[glenoRadius, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.52]} />
            <meshStandardMaterial
              color={metalColor}
              metalness={0.95}
              roughness={0.1}
              envMapIntensity={1.5}
              transparent={isTransparent}
              opacity={isTransparent ? 0.5 : 1.0}
            />
          </mesh>
        </group>
      )}

      {/* HUMERAL STEM & TRAY ASSEMBLY */}
      <group name="HumeralComponent" position={[0.65, -0.15, 0]} rotation={[0, 0, -0.2]}>
        {/* Humeral Polyethylene Liner Cup */}
        <mesh position={[-0.1, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <cylinderGeometry args={[glenoRadius * 1.02, glenoRadius * 0.9, 0.18, 32]} />
          <meshStandardMaterial
            color={polyColor}
            metalness={0.1}
            roughness={0.3}
            transparent={isTransparent}
            opacity={isTransparent ? 0.5 : 0.9}
          />
        </mesh>
        {/* Humeral Metaphyseal Stem */}
        <mesh position={[0.4, -0.8, 0]} rotation={[0, 0, -0.2]}>
          <cylinderGeometry args={[0.25, 0.14, 1.8, 24]} />
          <meshStandardMaterial
            color={metalColor}
            metalness={0.85}
            roughness={0.25}
            transparent={isTransparent}
            opacity={isTransparent ? 0.4 : 1.0}
          />
        </mesh>
      </group>
    </group>
  );
};
