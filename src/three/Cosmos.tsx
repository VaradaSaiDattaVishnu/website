import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import { auroraVertex, auroraFragment } from '../shaders/shaders'

type MouseRef = React.MutableRefObject<THREE.Vector2>

// ── Aurora fullscreen triangle ────────────────────────────────────────────────
function Aurora({ mouse }: { mouse: MouseRef }) {
  const matRef = useRef<THREE.ShaderMaterial>(null!)
  const { size } = useThree()
  const smooth = useRef(new THREE.Vector2(0.5, 0.5))

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3))
    g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array([0, 0, 2, 0, 0, 2]), 2))
    return g
  }, [])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(1, 1) },
    }),
    [],
  )

  useFrame(({ clock }) => {
    if (!matRef.current) return
    smooth.current.lerp(mouse.current, 0.045)
    uniforms.uTime.value = clock.elapsedTime
    uniforms.uMouse.value.copy(smooth.current)
    uniforms.uResolution.value.set(size.width, size.height)
  })

  return (
    <mesh geometry={geometry} frustumCulled={false} renderOrder={-10}>
      <shaderMaterial
        ref={matRef}
        vertexShader={auroraVertex}
        fragmentShader={auroraFragment}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  )
}

// ── Drifting star layers with cursor parallax ─────────────────────────────────
function StarLayers({ mouse }: { mouse: MouseRef }) {
  const group = useRef<THREE.Group>(null!)
  const smooth = useRef(new THREE.Vector2(0.5, 0.5))

  useFrame(({ clock }) => {
    if (!group.current) return
    smooth.current.lerp(mouse.current, 0.03)
    const mx = (smooth.current.x - 0.5) * 2
    const my = (smooth.current.y - 0.5) * 2
    group.current.rotation.y = clock.elapsedTime * 0.012 + mx * 0.12
    group.current.rotation.x = -my * 0.1
  })

  return (
    <group ref={group}>
      <Stars radius={120} depth={60} count={2600} factor={3.2} saturation={0} fade speed={0.4} />
      <Stars radius={70} depth={40} count={700} factor={4.5} saturation={0.4} fade speed={0.8} />
    </group>
  )
}

// ── Pause loop when tab hidden ────────────────────────────────────────────────
function AdaptiveRender() {
  const { gl, invalidate } = useThree()
  useEffect(() => {
    const onVis = () => {
      if (!document.hidden) invalidate()
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [gl, invalidate])
  return null
}

// ── Static fallback (reduced-motion / low-power / mobile) ─────────────────────
export function StaticCosmos() {
  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        background:
          'radial-gradient(ellipse at 28% 22%, rgba(110,231,249,0.10), transparent 55%),' +
          'radial-gradient(ellipse at 75% 70%, rgba(167,139,250,0.12), transparent 55%),' +
          'radial-gradient(ellipse at 60% 90%, rgba(244,114,182,0.08), transparent 50%),' +
          '#06070B',
      }}
    />
  )
}

// ── The live cosmos ───────────────────────────────────────────────────────────
export function Cosmos({ mobile = false }: { mobile?: boolean }) {
  const mouse = useRef(new THREE.Vector2(0.5, 0.5))

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.set(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0 }} aria-hidden>
      <Canvas
        dpr={mobile ? [1, 1] : [1, 1.6]}
        gl={{ antialias: false, powerPreference: 'high-performance', alpha: false }}
        camera={{ position: [0, 0, 5], fov: 75, near: 0.1, far: 300 }}
      >
        <AdaptiveRender />
        <Aurora mouse={mouse} />
        <StarLayers mouse={mouse} />
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={0.5}
            luminanceThreshold={0.36}
            luminanceSmoothing={0.9}
            radius={0.8}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
