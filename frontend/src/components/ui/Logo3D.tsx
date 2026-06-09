import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { 
  Float, 
  MeshDistortMaterial, 
  MeshWobbleMaterial, 
  PerspectiveCamera, 
  Environment,
  Stars,
  Text,
  Torus,
  Sphere,
  Points,
  PointMaterial
} from '@react-three/drei'
import * as THREE from 'three'
import { cn } from '../../lib/utils'

function XShape() {
  const meshRef = useRef<THREE.Group>(null!)
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    meshRef.current.rotation.y = Math.sin(t / 4) * 0.3
    meshRef.current.rotation.x = Math.cos(t / 4) * 0.15
  })

  return (
    <group ref={meshRef}>
      {/* Main X - Arm 1 */}
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.35, 1.3, 0.25]} />
        <meshStandardMaterial 
          color="#4f6ef7" 
          metalness={0.9} 
          roughness={0.1} 
          emissive="#4f6ef7"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Main X - Arm 2 */}
      <mesh rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.35, 1.3, 0.25]} />
        <meshStandardMaterial 
          color="#4f6ef7" 
          metalness={0.9} 
          roughness={0.1} 
          emissive="#4f6ef7"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* The Orbiting Ring */}
      <group rotation={[Math.PI / 3, Math.PI / 6, 0]}>
        <mesh>
          <torusGeometry args={[0.95, 0.015, 16, 100]} />
          <meshStandardMaterial 
            color="#7c94fa" 
            emissive="#7c94fa" 
            emissiveIntensity={4} 
            transparent
            opacity={0.8}
          />
        </mesh>
      </group>

      {/* The Star - Central Highlight */}
      <mesh position={[0.2, 0.2, 0.18]} rotation={[0, 0, Math.PI / 4]}>
        <octahedronGeometry args={[0.12]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#ffffff" 
          emissiveIntensity={3} 
        />
      </mesh>

      {/* Subtle Glow behind */}
      <mesh position={[0, 0, -0.2]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial 
          color="#4f6ef7" 
          transparent 
          opacity={0.1} 
        />
      </mesh>
    </group>
  )
}

function Particles() {
  const ref = useRef<THREE.Points>(null!)
  const count = 1500
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12
    }
    return pos
  }, [])

  useFrame((state) => {
    ref.current.rotation.y += 0.001
    ref.current.rotation.x += 0.0005
  })

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.4}
      />
    </Points>
  )
}

export function Logo3DSmall({ className }: { className?: string }) {
  return (
    <div className={cn("w-10 h-10", className)}>
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 3], fov: 40 }}>
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} intensity={2} />
        <Float speed={3} rotationIntensity={1} floatIntensity={0.5}>
          <XShape />
        </Float>
      </Canvas>
    </div>
  )
}

export default function Logo3D() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 3]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Particles />
        
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
          <XShape />
        </Float>
        
        <Environment preset="city" />
      </Canvas>
    </div>
  )
}
