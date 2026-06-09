import { useEffect } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useAccessibility } from './hooks/useAccessibility'
import { useUI } from './store'

import { Cosmos, StaticCosmos } from './three/Cosmos'
import { CustomCursor } from './components/CustomCursor'
import { SpatialHome } from './components/SpatialHome'
import { MobileHome } from './components/MobileHome'
import { ProjectPage } from './pages/ProjectPage'
import { CommandPalette } from './components/CommandPalette'
import { Terminal } from './components/Terminal'
import { BootSequence } from './components/BootSequence'

function GlobalKeys() {
  const togglePalette = useUI((s) => s.togglePalette)
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
  return null
}

function Shell() {
  const { useFallback, lowPower, isMobile, prefersReducedMotion } = useAccessibility()
  const forceSpatial = typeof location !== 'undefined' && location.search.includes('spatial')
  const fallback = useFallback && !forceSpatial
  const showCursor = !isMobile && !prefersReducedMotion

  return (
    <>
      {lowPower || fallback ? <StaticCosmos /> : <Cosmos mobile={isMobile} />}
      {showCursor && <CustomCursor />}
      <GlobalKeys />

      <Routes>
        <Route path="/" element={fallback ? <MobileHome /> : <SpatialHome />} />
        <Route path="/p/:id" element={<ProjectPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <CommandPalette />
      <Terminal />
      <BootSequence />
      <div className="grain" aria-hidden />
    </>
  )
}

export default function App() {
  return (
    <HashRouter>
      <Shell />
    </HashRouter>
  )
}
