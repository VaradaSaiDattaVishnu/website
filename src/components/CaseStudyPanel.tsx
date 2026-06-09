import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useUI } from '../store'
import {
  about,
  contact,
  experience,
  journey,
  nodeById,
  projectById,
  skills,
  type SpatialNode,
} from '../data/content'

function hexA(hex: string, a: number) {
  const h = hex.replace('#', '')
  return `rgba(${parseInt(h.slice(0, 2), 16)}, ${parseInt(h.slice(2, 4), 16)}, ${parseInt(h.slice(4, 6), 16)}, ${a})`
}

function StackChips({ items, accent }: { items: string[]; accent: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((s) => (
        <span
          key={s}
          className="rounded-md border px-2.5 py-1 font-mono text-[0.7rem] tracking-wide text-ink-secondary"
          style={{ borderColor: hexA(accent, 0.22), background: hexA(accent, 0.06) }}
        >
          {s}
        </span>
      ))}
    </div>
  )
}

function LinkButton({ href, children, accent, primary }: { href: string; children: React.ReactNode; accent: string; primary?: boolean }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-md px-4 py-2 font-mono text-[0.78rem] tracking-wide transition-all duration-200 hover:-translate-y-0.5"
      style={
        primary
          ? { background: accent, color: '#06070B', fontWeight: 600, boxShadow: `0 0 28px ${hexA(accent, 0.45)}` }
          : { border: `1px solid ${hexA(accent, 0.3)}`, color: '#EDEFF7', background: hexA(accent, 0.05) }
      }
    >
      {children}
    </a>
  )
}

function CopyRow({ label, value, copyValue, accent, href }: { label: string; value: string; copyValue?: string; accent: string; href?: string }) {
  const [copied, setCopied] = useState(false)
  const text = copyValue ?? value
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/[0.06] py-3">
      <span className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-ink-muted">{label}</span>
      <div className="flex items-center gap-3">
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className="text-ink hover:text-aurora-cyan" style={{ fontSize: '0.92rem' }}>
            {value}
          </a>
        ) : (
          <span className="text-ink" style={{ fontSize: '0.92rem' }}>
            {value}
          </span>
        )}
        <button
          onClick={() => {
            navigator.clipboard?.writeText(text)
            setCopied(true)
            setTimeout(() => setCopied(false), 1400)
          }}
          className="rounded px-2 py-1 font-mono text-[0.62rem] tracking-wide transition-colors"
          style={{ color: copied ? accent : '#4A5068', border: `1px solid ${hexA(accent, copied ? 0.4 : 0.14)}` }}
          aria-label={`Copy ${label}`}
        >
          {copied ? 'copied' : 'copy'}
        </button>
      </div>
    </div>
  )
}

export function PanelBody({ node }: { node: SpatialNode }) {
  const accent = node.color

  // ── Projects + CUBE work ────────────────────────────────────────────────
  if (node.kind === 'project' || node.kind === 'work') {
    const p = projectById(node.id)
    if (!p) return null
    return (
      <div>
        <p className="font-mono text-[0.72rem] uppercase tracking-[0.2em]" style={{ color: accent }}>
          {p.titleTag}
          {p.year ? ` · ${p.year}` : ''}
        </p>
        <h2 className="mt-3 font-display text-ink" style={{ fontSize: '2.6rem', fontWeight: 600, letterSpacing: '-0.02em' }}>
          {p.name}
        </h2>
        <p className="mt-5 text-ink" style={{ fontSize: '1.18rem', lineHeight: 1.5, fontWeight: 500 }}>
          {p.hook}
        </p>
        <p className="mt-4 text-ink-secondary" style={{ fontSize: '1rem', lineHeight: 1.75 }}>
          {p.blurb}
        </p>

        <div className="mt-7">
          <p className="mb-3 font-mono text-[0.66rem] uppercase tracking-[0.2em] text-ink-muted">stack</p>
          <StackChips items={p.stack} accent={accent} />
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {p.live && (
            <LinkButton href={p.live} accent={accent} primary>
              Open live ↗
            </LinkButton>
          )}
          {p.github && (
            <LinkButton href={p.github} accent={accent}>
              View source
            </LinkButton>
          )}
          {p.isPrivate && (
            <span className="inline-flex items-center gap-2 rounded-md border border-white/10 px-3.5 py-2 font-mono text-[0.74rem] text-ink-muted">
              <span aria-hidden>🔒</span> Private repo · available on request
            </span>
          )}
        </div>
      </div>
    )
  }

  // ── About ───────────────────────────────────────────────────────────────
  if (node.id === 'about') {
    return (
      <div>
        <p className="font-mono text-[0.72rem] uppercase tracking-[0.2em]" style={{ color: accent }}>
          {about.label}
        </p>
        <h2 className="mt-3 font-display text-ink" style={{ fontSize: '2.4rem', fontWeight: 600 }}>
          About
        </h2>
        {about.paragraphs.map((para, i) => (
          <p key={i} className="mt-4 text-ink-secondary" style={{ fontSize: '1.05rem', lineHeight: 1.75 }}>
            {para}
          </p>
        ))}
        <p className="mt-6 border-l-2 pl-4 font-display text-ink" style={{ borderColor: accent, fontSize: '1.1rem', lineHeight: 1.4 }}>
          {about.tag}
        </p>
      </div>
    )
  }

  // ── Journey ───────────────────────────────────────────────────────────────
  if (node.id === 'journey') {
    return (
      <div>
        <p className="font-mono text-[0.72rem] uppercase tracking-[0.2em]" style={{ color: accent }}>
          {journey.label}
        </p>
        <h2 className="mt-3 font-display text-ink" style={{ fontSize: '2.4rem', fontWeight: 600 }}>
          {journey.title}
        </h2>
        <p className="mt-5 text-ink-secondary" style={{ fontSize: '1.08rem', lineHeight: 1.75 }}>
          {journey.body}
        </p>
        <div className="mt-8 space-y-0">
          {journey.milestones.map((m, i) => (
            <div key={i} className="flex gap-4 border-b border-white/[0.06] py-3.5">
              <span className="w-16 shrink-0 font-mono text-[0.8rem]" style={{ color: accent }}>
                {m.year}
              </span>
              <span className="text-ink-secondary" style={{ fontSize: '0.98rem' }}>
                {m.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── Experience (CUBE) ─────────────────────────────────────────────────────
  if (node.id === 'experience') {
    return (
      <div>
        <p className="font-mono text-[0.72rem] uppercase tracking-[0.2em]" style={{ color: accent }}>
          {experience.label}
        </p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-2">
          <h2 className="font-display text-ink" style={{ fontSize: '2.4rem', fontWeight: 600 }}>
            {experience.company}
          </h2>
          <span className="font-mono text-[0.8rem] text-ink-muted">{experience.period}</span>
        </div>
        <p className="mt-1 text-ink-secondary">
          {experience.role} · {experience.location}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {experience.metrics.map((m) => (
            <div key={m.label} className="rounded-md border border-white/[0.07] bg-white/[0.02] p-3.5">
              <div className="font-display" style={{ color: accent, fontSize: '1.5rem', fontWeight: 700 }}>
                {m.value}
              </div>
              <div className="mt-1 text-ink" style={{ fontSize: '0.8rem' }}>
                {m.label}
              </div>
              <div className="mt-1.5 text-ink-muted" style={{ fontSize: '0.72rem', lineHeight: 1.4 }}>
                {m.detail}
              </div>
            </div>
          ))}
        </div>

        <ul className="mt-7 space-y-2.5">
          {experience.builds.map((b, i) => (
            <li key={i} className="flex gap-3 text-ink-secondary" style={{ fontSize: '0.98rem', lineHeight: 1.6 }}>
              <span style={{ color: accent }} aria-hidden>
                ▹
              </span>
              {b}
            </li>
          ))}
        </ul>
      </div>
    )
  }

  // ── Skills ─────────────────────────────────────────────────────────────────
  if (node.id === 'skills') {
    return (
      <div>
        <p className="font-mono text-[0.72rem] uppercase tracking-[0.2em]" style={{ color: accent }}>
          {skills.label}
        </p>
        <h2 className="mt-3 font-display text-ink" style={{ fontSize: '2.4rem', fontWeight: 600 }}>
          Skills
        </h2>
        <div className="mt-6 space-y-5">
          {skills.groups.map((g) => (
            <div key={g.group}>
              <p className="mb-2.5 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-ink-muted">{g.group}</p>
              <StackChips items={g.items} accent={accent} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── Contact ─────────────────────────────────────────────────────────────────
  if (node.id === 'contact') {
    return (
      <div>
        <p className="font-mono text-[0.72rem] uppercase tracking-[0.2em]" style={{ color: accent }}>
          {contact.label}
        </p>
        <h2 className="mt-3 font-display text-ink" style={{ fontSize: '2.4rem', fontWeight: 600 }}>
          Let’s talk
        </h2>
        {contact.ctaLines.map((l, i) => (
          <p key={i} className="mt-3 text-ink-secondary" style={{ fontSize: '1.05rem', lineHeight: 1.65 }}>
            {l}
          </p>
        ))}
        <div className="mt-6">
          <CopyRow label="email" value={contact.email} accent={accent} href={`mailto:${contact.email}`} />
          <CopyRow label="phone" value={contact.phone} accent={accent} href={`tel:${contact.phone.replace(/[^+\d]/g, '')}`} />
          <CopyRow label="github" value={contact.githubLabel} copyValue={contact.github} accent={accent} href={contact.github} />
          <CopyRow label="location" value={contact.location} accent={accent} />
        </div>
        <div className="mt-7">
          <LinkButton href={`mailto:${contact.email}`} accent={accent} primary>
            Write to me ↗
          </LinkButton>
        </div>
      </div>
    )
  }

  return null
}

export function CaseStudyPanel() {
  const selectedId = useUI((s) => s.selectedId)
  const closePanel = useUI((s) => s.closePanel)
  const node = selectedId ? nodeById(selectedId) : undefined
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!node) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePanel()
    }
    window.addEventListener('keydown', onKey)
    const t = setTimeout(() => closeRef.current?.focus(), 60)
    return () => {
      window.removeEventListener('keydown', onKey)
      clearTimeout(t)
    }
  }, [node, closePanel])

  return (
    <AnimatePresence>
      {node && node.kind !== 'hero' && (
        <motion.div
          key="backdrop"
          className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto p-4 sm:p-8"
          style={{ background: 'rgba(3,4,8,0.62)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closePanel()
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${node.label} details`}
            className="glass-panel-active relative my-auto w-full max-w-2xl rounded-xl p-7 sm:p-10"
            initial={{ opacity: 0, y: 26, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.99 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          >
            <button
              ref={closeRef}
              onClick={closePanel}
              aria-label="Close"
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-white/10 text-ink-secondary transition-colors hover:border-white/30 hover:text-ink"
            >
              ✕
            </button>
            <PanelBody node={node} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
