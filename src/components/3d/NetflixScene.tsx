import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function GeometricShape() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.15;
    }
  });

  const geometry = useMemo(() => {
    return new THREE.IcosahedronGeometry(2.5, 1);
  }, []);

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} geometry={geometry}>
        <MeshDistortMaterial
          color="#e50914"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
}

function RedRings() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.1;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {[0, 1, 2].map((i) => (
        <Float key={i} speed={1.5 + i * 0.3} rotationIntensity={0.2} floatIntensity={0.3}>
          <mesh rotation={[Math.PI / 2, 0, i * 0.5]}>
            <torusGeometry args={[3 + i * 0.8, 0.03, 16, 100]} />
            <meshStandardMaterial 
              color="#e50914" 
              metalness={0.9} 
              roughness={0.1} 
              emissive="#e50914" 
              emissiveIntensity={0.3} 
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function FloatingParticles() {
  const count = 80;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
        ],
        scale: Math.random() * 0.08 + 0.03,
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
      <meshStandardMaterial color="#e50914" transparent opacity={0.7} emissive="#e50914" emissiveIntensity={0.2} />
    </instancedMesh>
  );
}

function GridFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
      <planeGeometry args={[50, 50, 50, 50]} />
      <meshBasicMaterial 
        color="#e50914" 
        wireframe 
        transparent 
        opacity={0.1}
      />
    </mesh>
  );
}

function GlowingOrb() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.5;
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.5}>
      <mesh ref={meshRef} position={[4, 2, -3]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#e50914" 
          emissiveIntensity={2}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
    </Float>
  );
}

export default function NetflixScene() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#e50914" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#e50914" />
        <spotLight position={[0, 15, 0]} intensity={0.5} color="#ffffff" angle={0.3} />
        
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        
        <GeometricShape />
        <RedRings />
        <FloatingParticles />
        <GridFloor />
        <GlowingOrb />
        
        <fog attach="fog" args={["#0a0a0a", 8, 35]} />
      </Canvas>
    </div>
  );
}