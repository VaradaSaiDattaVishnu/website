import { useUI } from '../store'
import { contact } from '../data/content'

interface Props {
  reset: () => void
}

function PillButton({ onClick, children, label }: { onClick: () => void; children: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 font-mono text-[0.7rem] tracking-wide text-ink-secondary transition-all duration-200 hover:border-aurora-cyan/40 hover:text-ink"
    >
      {children}
    </button>
  )
}

export function TopBar({ reset }: Props) {
  const openTerminal = useUI((s) => s.openTerminal)
  const togglePalette = useUI((s) => s.togglePalette)
  const startTour = useUI((s) => s.startTour)

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-center justify-between p-5">
      <button
        onClick={reset}
        className="pointer-events-auto flex items-center gap-2.5 outline-none"
        aria-label="Reset to home"
      >
        <span className="grid h-8 w-8 place-items-center rounded-md bg-aurora text-[0.8rem] font-bold text-void">V</span>
        <span className="font-display text-sm tracking-tight text-ink">Vishnu · OS</span>
      </button>

      <div className="pointer-events-auto hidden items-center gap-2 sm:flex">
        <PillButton onClick={startTour} label="Start guided tour">
          tour
        </PillButton>
        <PillButton onClick={openTerminal} label="Open terminal">
          {'>_'} terminal
        </PillButton>
        <PillButton onClick={() => togglePalette(true)} label="Open command palette">
          ⌘K
        </PillButton>
        <a
          href={contact.github}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 font-mono text-[0.7rem] tracking-wide text-ink-secondary transition-all duration-200 hover:border-aurora-cyan/40 hover:text-ink"
        >
          github ↗
        </a>
      </div>
    </div>
  )
}
