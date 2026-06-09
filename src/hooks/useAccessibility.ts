import { useEffect, useState } from 'react'

export interface AccessibilityState {
  prefersReducedMotion: boolean
  isMobile: boolean
  /** true → render the clean linear-scroll fallback instead of the spatial canvas */
  useFallback: boolean
  /** true → skip WebGL even on desktop (low core count / reduced motion) */
  lowPower: boolean
}

function detectLowPower(): boolean {
  if (typeof navigator === 'undefined') return false
  const cores = navigator.hardwareConcurrency
  // @ts-expect-error — deviceMemory is non-standard but present in Chromium
  const mem = navigator.deviceMemory as number | undefined
  return (cores !== undefined && cores <= 4) || (mem !== undefined && mem <= 2)
}

export function useAccessibility(): AccessibilityState {
  const [prefersReducedMotion, setPRM] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [isMobile, setIsMobile] = useState(
    () =>
      typeof window !== 'undefined' &&
      (window.innerWidth < 820 || window.matchMedia('(hover: none) and (pointer: coarse)').matches),
  )
  const [lowPower] = useState(detectLowPower)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onPRM = (e: MediaQueryListEvent) => setPRM(e.matches)
    mq.addEventListener('change', onPRM)

    const onResize = () =>
      setIsMobile(window.innerWidth < 820 || window.matchMedia('(hover: none) and (pointer: coarse)').matches)
    window.addEventListener('resize', onResize)

    return () => {
      mq.removeEventListener('change', onPRM)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return {
    prefersReducedMotion,
    isMobile,
    useFallback: prefersReducedMotion || isMobile,
    lowPower: lowPower || prefersReducedMotion,
  }
}
