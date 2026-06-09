import { useUI } from '../store'

interface Props {
  zoomAt: (px: number, py: number, delta: number) => void
  reset: () => void
  size: { w: number; h: number }
}

function CtrlButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      aria-label={label}
      title={label}
      onClick={onClick}
      className="glass-panel grid h-10 w-10 place-items-center rounded-md font-mono text-ink-secondary transition-all duration-200 hover:text-aurora-cyan hover:shadow-glow-sm"
    >
      {children}
    </button>
  )
}

export function ViewControls({ zoomAt, reset, size }: Props) {
  const openTerminal = useUI((s) => s.openTerminal)
  const startTour = useUI((s) => s.startTour)
  return (
    <div role="toolbar" aria-label="View controls" className="fixed bottom-5 left-5 z-50 flex flex-col gap-2">
      <CtrlButton label="Zoom in" onClick={() => zoomAt(size.w / 2, size.h / 2, -320)}>
        +
      </CtrlButton>
      <CtrlButton label="Zoom out" onClick={() => zoomAt(size.w / 2, size.h / 2, 320)}>
        −
      </CtrlButton>
      <CtrlButton label="Reset view" onClick={reset}>
        ⌂
      </CtrlButton>
      <CtrlButton label="Guided tour" onClick={startTour}>
        ◎
      </CtrlButton>
      <CtrlButton label="Open terminal" onClick={openTerminal}>
        <span className="text-[0.8rem]">{'>_'}</span>
      </CtrlButton>
    </div>
  )
}
