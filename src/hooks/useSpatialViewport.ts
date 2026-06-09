import { useCallback, useEffect, useRef } from 'react'

export interface ViewportState {
  x: number
  y: number
  scale: number
}

export interface SpatialViewport {
  flyTo: (worldX: number, worldY: number, targetScale?: number) => void
  zoomAt: (pivotX: number, pivotY: number, delta: number) => void
  panBy: (dx: number, dy: number) => void
  reset: () => void
  getState: () => ViewportState
}

const MIN_SCALE = 0.08
const MAX_SCALE = 2.6
export const DEFAULT_SCALE = 0.55
const FLY_MS = 720
const FRICTION = 0.92
const VELOCITY_THRESHOLD = 0.12
const ZOOM_SENSITIVITY = 0.0014

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))
const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t))

interface Options {
  containerRef: React.RefObject<HTMLElement>
  worldRef: React.RefObject<HTMLElement>
  onChange?: (v: ViewportState) => void
  /** disables pointer/wheel interaction (e.g. while a panel is open) */
  enabled?: React.MutableRefObject<boolean>
}

export function useSpatialViewport({ containerRef, worldRef, onChange, enabled }: Options): SpatialViewport {
  const tx = useRef(0)
  const ty = useRef(0)
  const scale = useRef(DEFAULT_SCALE)

  const vel = useRef({ vx: 0, vy: 0 })
  const inertiaRaf = useRef(0)
  const flyRaf = useRef(0)

  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  const apply = useCallback(() => {
    const el = worldRef.current
    if (el) {
      el.style.transform = `translate3d(${tx.current}px, ${ty.current}px, 0) scale(${scale.current})`
    }
    onChangeRef.current?.({ x: tx.current, y: ty.current, scale: scale.current })
  }, [worldRef])

  const getState = useCallback((): ViewportState => ({ x: tx.current, y: ty.current, scale: scale.current }), [])

  const panBy = useCallback(
    (dx: number, dy: number) => {
      cancelAnimationFrame(inertiaRaf.current)
      tx.current += dx
      ty.current += dy
      apply()
    },
    [apply],
  )

  const zoomAt = useCallback(
    (pivotX: number, pivotY: number, delta: number) => {
      cancelAnimationFrame(inertiaRaf.current)
      cancelAnimationFrame(flyRaf.current)
      const old = scale.current
      const next = clamp(old * (1 - delta * ZOOM_SENSITIVITY), MIN_SCALE, MAX_SCALE)
      const ratio = next / old
      tx.current = pivotX - (pivotX - tx.current) * ratio
      ty.current = pivotY - (pivotY - ty.current) * ratio
      scale.current = next
      apply()
    },
    [apply],
  )

  const flyTo = useCallback(
    (worldX: number, worldY: number, targetScale = 1.1) => {
      cancelAnimationFrame(inertiaRaf.current)
      cancelAnimationFrame(flyRaf.current)
      vel.current = { vx: 0, vy: 0 }
      const el = containerRef.current
      if (!el) return
      const W = el.clientWidth
      const H = el.clientHeight

      const startTx = tx.current
      const startTy = ty.current
      const startScale = scale.current
      const endScale = clamp(targetScale, MIN_SCALE, MAX_SCALE)
      const endTx = W / 2 - worldX * endScale
      const endTy = H / 2 - worldY * endScale

      const start = performance.now()
      const tick = (now: number) => {
        const t = clamp((now - start) / FLY_MS, 0, 1)
        const e = easeOutExpo(t)
        tx.current = startTx + (endTx - startTx) * e
        ty.current = startTy + (endTy - startTy) * e
        scale.current = startScale + (endScale - startScale) * e
        apply()
        if (t < 1) flyRaf.current = requestAnimationFrame(tick)
      }
      flyRaf.current = requestAnimationFrame(tick)
    },
    [apply, containerRef],
  )

  const reset = useCallback(() => flyTo(0, 0, DEFAULT_SCALE), [flyTo])

  const startInertia = useCallback(() => {
    cancelAnimationFrame(inertiaRaf.current)
    const tick = () => {
      const v = vel.current
      v.vx *= FRICTION
      v.vy *= FRICTION
      tx.current += v.vx
      ty.current += v.vy
      apply()
      if (Math.abs(v.vx) > VELOCITY_THRESHOLD || Math.abs(v.vy) > VELOCITY_THRESHOLD) {
        inertiaRaf.current = requestAnimationFrame(tick)
      }
    }
    inertiaRaf.current = requestAnimationFrame(tick)
  }, [apply])

  // initial centering — hero (0,0) at screen center
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    tx.current = el.clientWidth / 2
    ty.current = el.clientHeight / 2
    scale.current = DEFAULT_SCALE
    apply()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // pointer / wheel / touch handlers
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let dragging = false
    let lastX = 0
    let lastY = 0
    const SAMPLES = 5
    const dxs: number[] = []
    const dys: number[] = []
    const isEnabled = () => (enabled ? enabled.current : true)

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0 || !isEnabled()) return
      // don't hijack drags that start on interactive elements
      const target = e.target as HTMLElement
      if (target.closest('[data-no-pan]')) return
      dragging = true
      lastX = e.clientX
      lastY = e.clientY
      dxs.length = 0
      dys.length = 0
      cancelAnimationFrame(inertiaRaf.current)
      cancelAnimationFrame(flyRaf.current)
      vel.current = { vx: 0, vy: 0 }
      try {
        el.setPointerCapture(e.pointerId)
      } catch {
        /* noop */
      }
      el.style.cursor = 'grabbing'
    }

    const onMove = (e: PointerEvent) => {
      if (!dragging) return
      const dx = e.clientX - lastX
      const dy = e.clientY - lastY
      lastX = e.clientX
      lastY = e.clientY
      dxs.push(dx)
      dys.push(dy)
      if (dxs.length > SAMPLES) dxs.shift()
      if (dys.length > SAMPLES) dys.shift()
      tx.current += dx
      ty.current += dy
      apply()
    }

    const onUp = () => {
      if (!dragging) return
      dragging = false
      el.style.cursor = 'grab'
      const avg = (a: number[]) => (a.length ? a.reduce((s, n) => s + n, 0) / a.length : 0)
      vel.current = { vx: avg(dxs), vy: avg(dys) }
      startInertia()
    }

    const onWheel = (e: WheelEvent) => {
      if (!isEnabled()) return
      e.preventDefault()
      const delta = e.deltaMode === 1 ? e.deltaY * 18 : e.deltaY
      zoomAt(e.clientX, e.clientY, delta)
    }

    // pinch
    let pinchDist = 0
    let pinchX = 0
    let pinchY = 0
    const dist = (t: TouchList) => Math.hypot(t[1].clientX - t[0].clientX, t[1].clientY - t[0].clientY)

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2 && isEnabled()) {
        pinchDist = dist(e.touches)
        pinchX = (e.touches[0].clientX + e.touches[1].clientX) / 2
        pinchY = (e.touches[0].clientY + e.touches[1].clientY) / 2
      }
    }
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && isEnabled()) {
        e.preventDefault()
        const d = dist(e.touches)
        const mx = (e.touches[0].clientX + e.touches[1].clientX) / 2
        const my = (e.touches[0].clientY + e.touches[1].clientY) / 2
        const ratio = d / (pinchDist || d)
        const old = scale.current
        const next = clamp(old * ratio, MIN_SCALE, MAX_SCALE)
        const sr = next / old
        tx.current = mx - (mx - tx.current) * sr + (mx - pinchX)
        ty.current = my - (my - ty.current) * sr + (my - pinchY)
        scale.current = next
        pinchDist = d
        pinchX = mx
        pinchY = my
        apply()
      }
    }

    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointercancel', onUp)
    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('touchstart', onTouchStart, { passive: false })
    el.addEventListener('touchmove', onTouchMove, { passive: false })

    return () => {
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointercancel', onUp)
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
    }
  }, [apply, zoomAt, startInertia, containerRef, enabled])

  return { flyTo, zoomAt, panBy, reset, getState }
}
