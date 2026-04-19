import React, { useRef, useMemo, Suspense, memo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Cylinder, Environment, Stars } from '@react-three/drei';
import * as THREE from 'three';

interface DnaBasePairProps {
  position: [number, number, number];
  rotation: number;
  isMethylated: boolean;
}

const DnaBasePair = memo<DnaBasePairProps>(({ position, rotation, isMethylated }) => {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <Sphere args={[0.3, 12, 12]} position={[-1.5, 0, 0]}>
        <meshStandardMaterial color="#007D69" roughness={0.2} metalness={0.5} />
      </Sphere>
      
      <Sphere args={[0.3, 12, 12]} position={[1.5, 0, 0]}>
        <meshStandardMaterial color="#007D69" roughness={0.2} metalness={0.5} />
      </Sphere>

      <Cylinder args={[0.08, 0.08, 3, 6]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#E5E7EB" transparent opacity={0.8} />
      </Cylinder>

      {isMethylated && (
        <group position={[0.5, 0.4, 0]}>
          <Sphere args={[0.2, 12, 12]}>
            <meshStandardMaterial color="#E11D48" emissive="#E11D48" emissiveIntensity={0.8} />
          </Sphere>
          <Cylinder args={[0.02, 0.02, 0.4, 6]} position={[0, -0.2, 0]}>
            <meshStandardMaterial color="#999" />
          </Cylinder>
        </group>
      )}
    </group>
  );
});

DnaBasePair.displayName = 'DnaBasePair';

const DnaHelix = memo(() => {
  const count = 30;
  const pairs = useMemo(() => {
    const methylatedIndices = [2, 4, 5, 8, 9, 13, 17, 20, 23, 24, 27];
    return Array.from({ length: count }).map((_, i) => ({
      y: (i - count / 2) * 0.6,
      rotation: i * 0.5,
      isMethylated: methylatedIndices.includes(i)
    }));
  }, []);

  const ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.15;
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
      <mesh>
        <cylinderGeometry args={[1.5, 1.5, count * 0.6, 24, 1, true]} />
        <meshStandardMaterial color="#007D69" side={THREE.BackSide} wireframe transparent opacity={0.05} />
      </mesh>
    </group>
  );
});

DnaHelix.displayName = 'DnaHelix';

const SceneContent = memo(() => (
  <>
    <ambientLight intensity={0.5} />
    <pointLight position={[10, 10, 10]} intensity={1} />
    <spotLight position={[-10, 0, 10]} angle={0.5} intensity={1} color="#007D69" />
    
    <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.3}>
      <group rotation={[0, 0, Math.PI / 6]}>
        <DnaHelix />
      </group>
    </Float>

    <Environment preset="city" />
    <Stars radius={100} depth={50} count={1500} factor={4} saturation={0} fade speed={0.5} />
  </>
));

SceneContent.displayName = 'SceneContent';

const Fallback = () => (
  <div className="absolute inset-0 bg-gradient-to-b from-[#F5F9F8] to-[#E8F0EE]" />
);

export const BioHeroScene: React.FC = memo(() => {
  return (
    <div 
      className="absolute inset-0 z-0 opacity-80 pointer-events-none overflow-hidden"
      style={{ clipPath: 'inset(0px)' }}
    >
      <Suspense fallback={<Fallback />}>
        <Canvas 
          camera={{ position: [0, 0, 12], fov: 45 }}
          dpr={[1, 1.5]}
          performance={{ min: 0.5 }}
        >
          <SceneContent />
        </Canvas>
      </Suspense>
    </div>
  );
});

BioHeroScene.displayName = 'BioHeroScene';
