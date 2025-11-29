import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

// Colony positions on the Mars sphere (latitude, longitude)
const COLONIES = [
  { name: 'Colonia Solaris', id: 'col-001', lat: 0.3, lon: 0.8, color: '#06B6D4' },      // Cyan
  { name: 'Colonia Ares', id: 'col-002', lat: -0.4, lon: 2.5, color: '#FBBF24' },        // Yellow
  { name: 'Colonia Borealis', id: 'col-003', lat: 1.2, lon: 4.2, color: '#10B981' },     // Green
]

function ColonyMarkers({ onColonyClick }) {
  const markersRef = useRef([])
  const [hoveredColony, setHoveredColony] = useState(null)

  // Convert lat/lon to 3D position on sphere (radius 2.2)
  const getPositionOnSphere = (lat, lon, radius = 2.2) => {
    const x = radius * Math.cos(lat) * Math.cos(lon)
    const y = radius * Math.sin(lat)
    const z = radius * Math.cos(lat) * Math.sin(lon)
    return [x, y, z]
  }

  // Animate markers - gentle pulsing
  useFrame(() => {
    markersRef.current.forEach((marker, idx) => {
      if (marker) {
        const scale = 1 + Math.sin(Date.now() * 0.003) * 0.2
        marker.scale.x = scale
        marker.scale.y = scale
        marker.scale.z = scale
        
        // Highlight on hover
        if (hoveredColony === idx) {
          marker.scale.x = scale * 1.5
          marker.scale.y = scale * 1.5
          marker.scale.z = scale * 1.5
        }
      }
    })
  })

  return (
    <>
      {COLONIES.map((colony, idx) => {
        const [x, y, z] = getPositionOnSphere(colony.lat, colony.lon)
        return (
          <group key={idx} position={[x, y, z]}>
            {/* Glowing sphere marker - Clickable */}
            <mesh 
              ref={(el) => (markersRef.current[idx] = el)}
              onClick={() => onColonyClick(colony.id)}
              onPointerEnter={() => setHoveredColony(idx)}
              onPointerLeave={() => setHoveredColony(null)}
            >
              <sphereGeometry args={[0.15, 32, 32]} />
              <meshStandardMaterial
                color={colony.color}
                emissive={colony.color}
                emissiveIntensity={0.8}
                metalness={0.6}
                roughness={0.3}
              />
            </mesh>
            
            {/* Outer glow ring */}
            <mesh>
              <torusGeometry args={[0.22, 0.02, 16, 8]} rotation={[Math.random(), Math.random(), Math.random()]} />
              <meshBasicMaterial color={colony.color} transparent opacity={0.4} />
            </mesh>
          </group>
        )
      })}
    </>
  )
}

function RotatingMars() {
  const meshRef = useRef()
  const rotationSpeedRef = useRef(0.0003)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeedRef.current
    }
  })

  // Create Mars texture with procedural generation
  const createMarsTexture = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 2048
    canvas.height = 1024
    const ctx = canvas.getContext('2d')

    // Base Mars color
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, '#E27B58')
    gradient.addColorStop(0.5, '#C1440E')
    gradient.addColorStop(1, '#8B3A0F')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Add craters and surface details
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'
    for (let i = 0; i < 300; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const radius = Math.random() * 30 + 5
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    }

    // Add dust storms (light areas)
    ctx.fillStyle = 'rgba(255, 200, 100, 0.1)'
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      ctx.beginPath()
      ctx.arc(x, y, Math.random() * 80 + 40, 0, Math.PI * 2)
      ctx.fill()
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.magFilter = THREE.LinearFilter
    texture.minFilter = THREE.LinearMipmapLinearFilter
    return texture
  }

  return (
    <Sphere ref={meshRef} args={[2.2, 128, 128]}>
      <meshStandardMaterial
        map={createMarsTexture()}
        roughness={0.85}
        metalness={0.1}
        envMapIntensity={0.5}
      />
    </Sphere>
  )
}

function Stars() {
  const starsRef = useRef()

  // Create star field
  const createStars = () => {
    const starGeometry = new THREE.BufferGeometry()
    const starCount = 1000
    const positions = new Float32Array(starCount * 3)

    for (let i = 0; i < starCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 100
      positions[i + 1] = (Math.random() - 0.5) * 100
      positions[i + 2] = (Math.random() - 0.5) * 100
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return starGeometry
  }

  return (
    <points ref={starsRef} geometry={createStars()}>
      <pointsMaterial size={0.1} color="#ffffff" sizeAttenuation />
    </points>
  )
}

export function MarsGlobe({ onColonyClick }) {
  const controlsRef = useRef()
  const autoRotateTimeoutRef = useRef(null)

  const handleInteractionStart = () => {
    // Stop auto-rotation when user interacts
    if (controlsRef.current) {
      controlsRef.current.autoRotate = false
    }
    
    // Clear existing timeout
    if (autoRotateTimeoutRef.current) {
      clearTimeout(autoRotateTimeoutRef.current)
    }
  }

  const handleInteractionEnd = () => {
    // Resume auto-rotation after 3 seconds of inactivity
    autoRotateTimeoutRef.current = setTimeout(() => {
      if (controlsRef.current) {
        controlsRef.current.autoRotate = true
      }
    }, 3000)
  }

  useEffect(() => {
    return () => {
      if (autoRotateTimeoutRef.current) {
        clearTimeout(autoRotateTimeoutRef.current)
      }
    }
  }, [])

  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 50 }}
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: true }}
    >
      <color attach="background" args={['#0a0e27']} />
      
      <Stars />
      
      <ambientLight intensity={0.5} />
      <pointLight position={[15, 10, 15]} intensity={1.5} color="#ffd89b" />
      <pointLight position={[-10, -10, 10]} intensity={0.4} color="#0891b2" />
      
      <RotatingMars />
      <ColonyMarkers onColonyClick={onColonyClick} />
      
      <OrbitControls
        ref={controlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        autoRotate={true}
        autoRotateSpeed={2}
        minDistance={3}
        maxDistance={12}
        onStart={handleInteractionStart}
        onEnd={handleInteractionEnd}
      />
    </Canvas>
  )
}
