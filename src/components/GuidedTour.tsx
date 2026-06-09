import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useUI } from '../store'
import { nodeById, tourStops } from '../data/content'

interface Props {
  flyTo: (x: number, y: number, scale?: number) => void
}

export function GuidedTour({ flyTo }: Props) {
  const active = useUI((s) => s.tourActive)
  const step = useUI((s) => s.tourStep)
  const setStep = useUI((s) => s.setTourStep)
  const stop = useUI((s) => s.stopTour)

  const current = tourStops[step]

  useEffect(() => {
    if (!active || !current) return
    const node = nodeById(current.nodeId)
    if (node) flyTo(node.x, node.y, node.flyToScale)
    const t = setTimeout(() => {
      if (step + 1 >= tourStops.length) stop()
      else setStep(step + 1)
    }, 6000)
    return () => clearTimeout(t)
  }, [active, step, current, flyTo, setStep, stop])

  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') stop()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, stop])

  return (
    <AnimatePresence>
      {active && current && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.35 }}
          className="glass-panel-active fixed bottom-8 left-1/2 z-[120] w-[min(92vw,560px)] -translate-x-1/2 rounded-xl p-5"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[0.66rem] uppercase tracking-[0.2em] text-aurora-cyan">
              guided tour · {step + 1}/{tourStops.length}
            </span>
            <div className="flex gap-1.5">
              {tourStops.map((_, i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full transition-colors"
                  style={{ background: i === step ? '#6EE7F9' : 'rgba(255,255,255,0.18)' }}
                />
              ))}
            </div>
          </div>

          <p className="mt-3 text-ink" style={{ fontSize: '1rem', lineHeight: 1.5 }}>
            {current.caption}
          </p>

          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              onClick={stop}
              className="rounded-md px-3 py-1.5 font-mono text-[0.72rem] text-ink-muted transition-colors hover:text-ink"
            >
              skip
            </button>
            <button
              onClick={() => (step + 1 >= tourStops.length ? stop() : setStep(step + 1))}
              className="rounded-md bg-aurora-cyan px-4 py-1.5 font-mono text-[0.72rem] font-semibold text-void transition-transform hover:-translate-y-0.5"
            >
              {step + 1 >= tourStops.length ? 'finish' : 'next →'}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
