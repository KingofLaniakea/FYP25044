/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Cylinder, Environment, Stars } from '@react-three/drei';
import * as THREE from 'three';

// Augment JSX namespace to include React Three Fiber intrinsic elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      pointLight: any;
      spotLight: any;
      meshStandardMaterial: any;
      group: any;
      mesh: any;
      cylinderGeometry: any;
    }
  }
}

interface DnaBasePairProps {
  position: [number, number, number];
  rotation: number;
  isMethylated: boolean;
}

const DnaBasePair: React.FC<DnaBasePairProps> = ({ position, rotation, isMethylated }) => {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Backbone L */}
      <Sphere args={[0.3, 16, 16]} position={[-1.5, 0, 0]}>
        <meshStandardMaterial color="#007D69" roughness={0.2} metalness={0.5} />
      </Sphere>
      
      {/* Backbone R */}
      <Sphere args={[0.3, 16, 16]} position={[1.5, 0, 0]}>
        <meshStandardMaterial color="#007D69" roughness={0.2} metalness={0.5} />
      </Sphere>

      {/* Rungs */}
      <Cylinder args={[0.08, 0.08, 3, 8]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#E5E7EB" transparent opacity={0.8} />
      </Cylinder>

      {/* Methylation Tag (5mC) */}
      {isMethylated && (
        <group position={[0.5, 0.4, 0]}>
            <Sphere args={[0.2, 16, 16]}>
                <meshStandardMaterial color="#E11D48" emissive="#E11D48" emissiveIntensity={0.8} />
            </Sphere>
            {/* Chemical bond visual */}
            <Cylinder args={[0.02, 0.02, 0.4, 8]} position={[0, -0.2, 0]}>
                <meshStandardMaterial color="#999" />
            </Cylinder>
        </group>
      )}
    </group>
  );
};

const DnaHelix = () => {
  const count = 40;
  // Generate random methylation sites
  const pairs = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      y: (i - count / 2) * 0.6,
      rotation: i * 0.5,
      isMethylated: Math.random() > 0.7 // Randomly methylated
    }));
  }, []);

  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
        ref.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <group ref={ref}>
      {pairs.map((pair, i) => (
        <DnaBasePair 
          key={i} 
          position={[0, pair.y, 0]} 
          rotation={pair.rotation} 
          isMethylated={pair.isMethylated} 
        />
      ))}
      {/* Connecting Strand Mesh (Simplified) */}
      <mesh>
         <cylinderGeometry args={[1.5, 1.5, count * 0.6, 32, 1, true]} />
         <meshStandardMaterial color="#007D69" side={THREE.BackSide} wireframe transparent opacity={0.05} />
      </mesh>
    </group>
  );
};

export const BioHeroScene: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 opacity-80 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 12], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight position={[-10, 0, 10]} angle={0.5} intensity={1} color="#007D69" />
        
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
          <group rotation={[0, 0, Math.PI / 6]}>
            <DnaHelix />
          </group>
        </Float>

        <Environment preset="city" />
        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
      </Canvas>
    </div>
  );
};