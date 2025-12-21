import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function GeometricPattern() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  const geometry = useMemo(() => {
    return new THREE.IcosahedronGeometry(2, 1);
  }, []);

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} geometry={geometry}>
        <MeshDistortMaterial
          color="#10b981"
          attach="material"
          distort={0.3}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
}

function Crescent() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={groupRef} position={[3, 1, -2]}>
        <mesh>
          <torusGeometry args={[0.8, 0.15, 16, 100, Math.PI * 1.5]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0.5, 0.5, 0]}>
          <sphereGeometry args={[0.15, 32, 32]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.1} emissive="#f59e0b" emissiveIntensity={0.5} />
        </mesh>
      </group>
    </Float>
  );
}

function FloatingParticles() {
  const count = 50;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 15,
        ],
        scale: Math.random() * 0.1 + 0.05,
        speed: Math.random() * 0.5 + 0.5,
      });
    }
    return temp;
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      const matrix = new THREE.Matrix4();
      particles.forEach((particle, i) => {
        const y = particle.position[1] + Math.sin(state.clock.elapsedTime * particle.speed + i) * 0.5;
        matrix.setPosition(particle.position[0], y, particle.position[2]);
        matrix.scale(new THREE.Vector3(particle.scale, particle.scale, particle.scale));
        meshRef.current!.setMatrixAt(i, matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#10b981" transparent opacity={0.6} />
    </instancedMesh>
  );
}

function OctagonalFrame() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.05;
    }
  });

  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(angle) * 4, Math.sin(angle) * 4, 0));
    }
    pts.push(pts[0].clone());
    return pts;
  }, []);

  return (
    <group ref={groupRef} position={[0, 0, -5]}>
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={points.length}
            array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#10b981" linewidth={2} transparent opacity={0.5} />
      </line>
    </group>
  );
}

export default function IslamicScene() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#10b981" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#f59e0b" />
        <spotLight position={[0, 10, 0]} intensity={0.5} color="#ffffff" />
        
        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
        
        <GeometricPattern />
        <Crescent />
        <FloatingParticles />
        <OctagonalFrame />
        
        <fog attach="fog" args={["#0a0a0a", 5, 30]} />
      </Canvas>
    </div>
  );
}
