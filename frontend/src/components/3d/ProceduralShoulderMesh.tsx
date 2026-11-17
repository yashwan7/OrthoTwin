import React, { useMemo } from 'react';
import * as THREE from 'three';
import { StructureSegmentation } from '../../types';

interface ProceduralShoulderMeshProps {
  structures: StructureSegmentation[];
  showLandmarks?: boolean;
  selectedLandmarkId?: string | null;
  onSelectLandmark?: (id: string) => void;
}

export const ProceduralShoulderMesh: React.FC<ProceduralShoulderMeshProps> = ({
  structures,
  showLandmarks = true,
  selectedLandmarkId = null,
  onSelectLandmark
}) => {
  const getVisibility = (name: string) => {
    const struct = structures.find(s => s.name === name);
    return struct ? struct.visible : true;
  };

  return (
    <group position={[0, -2, 0]}>
      {/* SCAPULA BODY */}
      {getVisibility('Scapula') && (
        <group name="ScapulaGroup">
          {/* Main Scapular Blade / Fossa */}
          <mesh position={[-1.2, 0.4, -0.6]} rotation={[0.1, -0.2, -0.15]}>
            <cylinderGeometry args={[0.05, 1.8, 2.8, 32, 1, false, 0, Math.PI * 0.95]} />
            <meshStandardMaterial
              color="#e2e8f0"
              roughness={0.4}
              metalness={0.1}
              polygonOffset
              polygonOffsetFactor={1}
            />
          </mesh>

          {/* Scapular Spine */}
          <mesh position={[-0.8, 1.2, -0.9]} rotation={[0.4, 0.2, 0.5]}>
            <boxGeometry args={[2.2, 0.25, 0.6]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.45} />
          </mesh>

          {/* Acromion Process */}
          <mesh position={[0.2, 1.7, -0.7]} rotation={[0.2, 0.1, 0.1]}>
            <torusGeometry args={[0.45, 0.15, 16, 32, Math.PI * 0.8]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.4} />
          </mesh>

          {/* Coracoid Process */}
          <mesh position={[0.1, 1.4, 0.4]} rotation={[0.8, -0.5, 0.3]}>
            <cylinderGeometry args={[0.12, 0.16, 0.9, 16]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.4} />
          </mesh>
        </group>
      )}

      {/* GLENOID VAULT */}
      {getVisibility('Glenoid') && (
        <group name="GlenoidGroup" position={[-0.2, 0.8, 0.15]} rotation={[0, 0.2, 0.2]}>
          {/* Glenoid Articular Surface (Concave Pear Shape) */}
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <cylinderGeometry args={[0.75, 0.9, 0.4, 32]} />
            <meshStandardMaterial
              color="#38bdf8"
              roughness={0.25}
              metalness={0.2}
              emissive="#0284c7"
              emissiveIntensity={0.15}
            />
          </mesh>
          {/* Glenoid Fossa Rim */}
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.75, 0.08, 16, 32]} />
            <meshStandardMaterial color="#0284c7" roughness={0.3} />
          </mesh>
        </group>
      )}

      {/* HUMERUS */}
      {getVisibility('Humerus') && (
        <group name="HumerusGroup" position={[1.4, 0.5, 0.2]} rotation={[0, 0, -0.2]}>
          {/* Humeral Head (Hemisphere) */}
          <mesh position={[-0.45, 0.15, -0.05]} rotation={[0, -0.4, 0.2]}>
            <sphereGeometry args={[0.95, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            <meshStandardMaterial
              color="#93c5fd"
              roughness={0.3}
              metalness={0.1}
              emissive="#1d4ed8"
              emissiveIntensity={0.1}
            />
          </mesh>

          {/* Greater & Lesser Tuberosity */}
          <mesh position={[-0.1, 0.1, 0.25]} rotation={[0.2, 0.1, 0]}>
            <sphereGeometry args={[0.55, 16, 16]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.5} />
          </mesh>

          {/* Humeral Shaft */}
          <mesh position={[0.4, -1.8, 0]} rotation={[0, 0, -0.2]}>
            <cylinderGeometry args={[0.55, 0.42, 3.8, 32]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.4} />
          </mesh>
        </group>
      )}

      {/* CLAVICLE */}
      {getVisibility('Clavicle') && (
        <mesh position={[-0.4, 2.1, -0.2]} rotation={[0.1, 0.4, 0.25]}>
          <cylinderGeometry args={[0.15, 0.18, 2.6, 16]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.45} />
        </mesh>
      )}

      {/* ANATOMICAL LANDMARK MARKERS */}
      {showLandmarks && (
        <group name="Landmarks">
          {/* Glenoid Center */}
          <GlenoidMarker
            id="lm_glenoid_center"
            name="Glenoid Center"
            pos={[-0.2, 0.8, 0.35]}
            color="#00e5ff"
            isSelected={selectedLandmarkId === 'lm_glenoid_center'}
            onClick={() => onSelectLandmark && onSelectLandmark('lm_glenoid_center')}
          />
          {/* Glenoid Superior Rim */}
          <GlenoidMarker
            id="lm_glenoid_sup_rim"
            name="Glenoid Superior Rim"
            pos={[-0.2, 1.45, 0.35]}
            color="#10b981"
            isSelected={selectedLandmarkId === 'lm_glenoid_sup_rim'}
            onClick={() => onSelectLandmark && onSelectLandmark('lm_glenoid_sup_rim')}
          />
          {/* Glenoid Inferior Rim */}
          <GlenoidMarker
            id="lm_glenoid_inf_rim"
            name="Glenoid Inferior Rim"
            pos={[-0.2, 0.15, 0.35]}
            color="#10b981"
            isSelected={selectedLandmarkId === 'lm_glenoid_inf_rim'}
            onClick={() => onSelectLandmark && onSelectLandmark('lm_glenoid_inf_rim')}
          />
          {/* Humeral Head Center */}
          <GlenoidMarker
            id="lm_humeral_center"
            name="Humeral Head Center"
            pos={[1.05, 0.65, 0.15]}
            color="#f43f5e"
            isSelected={selectedLandmarkId === 'lm_humeral_center'}
            onClick={() => onSelectLandmark && onSelectLandmark('lm_humeral_center')}
          />
        </group>
      )}
    </group>
  );
};

interface LandmarkMarkerProps {
  id: string;
  name: string;
  pos: [number, number, number];
  color: string;
  isSelected: boolean;
  onClick: () => void;
}

const GlenoidMarker: React.FC<LandmarkMarkerProps> = ({ id, name, pos, color, isSelected, onClick }) => {
  return (
    <group position={pos} onClick={onClick}>
      <mesh>
        <sphereGeometry args={[isSelected ? 0.15 : 0.09, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isSelected ? 0.9 : 0.5}
        />
      </mesh>
      {isSelected && (
        <mesh>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshBasicMaterial color={color} wireframe transparent opacity={0.5} />
        </mesh>
      )}
    </group>
  );
};
