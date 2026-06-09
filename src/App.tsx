import { useCallback, useEffect, useRef, useState } from 'react'
import { useAccessibility } from './hooks/useAccessibility'
import { DEFAULT_SCALE, useSpatialViewport, type ViewportState } from './hooks/useSpatialViewport'
import { useUI } from './store'
import { nodeById, type SpatialNode } from './data/content'

import { Cosmos, StaticCosmos } from './three/Cosmos'
import { WorldLayer } from './components/WorldLayer'
import { TopBar } from './components/TopBar'
import { Minimap } from './components/Minimap'
import { Breadcrumb } from './components/Breadcrumb'
import { ViewControls } from './components/ViewControls'
import { ExploreHint } from './components/ExploreHint'
import { GuidedTour } from './components/GuidedTour'
import { CommandPalette } from './components/CommandPalette'
import { Terminal } from './components/Terminal'
import { CaseStudyPanel } from './components/CaseStudyPanel'
import { BootSequence } from './components/BootSequence'
import { LinearLayout } from './components/LinearLayout'

function SpatialApp({ lowPower, isMobile }: { lowPower: boolean; isMobile: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const worldRef = useRef<HTMLDivElement>(null)
  const enabledRef = useRef(true)

  const [vp, setVp] = useState<ViewportState>({ x: 0, y: 0, scale: DEFAULT_SCALE })
  const [size, setSize] = useState({ w: typeof window !== 'undefined' ? window.innerWidth : 1280, h: typeof window !== 'undefined' ? window.innerHeight : 800 })

  const select = useUI((s) => s.select)
  const togglePalette = useUI((s) => s.togglePalette)
  const selectedId = useUI((s) => s.selectedId)
  const paletteOpen = useUI((s) => s.paletteOpen)
  const terminalOpen = useUI((s) => s.terminalOpen)
  const tourActive = useUI((s) => s.tourActive)

  const { flyTo, zoomAt, reset } = useSpatialViewport({ containerRef, worldRef, onChange: setVp, enabled: enabledRef })

  // disable world panning when any overlay owns the screen
  useEffect(() => {
    enabledRef.current = !(selectedId || paletteOpen || terminalOpen || tourActive)
  }, [selectedId, paletteOpen, terminalOpen, tourActive])

  // viewport size tracking
  useEffect(() => {
    const measure = () => setSize({ w: window.innerWidth, h: window.innerHeight })
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  // deep-link: open the node named in the URL hash (e.g. /#jarvis) after boot
  useEffect(() => {
    const id = window.location.hash.replace('#', '')
    const n = id ? nodeById(id) : undefined
    if (!n || n.kind === 'hero') return
    const t = setTimeout(() => {
      flyTo(n.x, n.y, n.flyToScale)
      select(n.id)
    }, 2900)
    return () => clearTimeout(t)
  }, [flyTo, select])

  // keep the URL hash in sync with the open panel (shareable links)
  useEffect(() => {
    if (selectedId) history.replaceState(null, '', `#${selectedId}`)
    else history.replaceState(null, '', window.location.pathname + window.location.search)
  }, [selectedId])

  // global ⌘K / Ctrl+K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        togglePalette()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [togglePalette])

  const onSelect = useCallback(
    (node: SpatialNode) => {
      flyTo(node.x, node.y, node.flyToScale)
      if (node.kind !== 'hero') setTimeout(() => select(node.id), 360)
    },
    [flyTo, select],
  )

  const onFocusNode = useCallback(
    (node: SpatialNode) => {
      if (enabledRef.current) flyTo(node.x, node.y, node.flyToScale)
    },
    [flyTo],
  )

  return (
    <>
      {lowPower ? <StaticCosmos /> : <Cosmos mobile={isMobile} />}

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
      <CommandPalette flyTo={flyTo} reset={reset} />
      <Terminal />
      <CaseStudyPanel />

      <div className="grain" aria-hidden />
      <BootSequence />
    </>
  )
}

export default function App() {
  const { useFallback, lowPower, isMobile } = useAccessibility()
  const forceSpatial = typeof location !== 'undefined' && location.search.includes('spatial')

  if (useFallback && !forceSpatial) {
    return (
      <>
        <StaticCosmos />
        <LinearLayout />
        <Terminal />
        <div className="grain" aria-hidden />
      </>
    )
  }

  return <SpatialApp lowPower={lowPower} isMobile={forceSpatial ? false : isMobile} />
}
