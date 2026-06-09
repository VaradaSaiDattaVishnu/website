import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useUI } from '../store'
import { contact, nodes } from '../data/content'

interface Command {
  id: string
  label: string
  hint: string
  keywords: string
  run: () => void
}

interface Props {
  flyTo: (x: number, y: number, scale?: number) => void
  reset: () => void
}

export function CommandPalette({ flyTo, reset }: Props) {
  const open = useUI((s) => s.paletteOpen)
  const toggle = useUI((s) => s.togglePalette)
  const select = useUI((s) => s.select)
  const openTerminal = useUI((s) => s.openTerminal)
  const startTour = useUI((s) => s.startTour)

  const [query, setQuery] = useState('')
  const [idx, setIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const commands = useMemo<Command[]>(() => {
    const nav: Command[] = nodes.map((n) => ({
      id: `go-${n.id}`,
      label: n.id === 'hero' ? 'Go to Home' : `Go to ${n.label}`,
      hint: n.kind,
      keywords: `${n.label} ${n.id} ${n.kind} ${n.tag ?? ''}`.toLowerCase(),
      run: () => {
        flyTo(n.x, n.y, n.flyToScale)
        toggle(false)
        if (n.kind !== 'hero') setTimeout(() => select(n.id), 520)
      },
    }))
    const system: Command[] = [
      { id: 'reset', label: 'Reset View', hint: 'view', keywords: 'reset home center origin', run: () => { reset(); toggle(false) } },
      { id: 'terminal', label: 'Open Terminal', hint: 'tool', keywords: 'terminal cli console command', run: () => { openTerminal() } },
      { id: 'tour', label: 'Start Guided Tour', hint: 'tour', keywords: 'tour guide walkthrough intro', run: () => { startTour() } },
      { id: 'email', label: 'Copy Email Address', hint: 'contact', keywords: 'email copy mail contact', run: () => { navigator.clipboard?.writeText(contact.email); toggle(false) } },
      { id: 'github', label: 'Open GitHub Profile', hint: 'link', keywords: 'github code repos source', run: () => { window.open(contact.github, '_blank', 'noopener'); toggle(false) } },
    ]
    return [...nav, ...system]
  }, [flyTo, reset, toggle, select, openTerminal, startTour])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    return commands.filter((c) => {
      const hay = `${c.label} ${c.keywords}`.toLowerCase()
      let qi = 0
      for (let i = 0; i < hay.length && qi < q.length; i++) if (hay[i] === q[qi]) qi++
      return qi === q.length
    })
  }, [commands, query])

  useEffect(() => setIdx(0), [filtered])

  useEffect(() => {
    if (open) {
      setQuery('')
      const t = setTimeout(() => inputRef.current?.focus(), 40)
      return () => clearTimeout(t)
    }
  }, [open])

  useEffect(() => {
    const item = listRef.current?.children[idx] as HTMLElement | undefined
    item?.scrollIntoView({ block: 'nearest' })
  }, [idx])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setIdx((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setIdx((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      filtered[idx]?.run()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      toggle(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[300] flex items-start justify-center p-4"
          style={{ background: 'rgba(3,4,8,0.55)', backdropFilter: 'blur(5px)', WebkitBackdropFilter: 'blur(5px)', paddingTop: '14vh' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          onClick={(e) => e.target === e.currentTarget && toggle(false)}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="glass-panel-active w-full max-w-xl overflow-hidden rounded-xl"
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.99 }}
            transition={{ type: 'spring', stiffness: 360, damping: 30 }}
            onKeyDown={onKeyDown}
          >
            <input
              ref={inputRef}
              role="combobox"
              aria-expanded
              aria-controls="palette-list"
              aria-autocomplete="list"
              placeholder="Search projects, sections, commands…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full border-b border-white/[0.08] bg-transparent px-5 py-4 text-ink outline-none placeholder:text-ink-muted"
              style={{ fontSize: '1rem' }}
            />
            <ul id="palette-list" role="listbox" className="max-h-[44vh] overflow-y-auto py-2">
              {filtered.length === 0 && (
                <li className="px-5 py-3 font-mono text-[0.8rem] text-ink-muted">no matches</li>
              )}
              {filtered.map((c, i) => (
                <li
                  key={c.id}
                  role="option"
                  aria-selected={i === idx}
                  onMouseEnter={() => setIdx(i)}
                  onClick={c.run}
                  className="mx-2 flex cursor-pointer items-center justify-between rounded-md px-3.5 py-2.5"
                  style={{
                    background: i === idx ? 'rgba(167,139,250,0.16)' : 'transparent',
                    boxShadow: i === idx ? 'inset 2px 0 0 #a78bfa' : 'none',
                  }}
                >
                  <span className="text-ink" style={{ fontSize: '0.9rem' }}>
                    {c.label}
                  </span>
                  <span className="font-mono text-[0.62rem] uppercase tracking-wider text-ink-muted">{c.hint}</span>
                </li>
              ))}
            </ul>
            <div className="flex gap-4 border-t border-white/[0.06] px-5 py-2.5 font-mono text-[0.62rem] tracking-wide text-ink-muted">
              <span>↑↓ navigate</span>
              <span>↵ select</span>
              <span>esc close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
