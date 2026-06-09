import { useEffect, useRef } from 'react'

const INTERACTIVE = 'a, button, [data-cursor], input, textarea, [role="button"]'

/**
 * Animated cursor: an instant dot + a spring-lagged aurora ring that grows over
 * interactive elements and can show a contextual label (data-cursor-label).
 * Mounted only on fine-pointer, motion-allowed devices.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    document.documentElement.classList.add('cursor-active')

    let mx = window.innerWidth / 2
    let my = window.innerHeight / 2
    let rx = mx
    let ry = my
    let hovering = false
    let down = false
    let visible = false
    let raf = 0

    const onMove = (e: PointerEvent) => {
      mx = e.clientX
      my = e.clientY
      if (!visible) {
        visible = true
        if (dotRef.current) dotRef.current.style.opacity = '1'
        if (ringRef.current) ringRef.current.style.opacity = '1'
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`
      }
    }

    const onOver = (e: Event) => {
      const el = (e.target as HTMLElement)?.closest?.(INTERACTIVE) as HTMLElement | null
      hovering = !!el
      const label = el?.getAttribute('data-cursor-label') ?? ''
      if (labelRef.current) {
        labelRef.current.textContent = label
        labelRef.current.style.opacity = label ? '1' : '0'
      }
    }

    const onDown = () => {
      down = true
    }
    const onUp = () => {
      down = false
    }
    const onLeave = () => {
      visible = false
      if (dotRef.current) dotRef.current.style.opacity = '0'
      if (ringRef.current) ringRef.current.style.opacity = '0'
    }

    const tick = () => {
      rx += (mx - rx) * 0.18
      ry += (my - ry) * 0.18
      const scale = (hovering ? 1.9 : 1) * (down ? 0.82 : 1)
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${scale})`
        ringRef.current.style.borderColor = hovering ? 'rgba(167,139,250,0.9)' : 'rgba(110,231,249,0.6)'
        ringRef.current.style.background = hovering ? 'rgba(167,139,250,0.10)' : 'transparent'
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    document.addEventListener('mouseleave', onLeave)

    return () => {
      cancelAnimationFrame(raf)
      document.documentElement.classList.remove('cursor-active')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] flex h-9 w-9 items-center justify-center rounded-full border opacity-0"
        style={{ borderColor: 'rgba(110,231,249,0.6)', transition: 'opacity 250ms ease', willChange: 'transform' }}
      >
        <span
          ref={labelRef}
          className="absolute left-1/2 top-[120%] -translate-x-1/2 whitespace-nowrap font-mono text-[0.6rem] tracking-wide text-ink opacity-0"
          style={{ transition: 'opacity 180ms ease' }}
        />
      </div>
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-1.5 w-1.5 rounded-full opacity-0"
        style={{ background: '#6EE7F9', boxShadow: '0 0 8px #6EE7F9', willChange: 'transform' }}
      />
    </>
  )
}
