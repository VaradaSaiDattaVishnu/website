import { useUI } from '../store'
import { contact, hero, nodeById } from '../data/content'
import { PanelBody } from './CaseStudyPanel'

const SECTION_ORDER = ['about', 'journey', 'experience', 'skills']
const PROJECT_ORDER = ['jarvis', 'unity', 'gharKa', 'order-processing', 'scale-quest', 'mongo-mastery', 'tapasya', 'todo-app', 'cube']

function Section({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mx-auto w-full max-w-3xl px-5 py-10">
      <div className="glass-panel rounded-xl p-6 sm:p-8">{children}</div>
    </section>
  )
}

export function LinearLayout() {
  const openTerminal = useUI((s) => s.openTerminal)

  return (
    <div className="relative z-10 min-h-screen">
      {/* sticky nav */}
      <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-void/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3">
          <a href="#top" className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-aurora text-[0.72rem] font-bold text-void">V</span>
            <span className="font-display text-sm text-ink">Vishnu · OS</span>
          </a>
          <nav className="flex items-center gap-3 font-mono text-[0.68rem] tracking-wide text-ink-secondary">
            <a href="#about" className="hover:text-ink">about</a>
            <a href="#projects" className="hover:text-ink">work</a>
            <a href="#contact" className="hover:text-ink">contact</a>
            <button onClick={openTerminal} className="hover:text-aurora-cyan" aria-label="Open terminal">{'>_'}</button>
          </nav>
        </div>
      </header>

      {/* hero */}
      <section id="top" className="mx-auto w-full max-w-3xl px-5 pb-6 pt-16 text-center">
        <p className="font-mono text-[0.66rem] uppercase tracking-[0.28em] text-ink-secondary">{hero.eyebrow}</p>
        <h1 className="mt-5 whitespace-pre-line font-display text-aurora" style={{ fontSize: 'clamp(2.4rem,11vw,3.6rem)', lineHeight: 1.04, fontWeight: 700, letterSpacing: '-0.03em' }}>
          {hero.name}
        </h1>
        <p className="mx-auto mt-5 max-w-md font-display text-ink" style={{ fontSize: '1.25rem', lineHeight: 1.3, fontWeight: 500 }}>
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

      {SECTION_ORDER.map((id) => {
        const node = nodeById(id)
        return node ? (
          <Section key={id} id={id}>
            <PanelBody node={node} />
          </Section>
        ) : null
      })}

      {/* projects */}
      <div id="projects">
        <h2 className="mx-auto max-w-3xl px-5 pt-8 font-mono text-[0.7rem] uppercase tracking-[0.24em] text-ink-muted">
          // things I built
        </h2>
        {PROJECT_ORDER.map((id) => {
          const node = nodeById(id)
          return node ? (
            <Section key={id} id={id}>
              <PanelBody node={node} />
            </Section>
          ) : null
        })}
      </div>

      {/* contact */}
      <Section id="contact">
        <PanelBody node={nodeById('contact')!} />
      </Section>

      <footer className="mx-auto max-w-3xl px-5 py-10 text-center font-mono text-[0.66rem] tracking-wide text-ink-muted">
        Built by Varada Sai Datta Vishnu · {contact.location} · crafted as a Spatial OS
      </footer>
    </div>
  )
}
