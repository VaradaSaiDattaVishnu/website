// ─────────────────────────────────────────────────────────────────────────────
// content.ts — the single source of truth for everything the Spatial OS renders.
// Copy is first-person, calibrated, and factual. Coordinates are in "world" px.
// ─────────────────────────────────────────────────────────────────────────────

export type NodeKind = 'hero' | 'section' | 'project' | 'work'

export interface SpatialNode {
  id: string
  label: string
  kind: NodeKind
  /** world-space position in px (origin 0,0 = hero) */
  x: number
  y: number
  /** visual size multiplier for the card */
  sizeScale: number
  /** viewport scale used when this node is focused */
  flyToScale: number
  /** accent / glow color */
  color: string
  /** tiny mono label shown under the title */
  tag?: string
}

export interface ProjectContent {
  id: string
  name: string
  titleTag: string
  hook: string
  blurb: string
  stack: string[]
  live?: string
  github?: string
  isPrivate?: boolean
  year?: string
}

// ── HERO ─────────────────────────────────────────────────────────────────────
export const hero = {
  eyebrow: 'Frontend-focused Software Engineer · Gurgaon, India',
  name: 'Varada Sai\nDatta Vishnu',
  headline: 'I build high-performance interfaces for complex systems.',
  sub: 'Frontend precision. Full-stack range. AI that actually does things.',
  chips: [
    '1.5 yrs @ CUBE',
    '5,000+ daily users',
    '3s → 800ms',
    '9 shipped products',
  ],
  taglines: [
    "I don't ship features — I ship systems that hold.",
    'Frontend-first, full-stack by necessity, AI-obsessed by choice.',
    'Civil engineer turned software architect. The load calculations got easier.',
  ],
}

// ── ABOUT ────────────────────────────────────────────────────────────────────
export const about = {
  label: '// about',
  tag: 'BITS Pilani grad · Civil-engineer-turned-SDE · builds things that scale and things that matter',
  paragraphs: [
    "I'm a frontend-focused software engineer at CUBE in Gurgaon, building high-performance, design-forward products used by thousands of people every day.",
    'I graduated from BITS Pilani with a Civil Engineering degree and walked straight into software — not by accident, but by conviction. I specialize in React ecosystems, state architecture, AI-augmented interfaces, and the kind of performance work that shows up in real metrics.',
    'I also build my own products, because waiting for permission is slow.',
  ],
}

// ── JOURNEY (Civil → Software) ────────────────────────────────────────────────
export const journey = {
  label: '// how I got here',
  title: 'Civil → Software',
  body: "Civil Engineering at BITS Pilani taught me to think in systems — load paths, failure modes, constraints that don't forgive. When I pivoted to software, I brought that same precision: not just \"does it work,\" but \"where does it break, and at what scale.\" The transition wasn't a detour. It was the foundation.",
  milestones: [
    { year: '2020', text: 'Started B.E. Civil Engineering at BITS Pilani' },
    { year: '2024', text: 'Graduated — and went straight into software engineering' },
    { year: '2024', text: 'Joined CUBE as a Software Development Engineer' },
    { year: 'now', text: 'Shipping production systems + a shelf of personal products' },
  ],
}

// ── EXPERIENCE (CUBE) ─────────────────────────────────────────────────────────
export const experience = {
  label: '// where I have shipped',
  company: 'CUBE',
  role: 'Software Development Engineer',
  location: 'Gurgaon, India',
  period: 'Jun 2024 — Present',
  metrics: [
    { value: '−90%', label: 'redundant network calls', detail: 'client-side Redux caching layer for profile, permissions & assets' },
    { value: '3s → 800ms', label: 'initial load time', detail: 'Service Workers caching static assets for near-instant repeat visits' },
    { value: '2.5×', label: 'interaction speed', detail: 'Redux Toolkit state architecture serving 5,000+ daily active users' },
    { value: '100k+', label: 'rows, zero lag', detail: 'custom virtualized data grid; tree filtering from O(n²) to O(n)' },
    { value: '400+', label: 'Jira tickets in 15 mo', detail: 'features, fixes & technical debt — top contributor of eight engineers' },
    { value: '150+', label: 'Storybook stories', detail: 'migrated 30+ components into a custom Material UI library' },
  ],
  builds: [
    'Built a React-PDF viewer handling vector-heavy files at 5× zoom.',
    'Shipped an auth & onboarding system across 30+ screens with Zoho CRM sync and Razorpay billing.',
    'Architected a real-time WebSocket issue-management platform for 1,000+ concurrent users.',
    'Mentored two junior engineers through pairing and code review — halving onboarding time.',
  ],
}

// ── SKILLS ────────────────────────────────────────────────────────────────────
export const skills = {
  label: '// what I work with',
  groups: [
    { group: 'Languages', items: ['TypeScript', 'JavaScript', 'Python'] },
    { group: 'Frontend', items: ['React', 'Next.js', 'Redux Toolkit', 'Zustand', 'Framer Motion', 'Three.js', 'Tailwind', 'MUI', 'Storybook'] },
    { group: 'Backend', items: ['Node.js', 'Express', 'FastAPI', 'WebSocket', 'RabbitMQ', 'REST'] },
    { group: 'Data', items: ['MongoDB', 'PostgreSQL', 'SQLite', 'Prisma', 'Redis'] },
    { group: 'AI / ML', items: ['Claude API', 'Groq', 'Gemini', 'RAG', 'MiniLM Embeddings', 'Isolation Forest'] },
    { group: 'Infra & Tooling', items: ['Docker', 'Service Workers', 'Turborepo', 'Vite', 'Git', 'CI/CD', 'Jest'] },
  ],
}

// ── PROJECTS ──────────────────────────────────────────────────────────────────
export const projects: ProjectContent[] = [
  {
    id: 'jarvis',
    name: 'JARVIS',
    titleTag: 'Voice-First Agentic AI Assistant',
    hook: 'A personal AI that listens, remembers, reasons across 20 real tools, and briefs you every morning before you ask.',
    blurb:
      'JARVIS uses real-time voice I/O with Edge-TTS streaming and a proactive intelligence engine that anticipates your day — not just responds to it. The memory layer runs local MiniLM embeddings with vector search, so it retrieves from your own documents with citations, fully offline if needed. Free on Groq by default, auto-upgrades to Claude when the task demands it — Dockerized and self-hostable.',
    stack: ['React', 'Zustand', 'Node/Express', 'WebSocket', 'SQLite', 'Edge TTS', 'Groq / Claude', 'MiniLM'],
    github: 'https://github.com/VaradaSaiDattaVishnu/jarvis',
    year: '2026',
  },
  {
    id: 'unity',
    name: 'Unity',
    titleTag: 'Spiritual-Community Super-App',
    hook: 'A 15-module MERN super-app with its own ML pipeline — built for a real community, not a demo.',
    blurb:
      'Unity runs 38 MongoDB models and full RBAC across 15 distinct modules (Meditation, Habit, Sankirtan, Donations, Photos and more), plus its own attention-model ML pipeline with MFCC/FFT audio analysis for chanting-profile personalization. It embeds JARVIS and a PDF-Studio as first-class modules, all inside a Turborepo monorepo with pnpm workspaces — the kind of architecture most teams don’t reach until year three.',
    stack: ['MongoDB', 'Express', 'React', 'Node.js', 'Turborepo', 'pnpm', 'scikit-learn', 'RBAC'],
    isPrivate: true,
    year: '2026',
  },
  {
    id: 'gharKa',
    name: 'gharKa',
    titleTag: 'Hyperlocal Homemade-Food Marketplace',
    hook: 'A geo-fenced marketplace for gated communities — built with Three.js cinematics and its own brand guide.',
    blurb:
      'gharKa (Hindi: “from home”) connects home cooks with neighbors inside a 5km radius — phone-OTP auth, real-time chat, offline payments, and a Three.js “grand UI” that makes a food app feel like a product launch. It ships with full UX research and a custom brand identity. One coherent monorepo spans API, mobile, and web, with Prisma as the data layer.',
    stack: ['React', 'React Native', 'Node.js', 'Prisma', 'Three.js', 'Monorepo', 'Phone-OTP', 'WebSocket'],
    github: 'https://github.com/VaradaSaiDattaVishnu/gharKa',
    year: '2026',
  },
  {
    id: 'order-processing',
    name: 'Order Processing System',
    titleTag: 'Event-Driven Microservices · Real ML',
    hook: 'Nine microservices, a saga orchestrator, and an unsupervised anomaly detector that explains its own decisions.',
    blurb:
      'Every order is scored 0–1 by an Isolation Forest model (scikit-learn via FastAPI) — calibrated, self-retraining, and explainable through feature ablation: it tells you why an order is flagged (“amount is 24σ above this user’s normal”). The async saga handles inventory → payment → notification over RabbitMQ with Redis caching. Not a toy pipeline — a production-grade reference architecture.',
    stack: ['Next.js 14', 'Express', 'MongoDB', 'Redis', 'RabbitMQ', 'FastAPI', 'scikit-learn', 'Docker'],
    github: 'https://github.com/VaradaSaiDattaVishnu/Order-Processing-System',
    year: '2026',
  },
  {
    id: 'scale-quest',
    name: 'Scale Quest',
    titleTag: 'Interactive System-Design Game',
    hook: 'Sixty hands-on levels that teach system design the way it should be taught — by doing it, not reading about it.',
    blurb:
      'Scale Quest is a game-like course covering load balancers, caching, sharding, message queues, and global-scale architecture — each concept earned through an interactive challenge, not a passive slide. Framer Motion drives the transitions that make it feel alive. Fully client-side, it lives on GitHub Pages with progress saved in the browser.',
    stack: ['React 18', 'Vite', 'Tailwind', 'Framer Motion', 'Zustand'],
    live: 'https://varadasaidattavishnu.github.io/scale-quest/',
    github: 'https://github.com/VaradaSaiDattaVishnu/scale-quest',
    year: '2026',
  },
  {
    id: 'mongo-mastery',
    name: 'Mongo Mastery',
    titleTag: 'In-Browser MongoDB Environment',
    hook: 'A real query engine in your browser, with B-tree and aggregation-pipeline visualizers you can actually interact with.',
    blurb:
      'Mongo Mastery packs 2 courses and 178 lessons into a Monaco-powered environment where learners run real MongoDB queries against an in-browser engine — no backend, no setup. The aggregation-pipeline visualizer breaks down every stage in real time; the B-tree index visualizer shows you why a query is fast or slow. The course I wished existed when I was learning.',
    stack: ['React', 'Monaco Editor', 'In-browser query engine', 'Vite', 'Tailwind'],
    live: 'https://varadasaidattavishnu.github.io/mongo-mastery/',
    github: 'https://github.com/VaradaSaiDattaVishnu/mongo-mastery',
    year: '2026',
  },
  {
    id: 'tapasya',
    name: 'Tapasya',
    titleTag: 'Trauma-Informed Learning App',
    hook: 'A learning app that deliberately slows you down when you go too fast — because recovery isn’t a streak.',
    blurb:
      'Tapasya covers Memory, Observation, Reading People, and a Second Brain in a self-paced, trauma-informed track. The defining decision: no streaks, no badges, no gamification. Fast progress is a signal to pause, not a trigger for a congratulations notification. A product built from first principles about what “progress” actually means — and it shows in every UX decision.',
    stack: ['React', 'Vite', 'Tailwind', 'Framer Motion', 'Zustand'],
    live: 'https://varadasaidattavishnu.github.io/tapasya/',
    github: 'https://github.com/VaradaSaiDattaVishnu/tapasya',
    year: '2026',
  },
  {
    id: 'todo-app',
    name: 'ToDoApp',
    titleTag: 'Local-First NLP Task Manager',
    hook: 'Type “pay rent friday 5pm !!high” and get a fully parsed, scheduled task with a desktop reminder — no forms.',
    blurb:
      'The NLP smart-add layer parses natural-language input into structured data — date, time, priority, title — locally, with no API call. “Plan my day” synthesizes the task list into a prioritized brief. Optional Gemini AI layers on top when you want it. Built on Redux Toolkit for predictable state and MUI for UI discipline, it works fully offline.',
    stack: ['React', 'Redux Toolkit', 'Tailwind', 'MUI', 'Gemini (optional)', 'Web Notifications'],
    github: 'https://github.com/VaradaSaiDattaVishnu/ToDoApp',
    year: '2025',
  },
]

// ── CUBE WORK as a featured "work" artifact ───────────────────────────────────
export const cubeWork: ProjectContent = {
  id: 'cube',
  name: 'CUBE · Production at Scale',
  titleTag: 'Production at Scale, Measured',
  hook: 'Fifteen months, 400+ tickets, and performance wins that show up in user experience — not just dashboards.',
  blurb:
    'A client-side Redux caching layer cut redundant network calls by 90%; Service Workers compressed load time from 3s to 800ms; a virtualized grid renders 100,000+ rows in constant time (tree filtering from O(n²) to O(n)). My Redux Toolkit state architecture now delivers 2.5× interaction speed for 5,000+ daily users. I also built the auth/onboarding flow across 30+ screens (Zoho + Razorpay), a real-time WebSocket platform for 1,000+ concurrent users, migrated 30+ components to a custom MUI library, and wrote 150+ Storybook stories.',
  stack: ['React', 'Redux Toolkit', 'Service Workers', 'MUI', 'Storybook', 'WebSocket', 'Zoho', 'Razorpay'],
  year: '2024 — now',
}

// ── CONTACT ──────────────────────────────────────────────────────────────────
export const contact = {
  label: '// let’s talk',
  ctaLines: [
    "I’m not looking to “explore opportunities.” I’m looking for the right one.",
    'If you’re building something hard and you need someone who ships — here’s where I am.',
  ],
  email: 'sdvvarada@gmail.com',
  phone: '+91-6302028689',
  github: 'https://github.com/VaradaSaiDattaVishnu',
  githubLabel: 'github.com/VaradaSaiDattaVishnu',
  location: 'Gurgaon, India',
}

// ── TERMINAL ──────────────────────────────────────────────────────────────────
export interface TerminalEntry {
  cmd: string
  lines: string[]
}

export const terminalBanner = [
  'VISHNU-OS [Version 1.0.0]  ·  (c) 2026 Varada Sai Datta Vishnu',
  "Type 'help' for a list of commands.  Type 'clear' to reset.",
]

export const terminalCommands: Record<string, string[]> = {
  whoami: [
    'Varada Sai Datta Vishnu. Frontend engineer. Full-stack when needed.',
    'AI-curious always. BITS Pilani, Civil → Software. Based in Gurgaon.',
  ],
  'ls projects': [
    'jarvis/   unity/   gharKa/   order-processing-system/',
    'scale-quest/   mongo-mastery/   tapasya/   todo-app/',
    '[8 directories, 0 excuses]',
  ],
  'cat resume': [
    '1.5 yrs @ CUBE — 400+ tickets shipped, 5,000+ daily users.',
    '−90% network calls. 3s → 800ms load. O(n²) → O(n) tree filter.',
    'Full resume on request: sdvvarada@gmail.com',
  ],
  skills: [
    'Languages : JavaScript, TypeScript, Python',
    'Frontend  : React, Redux Toolkit, Zustand, Framer Motion, Three.js',
    'Backend   : Node.js, Express, FastAPI, WebSocket, RabbitMQ',
    'Data      : MongoDB, PostgreSQL, SQLite, Prisma, Redis',
    'AI/ML     : Groq, Claude, Gemini, MiniLM, Isolation Forest',
    'Infra     : Docker, Service Workers, Turborepo, Vite',
  ],
  'open jarvis': [
    'Initializing voice pipeline... [DONE]',
    'Loading memory layer... [DONE]',
    '20 tools registered. Morning briefing queued.',
    'Say something.',
  ],
  'sudo hire-me': [
    '[sudo] password for recruiter: ••••••••',
    'Access granted. Calendar link incoming.',
    'Warning: may permanently improve your team’s shipping velocity.',
  ],
  contact: [
    'Email    : sdvvarada@gmail.com',
    'Phone    : +91-6302028689',
    'GitHub   : github.com/VaradaSaiDattaVishnu',
    'Location : Gurgaon, India',
  ],
  github: [
    'Fetching repos... 9 projects found.',
    'Commits: relentless.  → github.com/VaradaSaiDattaVishnu',
  ],
  coffee: [
    'Error: fuel already loaded.',
    'Current caffeine status: [██████████] 100%',
    'This is how the grid gets virtualized at 100k rows.',
  ],
  help: [
    'Available commands:',
    '  whoami        ls projects     cat resume      skills',
    '  open jarvis   sudo hire-me    contact         github',
    '  coffee        clear           tour            help',
    "Pro tip: try 'sudo make me a sandwich'.",
  ],
  'sudo make me a sandwich': [
    '[sudo] password: ••••',
    'Error: I build products, not sandwiches.',
    'Although... give me a WebSocket and a Raspberry Pi and we talk.',
  ],
}

// ── GUIDED TOUR ───────────────────────────────────────────────────────────────
export interface TourStop {
  nodeId: string
  caption: string
}

export const tourStops: TourStop[] = [
  { nodeId: 'hero', caption: "You’ve landed. This is the cosmos — each node is something I built or shipped. Drag to drift, scroll to zoom." },
  { nodeId: 'jarvis', caption: 'JARVIS — a voice-first AI that listens, remembers, and acts across 20 real tools. The flagship.' },
  { nodeId: 'cube', caption: 'CUBE — production work, measured. Where 3-second loads became 800ms and grids hold 100k rows.' },
  { nodeId: 'order-processing', caption: 'These aren’t side projects. Nine microservices, real ML, explaining their own anomaly scores.' },
  { nodeId: 'contact', caption: 'If something impressed you — or if it didn’t — either way, reach out. I want to know.' },
]

// ── SPATIAL NODE MAP ──────────────────────────────────────────────────────────
// origin (0,0) = hero. Arranged as a deliberate constellation, not a grid.
export const nodes: SpatialNode[] = [
  { id: 'hero', label: 'Varada Sai Datta Vishnu', kind: 'hero', x: 0, y: 0, sizeScale: 1.6, flyToScale: 0.85, color: '#a78bfa' },

  // personal constellation
  { id: 'about', label: 'About', kind: 'section', x: -1180, y: -560, sizeScale: 1.0, flyToScale: 1.15, color: '#6ee7f9', tag: 'who' },
  { id: 'journey', label: 'Journey', kind: 'section', x: 560, y: -1180, sizeScale: 1.0, flyToScale: 1.15, color: '#f472b6', tag: 'civil → software' },
  { id: 'experience', label: 'Experience', kind: 'section', x: -1480, y: 380, sizeScale: 1.1, flyToScale: 1.05, color: '#34d399', tag: 'CUBE' },
  { id: 'skills', label: 'Skills', kind: 'section', x: -820, y: 1080, sizeScale: 1.0, flyToScale: 1.1, color: '#fbbf24', tag: 'stack' },
  { id: 'contact', label: 'Contact', kind: 'section', x: 1080, y: 1040, sizeScale: 1.0, flyToScale: 1.25, color: '#fb923c', tag: 'reach out' },

  // flagship + work
  { id: 'jarvis', label: 'JARVIS', kind: 'project', x: -640, y: -1640, sizeScale: 1.3, flyToScale: 1.05, color: '#818cf8', tag: 'AI · voice · agentic' },
  { id: 'cube', label: 'CUBE · Work', kind: 'work', x: 1480, y: -940, sizeScale: 1.2, flyToScale: 1.0, color: '#6ee7f9', tag: 'production' },

  // backend / fullstack cluster (right)
  { id: 'order-processing', label: 'Order Processing', kind: 'project', x: 1720, y: 240, sizeScale: 1.05, flyToScale: 1.05, color: '#60a5fa', tag: 'microservices · ML' },
  { id: 'mongo-mastery', label: 'Mongo Mastery', kind: 'project', x: 2080, y: 760, sizeScale: 0.95, flyToScale: 1.1, color: '#34d399', tag: 'live · interactive' },
  { id: 'gharKa', label: 'gharKa', kind: 'project', x: 1520, y: 1320, sizeScale: 1.0, flyToScale: 1.05, color: '#f472b6', tag: 'marketplace · 3D' },

  // learning / 3D cluster (left)
  { id: 'unity', label: 'Unity', kind: 'project', x: -1640, y: 1240, sizeScale: 1.05, flyToScale: 1.05, color: '#e879f9', tag: '15 modules · ML' },
  { id: 'scale-quest', label: 'Scale Quest', kind: 'project', x: -2040, y: 720, sizeScale: 0.95, flyToScale: 1.1, color: '#c084fc', tag: 'live · 60 levels' },

  // lower scatter
  { id: 'tapasya', label: 'Tapasya', kind: 'project', x: 220, y: 1640, sizeScale: 0.95, flyToScale: 1.1, color: '#5eead4', tag: 'live · anti-gamified' },
  { id: 'todo-app', label: 'ToDoApp', kind: 'project', x: -320, y: 2080, sizeScale: 0.9, flyToScale: 1.15, color: '#94a3b8', tag: 'local-first · NLP' },
]

// world bounds (with padding) for the minimap
export const WORLD_BOUNDS = { xMin: -2200, xMax: 2300, yMin: -1800, yMax: 2300 }

// quick lookup helpers
export const nodeById = (id: string) => nodes.find((n) => n.id === id)
export const projectById = (id: string): ProjectContent | undefined =>
  id === 'cube' ? cubeWork : projects.find((p) => p.id === id)
