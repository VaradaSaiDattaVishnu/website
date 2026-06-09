import { memo } from 'react'
import { nodes, WORLD_BOUNDS } from '../data/content'
import type { ViewportState } from '../hooks/useSpatialViewport'

const { xMin, xMax, yMin, yMax } = WORLD_BOUNDS
const WW = xMax - xMin
const WH = yMax - yMin
const MAP_W = 188
const MAP_H = Math.round((MAP_W * WH) / WW)

const toMini = (wx: number, wy: number): [number, number] => [((wx - xMin) / WW) * MAP_W, ((wy - yMin) / WH) * MAP_H]

interface Props {
  viewport: ViewportState
  size: { w: number; h: number }
  flyTo: (x: number, y: number, scale?: number) => void
}

export const Minimap = memo(function Minimap({ viewport, size, flyTo }: Props) {
  const { x, y, scale } = viewport
  const wx0 = (0 - x) / scale
  const wy0 = (0 - y) / scale
  const wx1 = (size.w - x) / scale
  const wy1 = (size.h - y) / scale
  const [vx0, vy0] = toMini(wx0, wy0)
  const [vx1, vy1] = toMini(wx1, wy1)

  return (
    <div
      role="navigation"
      aria-label="Minimap — click to navigate"
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        const wx = ((e.clientX - r.left) / MAP_W) * WW + xMin
        const wy = ((e.clientY - r.top) / MAP_H) * WH + yMin
        flyTo(wx, wy, Math.max(scale, 0.55))
      }}
      className="glass-panel fixed bottom-5 right-5 z-50 hidden cursor-crosshair overflow-hidden rounded-md md:block"
      style={{ width: MAP_W, height: MAP_H }}
    >
      {nodes.map((n) => {
        const [mx, my] = toMini(n.x, n.y)
        const r = n.kind === 'hero' ? 3.5 : 2.5
        return (
          <span
            key={n.id}
            className="absolute rounded-full"
            style={{ left: mx - r, top: my - r, width: r * 2, height: r * 2, background: n.color, boxShadow: `0 0 5px ${n.color}` }}
          />
        )
      })}
      <div
        className="absolute rounded-[2px] border"
        style={{
          left: Math.max(0, vx0),
          top: Math.max(0, vy0),
          width: Math.min(MAP_W, vx1 - vx0),
          height: Math.min(MAP_H, vy1 - vy0),
          borderColor: 'rgba(237,239,247,0.55)',
          background: 'rgba(237,239,247,0.05)',
        }}
      />
    </div>
  )
})
