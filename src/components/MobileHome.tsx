import { Link } from 'react-router-dom'
import { useUI } from '../store'
import { contact, hero, nodes } from '../data/content'

function hexA(hex: string, a: number) {
  const h = hex.replace('#', '')
  return `rgba(${parseInt(h.slice(0, 2), 16)}, ${parseInt(h.slice(2, 4), 16)}, ${parseInt(h.slice(4, 6), 16)}, ${a})`
}

const cards = nodes.filter((n) => n.kind !== 'hero')

export function MobileHome() {
  const openTerminal = useUI((s) => s.openTerminal)

  return (
    <div className="relative z-10 min-h-screen">
      <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-void/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3">
          <span className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-aurora text-[0.72rem] font-bold text-void">V</span>
            <span className="font-display text-sm text-ink">Vishnu · OS</span>
          </span>
          <button onClick={openTerminal} className="font-mono text-[0.72rem] tracking-wide text-ink-secondary hover:text-aurora-cyan" aria-label="Open terminal">
            {'>_'} terminal
          </button>
        </div>
      </header>

      {/* hero */}
      <section className="mx-auto max-w-3xl px-5 pb-8 pt-14 text-center">
        <p className="font-mono text-[0.64rem] uppercase tracking-[0.26em] text-ink-secondary">{hero.eyebrow}</p>
        <h1 className="mt-5 whitespace-pre-line font-display text-aurora" style={{ fontSize: 'clamp(2.4rem,11vw,3.6rem)', lineHeight: 1.04, fontWeight: 700, letterSpacing: '-0.03em' }}>
          {hero.name}
        </h1>
        <p className="mx-auto mt-5 max-w-md font-display text-ink" style={{ fontSize: '1.25rem', lineHeight: 1.3, fontWeight: 600 }}>
          {hero.headline}
        </p>
        <p className="mx-auto mt-3 max-w-sm text-ink-secondary">{hero.sub}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {hero.chips.map((c) => (
            <span key={c} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-[0.66rem] text-ink-secondary">
              {c}
            </span>
          ))}
        </div>
      </section>

      {/* card grid → individual pages */}
      <section className="mx-auto max-w-3xl px-5 pb-16">
        <p className="mb-4 font-mono text-[0.7rem] uppercase tracking-[0.24em] text-ink-muted">// explore</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {cards.map((n) => (
            <Link
              key={n.id}
              to={`/p/${n.id}`}
              className="group relative overflow-hidden rounded-xl border bg-surface/80 p-5"
              style={{ borderColor: hexA(n.color, 0.18) }}
            >
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-1/2 opacity-20"
                style={{ background: `radial-gradient(120% 130% at 30% 0%, ${hexA(n.color, 0.9)}, transparent 70%)` }}
              />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em]" style={{ color: hexA(n.color, 0.85) }}>
                    {n.kind === 'project' ? 'project' : n.kind === 'work' ? 'experience' : n.kind}
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: n.color, boxShadow: `0 0 8px ${n.color}` }} />
                </div>
                <div className="mt-3 font-display text-ink" style={{ fontSize: '1.3rem', fontWeight: 600 }}>
                  {n.label}
                </div>
                {n.tag && <div className="mt-1.5 font-mono text-[0.7rem] text-ink-secondary">{n.tag}</div>}
                <div className="mt-4 font-mono text-[0.7rem]" style={{ color: hexA(n.color, 0.9) }}>
                  view →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="mx-auto max-w-3xl px-5 py-10 text-center font-mono text-[0.66rem] tracking-wide text-ink-muted">
        Built by Varada Sai Datta Vishnu · {contact.location}
      </footer>
    </div>
  )
}
