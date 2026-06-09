import { create } from 'zustand'

interface UIState {
  booted: boolean
  selectedId: string | null
  terminalOpen: boolean
  paletteOpen: boolean
  tourActive: boolean
  tourStep: number
  hasExplored: boolean

  setBooted: (v: boolean) => void
  select: (id: string | null) => void
  closePanel: () => void
  openTerminal: () => void
  closeTerminal: () => void
  togglePalette: (v?: boolean) => void
  startTour: () => void
  stopTour: () => void
  setTourStep: (n: number) => void
  markExplored: () => void
}

export const useUI = create<UIState>((set) => ({
  booted: typeof location !== 'undefined' && location.search.includes('noboot'),
  selectedId: null,
  terminalOpen: typeof location !== 'undefined' && location.search.includes('term'),
  paletteOpen: typeof location !== 'undefined' && location.search.includes('cmd'),
  tourActive: false,
  tourStep: 0,
  hasExplored: typeof localStorage !== 'undefined' && localStorage.getItem('vishnu_os_explored') === '1',

  setBooted: (v) => set({ booted: v }),
  select: (id) => set({ selectedId: id }),
  closePanel: () => set({ selectedId: null }),
  openTerminal: () => set({ terminalOpen: true, paletteOpen: false }),
  closeTerminal: () => set({ terminalOpen: false }),
  togglePalette: (v) => set((s) => ({ paletteOpen: v ?? !s.paletteOpen })),
  startTour: () => set({ tourActive: true, tourStep: 0, paletteOpen: false, selectedId: null }),
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
