'use client'

import { useRef, useMemo, useEffect, useCallback, Suspense, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// --- Configuration & Constants ---
const PARTICLE_COUNT = 120
const SHAPE_COUNT = 4
const PARTICLES_PER_SHAPE = Math.ceil(PARTICLE_COUNT / SHAPE_COUNT)
const COLORS = ['#EA4335', '#34A853', '#000080', '#4FC3F7', '#FBBC05'] // Red, Green, Navy, Sky Blue, Yellow
const MOUSE_INFLUENCE_RADIUS = 4 // ~150px in Three.js world units (approx, depends on camera z)
const DAMPENING_FACTOR = 0.95 // Kinetic friction when near mouse
const RETURN_SPEED = 0.02 // Lerp factor for returning to orbit

// --- Types ---
type ParticleData = {
    angles: Float32Array
    radii: Float32Array
    speeds: Float32Array
    liftoffFreqs: Float32Array
    liftoffAmps: Float32Array
    scales: Float32Array
    // Interaction state
    velocities: Float32Array // x, y (2 values per particle)
    offsets: Float32Array // x, y (2 values per particle) - deviation from orbit
    // Visuals
    colorBuffers: Float32Array[] // Array of 4 separate buffers
}

function MouseTracker({ onMouseUpdate }: { onMouseUpdate: (pos: THREE.Vector3) => void }) {
    const { camera } = useThree()
    const raycaster = useMemo(() => new THREE.Raycaster(), [])
    const mouseVec = useMemo(() => new THREE.Vector2(), [])
    const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), [])
    const intersectPoint = useMemo(() => new THREE.Vector3(), [])

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            mouseVec.x = (event.clientX / window.innerWidth) * 2 - 1
            mouseVec.y = -(event.clientY / window.innerHeight) * 2 + 1

            raycaster.setFromCamera(mouseVec, camera)
            raycaster.ray.intersectPlane(plane, intersectPoint)
            onMouseUpdate(intersectPoint.clone())
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [camera, raycaster, mouseVec, plane, intersectPoint, onMouseUpdate])

    return null
}

function AntigravityParticles({ mousePos }: { mousePos: THREE.Vector3 }) {
    // 4 Refs for 4 Shapes: Circle, Triangle, Square, Pentagon
    // 0: Circle (High segs), 1: Triangle (3), 2: Square (4), 3: Pentagon (5)
    const meshRefs = [
        useRef<THREE.InstancedMesh>(null),
        useRef<THREE.InstancedMesh>(null),
        useRef<THREE.InstancedMesh>(null),
        useRef<THREE.InstancedMesh>(null)
    ]

    const { viewport } = useThree()
    const dummy = useMemo(() => new THREE.Object3D(), [])
    const colorObj = useMemo(() => new THREE.Color(), [])

    // Swarm Center State
    const swarmCenter = useRef(new THREE.Vector3(0, 0, 0))
    // Visibility State for Vanish Effect
    const swarmVisibility = useRef(1.0)
    const lastMousePos = useRef(new THREE.Vector3(0, 0, 0))

    // Initialize Particle Data
    const data = useMemo<ParticleData>(() => {
        const angles = new Float32Array(PARTICLE_COUNT)
        const radii = new Float32Array(PARTICLE_COUNT)
        const speeds = new Float32Array(PARTICLE_COUNT)
        const liftoffFreqs = new Float32Array(PARTICLE_COUNT)
        const liftoffAmps = new Float32Array(PARTICLE_COUNT)
        const scales = new Float32Array(PARTICLE_COUNT)
        const velocities = new Float32Array(PARTICLE_COUNT * 2) // vx, vy
        const offsets = new Float32Array(PARTICLE_COUNT * 2) // dx, dy

        // Prepare separate color buffers for each shape mesh
        const colorBuffers = [
            new Float32Array(PARTICLES_PER_SHAPE * 3),
            new Float32Array(PARTICLES_PER_SHAPE * 3),
            new Float32Array(PARTICLES_PER_SHAPE * 3),
            new Float32Array(PARTICLES_PER_SHAPE * 3)
        ]

        // Swarm Config
        // "Make swarm less tighter" -> Increase radius significantly
        // "Reduce inner circle" -> Adjust power to allow particles closer to center (less of a hole) 
        // while the larger base radius spreads the "outer" loose.
        const swarmRadiusBase = 8.5

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            // Physics Init
            angles[i] = Math.random() * Math.PI * 2

            // Random distribution: 
            // Math.pow(rRand, 0.6) pushes less strongly to edge than 0.4, 
            // allowing more particles in the "inner circle" (filling the hole) 
            // while the larger base radius spreads the "outer" loose.
            const rRand = Math.random()
            radii[i] = Math.pow(rRand, 0.55) * swarmRadiusBase * (0.8 + Math.random() * 0.5)

            // Slower orbit for underwater drift
            speeds[i] = 0.02 + Math.random() * 0.08

            // Wavy / Liftoff params re-purposed for organic wave
            // liftoffFreqs -> Wave Frequency (how many ripples)
            // liftoffAmps -> Wave Amplitude (how deep)
            liftoffFreqs[i] = 1.0 + Math.random() * 3.0 // Slower wave
            liftoffAmps[i] = 0.5 + Math.random() * 1.5 // Significant wave depth

            // "Increase the size a bit" -> 1.5 to 3.0
            scales[i] = 1.5 + Math.random() * 1.5

            velocities[i * 2] = 0
            velocities[i * 2 + 1] = 0
            offsets[i * 2] = 0
            offsets[i * 2 + 1] = 0

            // Color Init (Per Particle)
            const colorHex = COLORS[Math.floor(Math.random() * COLORS.length)]
            colorObj.set(colorHex)

            // Assign to correct buffer
            const shapeIndex = i % SHAPE_COUNT
            const instanceIndex = Math.floor(i / SHAPE_COUNT)

            colorBuffers[shapeIndex][instanceIndex * 3] = colorObj.r
            colorBuffers[shapeIndex][instanceIndex * 3 + 1] = colorObj.g
            colorBuffers[shapeIndex][instanceIndex * 3 + 2] = colorObj.b
        }

        return { angles, radii, speeds, liftoffFreqs, liftoffAmps, scales, velocities, offsets, colorBuffers }
    }, [colorObj])

    useFrame((state, delta) => {
        if (!meshRefs[0].current) return

        const time = state.clock.getElapsedTime()
        const mouseX = mousePos.x
        const mouseY = mousePos.y
        const isMouseActive = mouseX < 9000
        const dt = Math.min(delta, 0.1)

        // --- Vanish-On-Move Logic ---

        // 1. Calculate Mouse Speed
        const distMoved = Math.sqrt(
            Math.pow(mouseX - lastMousePos.current.x, 2) +
            Math.pow(mouseY - lastMousePos.current.y, 2)
        )
        // Update last pos
        lastMousePos.current.set(mouseX, mouseY, 0)

        // Threshold for "moving" (in world units per frame)
        // If distMoved > 0.01, we consider it moving
        const isMoving = isMouseActive && distMoved > 0.05

        // 2. Update Visibility Target
        // "Not totally vanish, opacity will be ups and down"
        let targetVisibility = 1.0

        if (isMoving) {
            // Pulse/Flicker between 0.2 and 0.5
            targetVisibility = 0.35 + Math.sin(time * 15.0) * 0.15
        } else {
            targetVisibility = 1.0
        }

        // Lerp visibility (Fast transition)
        const fadeSpeed = isMoving ? 8.0 : 4.0
        swarmVisibility.current += (targetVisibility - swarmVisibility.current) * fadeSpeed * dt

        // Clamp (Keep it safe)
        swarmVisibility.current = Math.max(0.1, Math.min(1, swarmVisibility.current))

        // 3. Update Swarm Position (Dynamic Fluidity)
        // "Entire group follows it aggressively" -> REMOVE fast follow.
        // "Water does not work like that" -> Water drifts/drags.
        // We use a constant, slow lerp. The swarm will "trail" behind the mouse.

        const centerLerpSpeed = 1.0 // Constant slow drag
        const swarmLerp = 1 - Math.exp(-centerLerpSpeed * dt)

        const targetCenterX = isMouseActive ? mouseX : 0
        const targetCenterY = isMouseActive ? mouseY : 0

        swarmCenter.current.x += (targetCenterX - swarmCenter.current.x) * swarmLerp
        swarmCenter.current.y += (targetCenterY - swarmCenter.current.y) * swarmLerp

        const cx = swarmCenter.current.x
        const cy = swarmCenter.current.y
        const visibility = swarmVisibility.current

        // Physics Loop (Unified)
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            // 1. Orbital Physics
            data.angles[i] -= data.speeds[i] * dt * 0.5

            // Organic Wave Logic
            // R = R_base + sin(Angle * Freq + Time) * Amp
            // This creates rotating waves around the circle
            const wave = Math.sin(data.angles[i] * 3.0 + time * 0.5 + data.liftoffFreqs[i]) * data.liftoffAmps[i]

            // "Breathing" randomness
            const breathe = Math.sin(time * 0.3 + i) * 0.2

            const rDynamic = data.radii[i] + wave + breathe

            const orbitX = cx + Math.cos(data.angles[i]) * rDynamic
            const orbitY = cy + Math.sin(data.angles[i]) * rDynamic

            // 2. Mouse Interaction (Velocity-Based Fluid Physics)
            // We calculate forces to update velocity, giving it "mass" and "drift"

            let vx = data.velocities[i * 2]
            let vy = data.velocities[i * 2 + 1]
            let offsetX = data.offsets[i * 2]
            let offsetY = data.offsets[i * 2 + 1]

            // Current position of the particle including the offset
            const pX = orbitX + offsetX
            const pY = orbitY + offsetY

            const dx = pX - mouseX
            const dy = pY - mouseY
            const distSq = dx * dx + dy * dy
            const dist = Math.sqrt(distSq)

            // Force Accumulator
            let ax = 0
            let ay = 0

            // 1. Repulsion Force (Mouse Influence)
            if (isMouseActive && dist < MOUSE_INFLUENCE_RADIUS) {
                // Normalized distance (1 at center, 0 at edge)
                const normDist = 1 - dist / MOUSE_INFLUENCE_RADIUS

                // Exponential force curve for softer feel at edge, strong at center
                const force = Math.pow(normDist, 2) * 50.0 // Slightly stronger push for water displacement

                // Direction from Mouse TO Particle
                let stressAngle = Math.atan2(dy, dx)

                ax += Math.cos(stressAngle) * force
                ay += Math.sin(stressAngle) * force
            }

            // 2. Spring Force (Return to Orbit)
            // Pulls offset back to (0,0) - i.e., back to the orbital path
            // Reduced rigidity for "water shadow" drift
            const stiffness = 0.5
            ax -= offsetX * stiffness
            ay -= offsetY * stiffness

            // 3. Integrate Velocity
            vx += ax * dt
            vy += ay * dt

            // 4. Apply Damping (Friction/Air Resistance)
            // High viscosity
            const damping = 0.95
            vx *= damping
            vy *= damping

            // 5. Update Position (Offset)
            offsetX += vx * dt * 5.0 // Speed scale
            offsetY += vy * dt * 5.0

            // Store State
            data.velocities[i * 2] = vx
            data.velocities[i * 2 + 1] = vy
            data.offsets[i * 2] = offsetX
            data.offsets[i * 2 + 1] = offsetY

            // 3. Final Position
            const x = orbitX + offsetX
            const y = orbitY + offsetY
            const z = 0

            // 4. Opacity Logic (Edge Fade)
            // ... (keep existing scale logic)

            const distFromScreenCenter = Math.sqrt(x * x + y * y)
            const maxDist = Math.max(viewport.width, viewport.height) * 0.6
            let alphaScale = 1.0 - Math.min(distFromScreenCenter / maxDist, 1.0)
            alphaScale = Math.pow(alphaScale, 0.5)

            dummy.position.set(x, y, z)
            // Scale by visibility (vanish on move) AND alphaScale (edge fade)
            dummy.scale.setScalar(data.scales[i] * alphaScale * visibility)

            // Rotate shapes slightly for variety?
            // Just static rotation or slow spin
            dummy.rotation.z = data.angles[i] // Spin with orbit

            dummy.updateMatrix()

            // Update correct mesh
            const shapeIndex = i % SHAPE_COUNT
            const instanceIndex = Math.floor(i / SHAPE_COUNT)

            const mesh = meshRefs[shapeIndex].current
            if (mesh) {
                mesh.setMatrixAt(instanceIndex, dummy.matrix)
            }
        }

        // Notify updates
        meshRefs.forEach(ref => {
            if (ref.current) ref.current.instanceMatrix.needsUpdate = true
        })
    })

    const commonMaterial = (
        <meshBasicMaterial
            transparent
            opacity={0.8}
            vertexColors // Enabled again for random colors
        />
    )

    return (
        <>
            {/* Shape 0: Circle (High Poly) */}
            <instancedMesh ref={meshRefs[0]} args={[undefined, undefined, PARTICLES_PER_SHAPE]} frustumCulled={false}>
                <circleGeometry args={[0.045, 16]} />
                {commonMaterial}
                <instancedBufferAttribute attach="geometry-attributes-color" args={[data.colorBuffers[0], 3]} />
            </instancedMesh>

            {/* Shape 1: Triangle (3 Segs) */}
            <instancedMesh ref={meshRefs[1]} args={[undefined, undefined, PARTICLES_PER_SHAPE]} frustumCulled={false}>
                <circleGeometry args={[0.05, 3]} />
                {commonMaterial}
                <instancedBufferAttribute attach="geometry-attributes-color" args={[data.colorBuffers[1], 3]} />
            </instancedMesh>

            {/* Shape 2: Square (4 Segs, rotated 45deg internally via rotation prop? No, geometry is canonical. 
                CircleGeometry with 4 segments is a diamond/square. 
            */}
            <instancedMesh ref={meshRefs[2]} args={[undefined, undefined, PARTICLES_PER_SHAPE]} frustumCulled={false}>
                <circleGeometry args={[0.045, 4]} />
                {commonMaterial}
                <instancedBufferAttribute attach="geometry-attributes-color" args={[data.colorBuffers[2], 3]} />
            </instancedMesh>

            {/* Shape 3: Pentagon (5 Segs) */}
            <instancedMesh ref={meshRefs[3]} args={[undefined, undefined, PARTICLES_PER_SHAPE]} frustumCulled={false}>
                <circleGeometry args={[0.045, 5]} />
                {commonMaterial}
                <instancedBufferAttribute attach="geometry-attributes-color" args={[data.colorBuffers[3], 3]} />
            </instancedMesh>
        </>
    )
}

export default function ParticleCanvas() {
    const [mousePos, setMousePos] = useState(new THREE.Vector3(10000, 10000, 0))

    const handleMouseUpdate = useCallback((pos: THREE.Vector3) => {
        setMousePos(pos)
    }, [])

    return (
        <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: '#FFFFFF' }}>
            <Canvas
                camera={{ position: [0, 0, 12], fov: 60 }}
                gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
                dpr={[1, 2]}
            >
                <Suspense fallback={null}>
                    <MouseTracker onMouseUpdate={handleMouseUpdate} />
                    <AntigravityParticles mousePos={mousePos} />
                </Suspense>
            </Canvas>
        </div>
    )
}
