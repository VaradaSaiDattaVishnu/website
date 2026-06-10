import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  about,
  contact,
  cubeWork,
  experience,
  journey,
  nodeById,
  nodes,
  projectById,
  skills,
  type SpatialNode,
} from '../data/content'

const navNodes = nodes.filter((n) => n.kind !== 'hero')

function hexA(hex: string, a: number) {
  const h = hex.replace('#', '')
  return `rgba(${parseInt(h.slice(0, 2), 16)}, ${parseInt(h.slice(2, 4), 16)}, ${parseInt(h.slice(4, 6), 16)}, ${a})`
}

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  )
}

function SectionLabel({ children, accent }: { children: React.ReactNode; accent: string }) {
  return (
    <p className="mb-5 font-mono text-[0.72rem] uppercase tracking-[0.24em]" style={{ color: accent }}>
      {children}
    </p>
  )
}

function Chips({ items, accent }: { items: string[]; accent: string }) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {items.map((s) => (
        <span
          key={s}
          data-cursor
          className="rounded-md border px-3 py-1.5 font-mono text-[0.78rem] tracking-wide text-ink-secondary"
          style={{ borderColor: hexA(accent, 0.24), background: hexA(accent, 0.06) }}
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
      data-cursor-label="open ↗"
      className="inline-flex items-center gap-2 rounded-md px-5 py-2.5 font-mono text-[0.82rem] tracking-wide transition-transform duration-200 hover:-translate-y-0.5"
      style={
        primary
          ? { background: accent, color: '#06070B', fontWeight: 600, boxShadow: `0 0 30px ${hexA(accent, 0.45)}` }
          : { border: `1px solid ${hexA(accent, 0.32)}`, color: '#EDEFF7', background: hexA(accent, 0.05) }
      }
    >
      {children}
    </a>
  )
}

function CopyRow({ label, value, copyValue, accent, href }: { label: string; value: string; copyValue?: string; accent: string; href?: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/[0.06] py-3.5">
      <span className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-ink-muted">{label}</span>
      <div className="flex items-center gap-3">
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className="text-ink hover:text-aurora-cyan" style={{ fontSize: '0.95rem' }}>
            {value}
          </a>
        ) : (
          <span className="text-ink" style={{ fontSize: '0.95rem' }}>
            {value}
          </span>
        )}
        <button
          data-cursor
          onClick={() => {
            navigator.clipboard?.writeText(copyValue ?? value)
            setCopied(true)
            setTimeout(() => setCopied(false), 1400)
          }}
          className="rounded px-2 py-1 font-mono text-[0.62rem] tracking-wide"
          style={{ color: copied ? accent : '#4A5068', border: `1px solid ${hexA(accent, copied ? 0.4 : 0.14)}` }}
        >
          {copied ? 'copied' : 'copy'}
        </button>
      </div>
    </div>
  )
}

function BrowserFrame({ url, accent }: { url: string; accent: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.08]" style={{ boxShadow: `0 0 60px ${hexA(accent, 0.12)}, 0 30px 80px rgba(0,0,0,0.5)` }}>
      <div className="flex items-center gap-2 border-b border-white/[0.07] bg-deep/80 px-4 py-2.5">
        <span className="h-3 w-3 rounded-full" style={{ background: '#FB7185' }} />
        <span className="h-3 w-3 rounded-full" style={{ background: '#FBBF24' }} />
        <span className="h-3 w-3 rounded-full" style={{ background: '#34D399' }} />
        <span className="ml-3 truncate font-mono text-[0.7rem] text-ink-muted">{url}</span>
      </div>
      <iframe
        src={url}
        title="Live demo"
        loading="lazy"
        className="block w-full bg-void"
        style={{ height: 'min(68vh, 560px)', border: 0 }}
      />
    </div>
  )
}

function ProjectBody({ node }: { node: SpatialNode }) {
  const accent = node.color
  const p = projectById(node.id)!
  const isCube = node.id === 'cube'

  return (
    <>
      <Reveal>
        <SectionLabel accent={accent}>// overview</SectionLabel>
        <p className="text-ink" style={{ fontSize: '1.3rem', lineHeight: 1.6, fontWeight: 500 }}>
          {p.hook}
        </p>
        <p className="mt-5 text-ink-secondary" style={{ fontSize: '1.05rem', lineHeight: 1.8 }}>
          {p.blurb}
        </p>
      </Reveal>

      {p.live && (
        <Reveal>
          <SectionLabel accent={accent}>// live — interact below</SectionLabel>
          <BrowserFrame url={p.live} accent={accent} />
        </Reveal>
      )}

      <Reveal>
        <SectionLabel accent={accent}>// stack</SectionLabel>
        <Chips items={p.stack} accent={accent} />
      </Reveal>

      {isCube && (
        <Reveal>
          <SectionLabel accent={accent}>// measured impact</SectionLabel>
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3">
            {experience.metrics.map((m) => (
              <div key={m.label} className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-4">
                <div className="font-display" style={{ color: accent, fontSize: '1.7rem', fontWeight: 700 }}>
                  {m.value}
                </div>
                <div className="mt-1 text-ink" style={{ fontSize: '0.82rem' }}>
                  {m.label}
                </div>
                <div className="mt-1.5 text-ink-muted" style={{ fontSize: '0.72rem', lineHeight: 1.4 }}>
                  {m.detail}
                </div>
              </div>
            ))}
          </div>
          <ul className="mt-7 space-y-3">
            {experience.builds.map((b, i) => (
              <li key={i} className="flex gap-3 text-ink-secondary" style={{ fontSize: '1rem', lineHeight: 1.6 }}>
                <span style={{ color: accent }} aria-hidden>
                  ▹
                </span>
                {b}
              </li>
            ))}
          </ul>
        </Reveal>
      )}

      {(p.live || p.github || p.isPrivate) && (
        <Reveal>
          <SectionLabel accent={accent}>// explore</SectionLabel>
          <div className="flex flex-wrap items-center gap-3">
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
              <span className="inline-flex items-center gap-2 rounded-md border border-white/10 px-4 py-2.5 font-mono text-[0.78rem] text-ink-muted">
                <span aria-hidden>🔒</span> Private repo · available on request
              </span>
            )}
          </div>
        </Reveal>
      )}
    </>
  )
}

function SectionContent({ node }: { node: SpatialNode }) {
  const accent = node.color

  if (node.id === 'about') {
    return (
      <>
        <Reveal>
          <SectionLabel accent={accent}>// who</SectionLabel>
          {about.paragraphs.map((para, i) => (
            <p key={i} className="mt-4 text-ink-secondary" style={{ fontSize: '1.12rem', lineHeight: 1.8 }}>
              {para}
            </p>
          ))}
        </Reveal>
        <Reveal>
          <p className="border-l-2 pl-5 font-display text-ink" style={{ borderColor: accent, fontSize: '1.3rem', lineHeight: 1.4 }}>
            {about.tag}
          </p>
        </Reveal>
      </>
    )
  }

  if (node.id === 'journey') {
    return (
      <>
        <Reveal>
          <SectionLabel accent={accent}>// civil → software</SectionLabel>
          <p className="text-ink-secondary" style={{ fontSize: '1.18rem', lineHeight: 1.8 }}>
            {journey.body}
          </p>
        </Reveal>
        <Reveal>
          <div className="space-y-0">
            {journey.milestones.map((m, i) => (
              <div key={i} className="flex gap-5 border-b border-white/[0.06] py-4">
                <span className="w-16 shrink-0 font-mono text-[0.85rem]" style={{ color: accent }}>
                  {m.year}
                </span>
                <span className="text-ink-secondary" style={{ fontSize: '1.02rem' }}>
                  {m.text}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </>
    )
  }

  if (node.id === 'experience') {
    return (
      <>
        <Reveal>
          <SectionLabel accent={accent}>// where I’ve shipped</SectionLabel>
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h3 className="font-display text-ink" style={{ fontSize: '1.7rem', fontWeight: 600 }}>
              {experience.company} · {experience.role}
            </h3>
            <span className="font-mono text-[0.8rem] text-ink-muted">{experience.period}</span>
          </div>
          <p className="mt-1 text-ink-secondary">{experience.location}</p>
        </Reveal>
        <Reveal>
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3">
            {experience.metrics.map((m) => (
              <div key={m.label} className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-4">
                <div className="font-display" style={{ color: accent, fontSize: '1.7rem', fontWeight: 700 }}>
                  {m.value}
                </div>
                <div className="mt-1 text-ink" style={{ fontSize: '0.82rem' }}>
                  {m.label}
                </div>
                <div className="mt-1.5 text-ink-muted" style={{ fontSize: '0.72rem', lineHeight: 1.4 }}>
                  {m.detail}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal>
          <p className="mb-1 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-ink-muted">what I built</p>
          <ul className="space-y-3">
            {experience.builds.map((b, i) => (
              <li key={i} className="flex gap-3 text-ink-secondary" style={{ fontSize: '1rem', lineHeight: 1.6 }}>
                <span style={{ color: accent }} aria-hidden>
                  ▹
                </span>
                {b}
              </li>
            ))}
          </ul>
        </Reveal>
      </>
    )
  }

  if (node.id === 'skills') {
    return (
      <Reveal>
        <SectionLabel accent={accent}>// what I work with</SectionLabel>
        <div className="space-y-7">
          {skills.groups.map((g) => (
            <div key={g.group}>
              <p className="mb-3 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-ink-muted">{g.group}</p>
              <Chips items={g.items} accent={accent} />
            </div>
          ))}
        </div>
      </Reveal>
    )
  }

  if (node.id === 'contact') {
    return (
      <>
        <Reveal>
          <SectionLabel accent={accent}>// let’s talk</SectionLabel>
          {contact.ctaLines.map((l, i) => (
            <p key={i} className="mt-2 text-ink-secondary" style={{ fontSize: '1.12rem', lineHeight: 1.65 }}>
              {l}
            </p>
          ))}
        </Reveal>
        <Reveal>
          <div>
            <CopyRow label="email" value={contact.email} accent={accent} href={`mailto:${contact.email}`} />
            <CopyRow label="phone" value={contact.phone} accent={accent} href={`tel:${contact.phone.replace(/[^+\d]/g, '')}`} />
            <CopyRow label="github" value={contact.githubLabel} copyValue={contact.github} accent={accent} href={contact.github} />
            <CopyRow label="location" value={contact.location} accent={accent} />
          </div>
          <div className="mt-8">
            <LinkButton href={`mailto:${contact.email}`} accent={accent} primary>
              Write to me ↗
            </LinkButton>
          </div>
        </Reveal>
      </>
    )
  }

  return null
}

export function ProjectPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const node = id ? nodeById(id) : undefined

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') navigate('/')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate])

  if (!node || node.kind === 'hero') return <Navigate to="/" replace />

  const accent = node.color
  const isProjectLike = node.kind === 'project' || node.kind === 'work'
  const p = isProjectLike ? projectById(node.id) : undefined
  const eyebrow = p?.titleTag ?? node.tag ?? node.kind
  const lead = p?.hook
  const title = node.kind === 'work' ? cubeWork.name : p?.name ?? node.label

  const i = navNodes.findIndex((n) => n.id === node.id)
  const prev = navNodes[(i - 1 + navNodes.length) % navNodes.length]
  const next = navNodes[(i + 1) % navNodes.length]

  return (
    <motion.div
      className="relative z-10 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* top bar */}
      <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between px-5 py-4">
        <Link
          to="/"
          data-cursor-label="back"
          className="glass-panel flex items-center gap-2 rounded-full px-4 py-2 font-mono text-[0.72rem] tracking-wide text-ink-secondary transition-colors hover:text-ink"
        >
          ← cosmos
        </Link>
        <span className="hidden font-mono text-[0.7rem] tracking-wide text-ink-muted sm:block">{node.label}</span>
        <div className="flex items-center gap-2">
          <Link to={`/p/${prev.id}`} aria-label={`Previous: ${prev.label}`} data-cursor className="glass-panel grid h-9 w-9 place-items-center rounded-full text-ink-secondary hover:text-ink">
            ←
          </Link>
          <Link to={`/p/${next.id}`} aria-label={`Next: ${next.label}`} data-cursor className="glass-panel grid h-9 w-9 place-items-center rounded-full text-ink-secondary hover:text-ink">
            →
          </Link>
        </div>
      </header>

      {/* hero */}
      <header className="mx-auto flex min-h-[86vh] max-w-4xl flex-col justify-center px-6">
        <motion.p
          className="font-mono text-[0.78rem] uppercase tracking-[0.24em]"
          style={{ color: accent }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {eyebrow}
        </motion.p>
        <motion.h1
          className="mt-4 font-display text-aurora animate-drift"
          style={{ fontSize: 'clamp(2.8rem, 8vw, 6rem)', lineHeight: 1.0, fontWeight: 700, letterSpacing: '-0.035em' }}
          initial={{ opacity: 0, y: 22, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
        >
          {title}
        </motion.h1>
        {lead && (
          <motion.p
            className="mt-6 max-w-2xl text-ink"
            style={{ fontSize: 'clamp(1.1rem, 2.4vw, 1.5rem)', lineHeight: 1.5, fontWeight: 500 }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {lead}
          </motion.p>
        )}
        <motion.div
          className="mt-12 font-mono text-[0.7rem] tracking-[0.2em] text-ink-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.7 }}
        >
          <span className="inline-block animate-float">scroll ↓</span>
        </motion.div>
      </header>

      {/* content (darkened scrim over the cosmos for legibility) */}
      <div style={{ background: 'linear-gradient(to bottom, transparent, rgba(6,7,11,0.85) 8%, rgba(6,7,11,0.94))' }}>
        <div className="mx-auto max-w-3xl space-y-24 px-6 pb-24 pt-12">
          {isProjectLike ? <ProjectBody node={node} /> : <SectionContent node={node} />}
        </div>

        {/* prev / next */}
        <div className="mx-auto grid max-w-3xl gap-4 px-6 pb-28 sm:grid-cols-2">
          {[prev, next].map((n, k) => (
            <Link
              key={n.id}
              to={`/p/${n.id}`}
              data-cursor-label={k === 0 ? 'previous' : 'next'}
              className="group rounded-xl border border-white/[0.07] bg-white/[0.02] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/20"
              style={{ textAlign: k === 0 ? 'left' : 'right' }}
            >
              <span className="font-mono text-[0.66rem] uppercase tracking-[0.2em] text-ink-muted">{k === 0 ? '← previous' : 'next →'}</span>
              <div className="mt-2 font-display text-ink" style={{ fontSize: '1.3rem', fontWeight: 600 }}>
                {n.label}
              </div>
              {n.tag && <div className="mt-1 font-mono text-[0.7rem] text-ink-secondary">{n.tag}</div>}
            </Link>
          ))}
        </div>

        <footer className="border-t border-white/[0.06] px-6 py-10 text-center font-mono text-[0.66rem] tracking-wide text-ink-muted">
          <Link to="/" data-cursor-label="back" className="hover:text-aurora-cyan">
            ← back to the cosmos
          </Link>
          <span className="mx-3">·</span>
          Varada Sai Datta Vishnu · {contact.location}
        </footer>
      </div>
    </motion.div>
  )
}
