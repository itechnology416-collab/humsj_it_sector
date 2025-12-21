import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars, MeshDistortMaterial, Sphere, Box, Torus } from "@react-three/drei";
import * as THREE from "three";

function FloatingCube() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.5;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={meshRef} position={[-4, 2, -2]}>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <MeshDistortMaterial
          color="#e50914"
          attach="material"
          distort={0.3}
          speed={1.5}
          roughness={0.1}
          metalness={0.9}
          emissive="#e50914"
          emissiveIntensity={0.2}
        />
      </mesh>
    </Float>
  );
}

function PulsingSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      meshRef.current.scale.setScalar(scale);
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={1}>
      <mesh ref={meshRef} position={[4, -1, -3]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#e50914" 
          emissiveIntensity={1.5}
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.9}
        />
      </mesh>
    </Float>
  );
}

function OrbitingRings() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.2;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -5]}>
      {[0, 1, 2, 3].map((i) => (
        <Float key={i} speed={1 + i * 0.2} rotationIntensity={0.1} floatIntensity={0.2}>
          <mesh rotation={[Math.PI / 2, 0, i * 0.3]} position={[0, 0, i * 0.5]}>
            <torusGeometry args={[2 + i * 0.5, 0.02, 16, 100]} />
            <meshStandardMaterial 
              color={i % 2 === 0 ? "#e50914" : "#ffffff"} 
              metalness={0.9} 
              roughness={0.1} 
              emissive={i % 2 === 0 ? "#e50914" : "#ffffff"} 
              emissiveIntensity={0.3}
              transparent
              opacity={0.7 - i * 0.1}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function AnimatedParticles() {
  const count = 100;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 25,
          (Math.random() - 0.5) * 25,
          (Math.random() - 0.5) * 25,
        ],
        scale: Math.random() * 0.05 + 0.02,
        speed: Math.random() * 0.8 + 0.3,
        phase: Math.random() * Math.PI * 2,
      });
    }
    return temp;
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      const matrix = new THREE.Matrix4();
      particles.forEach((particle, i) => {
        const time = state.clock.elapsedTime;
        const x = particle.position[0] + Math.sin(time * particle.speed + particle.phase) * 0.3;
        const y = particle.position[1] + Math.cos(time * particle.speed * 0.7 + particle.phase) * 0.5;
        const z = particle.position[2] + Math.sin(time * particle.speed * 0.5 + particle.phase) * 0.2;
        
        matrix.setPosition(x, y, z);
        matrix.scale(new THREE.Vector3(particle.scale, particle.scale, particle.scale));
        meshRef.current!.setMatrixAt(i, matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial 
        color="#e50914" 
        transparent 
        opacity={0.6} 
        emissive="#e50914" 
        emissiveIntensity={0.3}
      />
    </instancedMesh>
  );
}

function WaveGrid() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const positions = meshRef.current.geometry.attributes.position;
      const time = state.clock.elapsedTime;
      
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const z = positions.getZ(i);
        const wave = Math.sin(x * 0.3 + time) * Math.cos(z * 0.3 + time) * 0.5;
        positions.setY(i, wave);
      }
      positions.needsUpdate = true;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -6, 0]}>
      <planeGeometry args={[30, 30, 50, 50]} />
      <meshStandardMaterial 
        color="#e50914" 
        wireframe 
        transparent 
        opacity={0.15}
        emissive="#e50914"
        emissiveIntensity={0.1}
      />
    </mesh>
  );
}

function FloatingDiamond() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.4;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.6;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.8;
    }
  });

  return (
    <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh ref={meshRef} position={[-2, 3, -4]}>
        <octahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial 
          color="#ffffff" 
          metalness={1}
          roughness={0}
          emissive="#e50914"
          emissiveIntensity={0.4}
          transparent
          opacity={0.8}
        />
      </mesh>
    </Float>
  );
}

function GlowingTorus() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.4}>
      <mesh ref={meshRef} position={[3, 2, -1]}>
        <torusGeometry args={[1, 0.3, 16, 100]} />
        <MeshDistortMaterial
          color="#e50914"
          attach="material"
          distort={0.2}
          speed={1}
          roughness={0.1}
          metalness={0.8}
          emissive="#e50914"
          emissiveIntensity={0.5}
          transparent
          opacity={0.9}
        />
      </mesh>
    </Float>
  );
}

export default function AuthScene() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 12], fov: 50 }}>
        {/* Enhanced Lighting */}
        <ambientLight intensity={0.3} color="#ffffff" />
        <pointLight position={[10, 10, 10]} intensity={2} color="#e50914" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#ffffff" />
        <spotLight 
          position={[0, 20, 0]} 
          intensity={1.5} 
          color="#e50914" 
          angle={0.4} 
          penumbra={0.5}
          castShadow
        />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={0.5} 
          color="#ffffff"
        />
        
        {/* Enhanced Star Field */}
        <Stars 
          radius={150} 
          depth={80} 
          count={5000} 
          factor={6} 
          saturation={0.2} 
          fade 
          speed={2} 
        />
        
        {/* 3D Elements */}
        <FloatingCube />
        <PulsingSphere />
        <OrbitingRings />
        <AnimatedParticles />
        <WaveGrid />
        <FloatingDiamond />
        <GlowingTorus />
        
        {/* Enhanced Fog */}
        <fog attach="fog" args={["#0a0a0a", 10, 40]} />
      </Canvas>
    </div>
  );
}