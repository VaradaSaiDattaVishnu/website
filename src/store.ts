import { create } from 'zustand'

interface UIState {
  booted: boolean
  terminalOpen: boolean
  paletteOpen: boolean
  tourActive: boolean
  tourStep: number
  hasExplored: boolean

  setBooted: (v: boolean) => void
  openTerminal: () => void
  closeTerminal: () => void
  togglePalette: (v?: boolean) => void
  startTour: () => void
  stopTour: () => void
  setTourStep: (n: number) => void
  markExplored: () => void
}

const hasParam = (p: string) => typeof location !== 'undefined' && location.search.includes(p)

export const useUI = create<UIState>((set) => ({
  booted: hasParam('noboot'),
  terminalOpen: hasParam('term'),
  paletteOpen: hasParam('cmd'),
  tourActive: false,
  tourStep: 0,
  hasExplored: typeof localStorage !== 'undefined' && localStorage.getItem('vishnu_os_explored') === '1',

  setBooted: (v) => set({ booted: v }),
  openTerminal: () => set({ terminalOpen: true, paletteOpen: false }),
  closeTerminal: () => set({ terminalOpen: false }),
  togglePalette: (v) => set((s) => ({ paletteOpen: v ?? !s.paletteOpen })),
  startTour: () => set({ tourActive: true, tourStep: 0, paletteOpen: false }),
  stopTour: () => set({ tourActive: false, tourStep: 0 }),
  setTourStep: (n) => set({ tourStep: n }),
  markExplored: () => {
    try {
      localStorage.setItem('vishnu_os_explored', '1')
    } catch {
      /* noop */
    }
    set({ hasExplored: true })
  },
}))
