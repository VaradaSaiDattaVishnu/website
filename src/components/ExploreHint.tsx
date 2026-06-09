import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useUI } from '../store'

export function ExploreHint() {
  const booted = useUI((s) => s.booted)
  const hasExplored = useUI((s) => s.hasExplored)
  const markExplored = useUI((s) => s.markExplored)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    if (!booted || hasExplored) return
    const dismiss = () => {
      setGone(true)
      markExplored()
    }
    const t = setTimeout(dismiss, 7000)
    window.addEventListener('pointerdown', dismiss, { once: true })
    window.addEventListener('wheel', dismiss, { once: true, passive: true })
    return () => {
      clearTimeout(t)
      window.removeEventListener('pointerdown', dismiss)
      window.removeEventListener('wheel', dismiss)
    }
  }, [booted, hasExplored, markExplored])

  const show = booted && !hasExplored && !gone

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 14 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="glass-panel pointer-events-none fixed bottom-24 left-1/2 z-40 -translate-x-1/2 rounded-full px-5 py-2.5"
        >
          <p className="font-mono text-[0.72rem] tracking-wide text-ink-secondary">
            <span className="animate-pulse-glow">✦</span>&nbsp; drag to drift through the cosmos · scroll to zoom
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
