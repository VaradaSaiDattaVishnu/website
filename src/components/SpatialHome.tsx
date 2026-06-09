import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DEFAULT_SCALE, useSpatialViewport, type ViewportState } from '../hooks/useSpatialViewport'
import { useUI } from '../store'
import type { SpatialNode } from '../data/content'

import { WorldLayer } from './WorldLayer'
import { TopBar } from './TopBar'
import { Minimap } from './Minimap'
import { Breadcrumb } from './Breadcrumb'
import { ViewControls } from './ViewControls'
import { ExploreHint } from './ExploreHint'
import { GuidedTour } from './GuidedTour'

export function SpatialHome() {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)
  const worldRef = useRef<HTMLDivElement>(null)
  const enabledRef = useRef(true)

  const [vp, setVp] = useState<ViewportState>({ x: 0, y: 0, scale: DEFAULT_SCALE })
  const [size, setSize] = useState({
    w: typeof window !== 'undefined' ? window.innerWidth : 1280,
    h: typeof window !== 'undefined' ? window.innerHeight : 800,
  })

  const paletteOpen = useUI((s) => s.paletteOpen)
  const terminalOpen = useUI((s) => s.terminalOpen)
  const tourActive = useUI((s) => s.tourActive)

  const { flyTo, zoomAt, reset } = useSpatialViewport({ containerRef, worldRef, onChange: setVp, enabled: enabledRef })

  useEffect(() => {
    enabledRef.current = !(paletteOpen || terminalOpen || tourActive)
  }, [paletteOpen, terminalOpen, tourActive])

  useEffect(() => {
    const measure = () => setSize({ w: window.innerWidth, h: window.innerHeight })
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const onSelect = useCallback(
    (node: SpatialNode) => {
      if (node.kind === 'hero') return
      // a quick fly inward gives a "zoom into the artifact" feel before the page loads
      flyTo(node.x, node.y, Math.max(node.flyToScale * 1.35, 1.25))
      window.setTimeout(() => navigate(`/p/${node.id}`), 330)
    },
    [flyTo, navigate],
  )

  const onFocusNode = useCallback(
    (node: SpatialNode) => {
      if (enabledRef.current) flyTo(node.x, node.y, node.flyToScale)
    },
    [flyTo],
  )

  return (
    <>
      <div
        ref={containerRef}
        role="application"
        aria-label="Spatial OS — interactive portfolio canvas"
        className="fixed inset-0 z-10 cursor-grab touch-none"
      >
        <div
          ref={worldRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 0,
            height: 0,
            transformOrigin: '0 0',
            willChange: 'transform',
            transform: `translate3d(50vw, 50vh, 0) scale(${DEFAULT_SCALE})`,
          }}
        >
          <WorldLayer onSelect={onSelect} onFocusNode={onFocusNode} />
        </div>
      </div>

      <TopBar reset={reset} />
      <Breadcrumb viewport={vp} size={size} />
      <Minimap viewport={vp} size={size} flyTo={flyTo} />
      <ViewControls zoomAt={zoomAt} reset={reset} size={size} />
      <ExploreHint />
      <GuidedTour flyTo={flyTo} />
    </>
  )
}
