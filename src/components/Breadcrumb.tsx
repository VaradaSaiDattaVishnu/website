import { AnimatePresence, motion } from 'framer-motion'
import { nodes } from '../data/content'
import type { ViewportState } from '../hooks/useSpatialViewport'

interface Props {
  viewport: ViewportState
  size: { w: number; h: number }
}

export function Breadcrumb({ viewport, size }: Props) {
  const { x, y, scale } = viewport
  const cx = (size.w / 2 - x) / scale
  const cy = (size.h / 2 - y) / scale

  let nearest = nodes[0]
  let min = Infinity
  for (const n of nodes) {
    const d = Math.hypot(n.x - cx, n.y - cy)
    if (d < min) {
      min = d
      nearest = n
    }
  }
  const visible = min * scale < 540 && nearest.kind !== 'hero'

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          key={nearest.id}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="glass-panel pointer-events-none fixed left-1/2 top-5 z-40 flex -translate-x-1/2 items-center gap-2.5 rounded-full px-4 py-2"
        >
          <span className="h-2 w-2 rounded-full" style={{ background: nearest.color, boxShadow: `0 0 8px ${nearest.color}` }} />
          <span className="font-mono text-[0.72rem] tracking-wide text-ink">{nearest.label}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
