import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useUI } from '../store'
import { terminalBanner, terminalCommands } from '../data/content'

interface Line {
  kind: 'cmd' | 'out' | 'err'
  text: string
}

const ALIASES: Record<string, string> = {
  ls: 'ls projects',
  'ls projects/': 'ls projects',
  projects: 'ls projects',
  'cat resume.txt': 'cat resume',
  resume: 'cat resume',
  'skills --list': 'skills',
  jarvis: 'open jarvis',
  hire: 'sudo hire-me',
  'hire-me': 'sudo hire-me',
}

const banner: Line[] = terminalBanner.map((t) => ({ kind: 'out', text: t }))

export function Terminal() {
  const open = useUI((s) => s.terminalOpen)
  const close = useUI((s) => s.closeTerminal)
  const startTour = useUI((s) => s.startTour)

  const [lines, setLines] = useState<Line[]>(banner)
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 60)
  }, [open])

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight })
  }, [lines, open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close])

  const run = (raw: string) => {
    const cmd = raw.trim()
    const next: Line[] = [...lines, { kind: 'cmd', text: cmd }]
    if (!cmd) {
      setLines(next)
      return
    }
    const key = ALIASES[cmd.toLowerCase()] ?? cmd.toLowerCase()

    if (key === 'clear') {
      setLines(banner)
      return
    }
    if (key === 'tour') {
      setLines([...next, { kind: 'out', text: 'launching guided tour…' }])
      startTour()
      close()
      return
    }
    if (key === 'exit' || key === 'close' || key === 'q') {
      close()
      return
    }
    const out = terminalCommands[key]
    if (out) {
      setLines([...next, ...out.map((t) => ({ kind: 'out' as const, text: t }))])
    } else {
      setLines([
        ...next,
        { kind: 'err', text: `command not found: ${cmd}` },
        { kind: 'out', text: "type 'help' for a list of commands." },
      ])
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed bottom-6 left-1/2 z-[220] -translate-x-1/2"
          style={{ width: 'min(94vw, 720px)' }}
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          onClick={() => inputRef.current?.focus()}
        >
          <div className="glass-panel-active overflow-hidden rounded-xl" style={{ height: 'min(58vh, 440px)' }}>
            {/* title bar */}
            <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ background: '#FB7185' }} onClick={close} />
                <span className="h-3 w-3 rounded-full" style={{ background: '#FBBF24' }} />
                <span className="h-3 w-3 rounded-full" style={{ background: '#34D399' }} />
              </div>
              <span className="font-mono text-[0.68rem] tracking-wide text-ink-muted">vishnu@os — bash</span>
              <button onClick={close} aria-label="Close terminal" className="font-mono text-[0.72rem] text-ink-muted hover:text-ink">
                esc
              </button>
            </div>

            {/* body */}
            <div ref={bodyRef} className="no-scrollbar h-[calc(100%-44px)] overflow-y-auto px-4 py-3 font-mono text-[0.82rem] leading-relaxed">
              {lines.map((l, i) => (
                <div key={i} className="whitespace-pre-wrap break-words">
                  {l.kind === 'cmd' ? (
                    <span>
                      <span className="text-aurora-cyan">vishnu@os</span>
                      <span className="text-ink-muted">:~$ </span>
                      <span className="text-ink">{l.text}</span>
                    </span>
                  ) : l.kind === 'err' ? (
                    <span className="text-aurora-pink">{l.text}</span>
                  ) : (
                    <span className="text-ink-secondary">{l.text}</span>
                  )}
                </div>
              ))}

              {/* live input line */}
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  run(value)
                  setValue('')
                }}
                className="flex items-center"
              >
                <span className="text-aurora-cyan">vishnu@os</span>
                <span className="text-ink-muted">:~$&nbsp;</span>
                <input
                  ref={inputRef}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  spellCheck={false}
                  autoComplete="off"
                  aria-label="Terminal input"
                  className="flex-1 bg-transparent text-ink caret-aurora-cyan outline-none"
                />
              </form>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
