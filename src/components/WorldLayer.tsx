import { memo, useState } from 'react'
import { nodes, hero, type SpatialNode } from '../data/content'

function hexA(hex: string, a: number) {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

const KIND_WIDTH: Record<SpatialNode['kind'], number> = {
  hero: 720,
  project: 300,
  work: 320,
  section: 240,
}

interface CardProps {
  node: SpatialNode
  onSelect: (node: SpatialNode) => void
  onFocusNode: (node: SpatialNode) => void
}

const ArtifactCard = memo(function ArtifactCard({ node, onSelect, onFocusNode }: CardProps) {
  const [hovered, setHovered] = useState(false)
  const lit = hovered
  const width = KIND_WIDTH[node.kind] * node.sizeScale

  return (
    <button
      data-no-pan
      data-cursor-label="view →"
      aria-label={`${node.label} — ${node.kind}. Open.`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => onFocusNode(node)}
      onClick={() => onSelect(node)}
      className="group absolute block cursor-pointer rounded-lg text-left outline-none transition-transform duration-300 ease-out-quart focus-visible:ring-2 focus-visible:ring-aurora-cyan/70"
      style={{
        left: node.x,
        top: node.y,
        width,
        transform: `translate(-50%, -50%) scale(${lit ? 1.045 : 1})`,
      }}
    >
      <div
        className="relative overflow-hidden rounded-lg border bg-surface/85"
        style={{
          borderColor: lit ? hexA(node.color, 0.5) : 'rgba(255,255,255,0.07)',
          boxShadow: lit
            ? `0 0 0 1px ${hexA(node.color, 0.35)}, 0 0 40px ${hexA(node.color, 0.28)}, 0 24px 60px rgba(0,0,0,0.55)`
            : '0 14px 40px rgba(0,0,0,0.45)',
          transition: 'box-shadow 320ms ease, border-color 320ms ease',
        }}
      >
        {/* aurora wash */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[44%] transition-opacity duration-500"
          style={{
            opacity: lit ? 0.34 : 0.12,
            background: `radial-gradient(120% 140% at 30% 0%, ${hexA(node.color, 0.9)}, transparent 70%)`,
          }}
        />

        <div className="relative p-5">
          <div className="flex items-center justify-between">
            <span
              className="font-mono text-[0.62rem] uppercase tracking-[0.18em]"
              style={{ color: hexA(node.color, lit ? 0.95 : 0.7) }}
            >
              {node.kind === 'project' ? 'project' : node.kind === 'work' ? 'experience' : node.kind}
            </span>
            <span
              className="inline-block h-1.5 w-1.5 rounded-full transition-all duration-300"
              style={{
                background: node.color,
                boxShadow: lit ? `0 0 10px ${node.color}` : 'none',
              }}
            />
          </div>

          <h3
            className="mt-3 font-display leading-tight text-ink"
            style={{ fontSize: node.kind === 'project' || node.kind === 'work' ? '1.45rem' : '1.25rem', fontWeight: 600 }}
          >
            {node.label}
          </h3>

          {node.tag && (
            <p className="mt-2 font-mono text-[0.68rem] tracking-wide text-ink-secondary">{node.tag}</p>
          )}

          <div
            className="mt-4 flex items-center gap-2 font-mono text-[0.66rem] tracking-wide transition-all duration-300"
            style={{ color: hexA(node.color, lit ? 1 : 0.55), transform: lit ? 'translateX(2px)' : 'none' }}
          >
            <span>open</span>
            <span aria-hidden>→</span>
          </div>
        </div>
      </div>
    </button>
  )
})

function HeroCard() {
  return (
    <div
      className="absolute select-none"
      style={{ left: 0, top: 0, width: KIND_WIDTH.hero, transform: 'translate(-50%, -50%)' }}
    >
      <div className="text-center">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.32em] text-ink-secondary">{hero.eyebrow}</p>

        <h1 className="mt-6 whitespace-pre-line font-display text-aurora animate-drift" style={{ fontSize: '4.8rem', lineHeight: 1.0, fontWeight: 700, letterSpacing: '-0.035em' }}>
          {hero.name}
        </h1>

        <p className="mx-auto mt-7 max-w-2xl font-display text-ink" style={{ fontSize: '2.05rem', lineHeight: 1.25, fontWeight: 600 }}>
          {hero.headline}
        </p>
        <p className="mx-auto mt-4 max-w-xl text-ink-secondary" style={{ fontSize: '1.2rem' }}>
          {hero.sub}
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-2.5">
          {hero.chips.map((c) => (
            <span
              key={c}
              className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 font-mono text-[0.68rem] tracking-wide text-ink-secondary"
            >
              {c}
            </span>
          ))}
        </div>

        <p className="mt-9 font-mono text-[0.66rem] tracking-[0.2em] text-ink-muted">
          drag to explore · scroll to zoom · <span className="text-aurora-cyan">⌘K</span> for commands
        </p>
      </div>
    </div>
  )
}

interface WorldLayerProps {
  onSelect: (node: SpatialNode) => void
  onFocusNode: (node: SpatialNode) => void
}

export const WorldLayer = memo(function WorldLayer({ onSelect, onFocusNode }: WorldLayerProps) {
  return (
    <>
      {nodes.map((node) =>
        node.kind === 'hero' ? (
          <HeroCard key={node.id} />
        ) : (
          <ArtifactCard key={node.id} node={node} onSelect={onSelect} onFocusNode={onFocusNode} />
        ),
      )}
    </>
  )
})
