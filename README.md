# Vishnu · OS — Spatial Portfolio

An interactive, spatial-computing portfolio for **Varada Sai Datta Vishnu** — a boundless,
draggable + zoomable cosmos where every project floats as a luminous artifact you fly into.

**Live:** https://varadasaidattavishnu.github.io/website/

## What makes it tick

- **Live WebGL cosmos** — a custom GLSL aurora/nebula shader (domain-warped fbm) + drifting
  starfield + bloom, all reacting to the cursor (`src/shaders`, `src/three`).
- **Infinite-canvas navigation** — an imperative pan / zoom / inertia / fly-to engine that
  transforms a "world" layer so the project cards never re-render mid-drag (`src/hooks/useSpatialViewport.ts`).
- **⌘K command palette**, a **JARVIS-homage terminal**, a **guided tour**, a **minimap**, and a
  focus-following breadcrumb.
- **Case-study panels** for 9 projects + CUBE work, with shareable deep-links (`/#jarvis`).
- **Full accessibility fallback** — touch / small-screen / `prefers-reduced-motion` visitors get a
  clean, linear, keyboard-friendly layout instead of the canvas.

## Power-user URLs

| URL | Effect |
|-----|--------|
| `/#jarvis` | deep-link straight into a project |
| `?spatial=1` | force the immersive canvas (e.g. on touch laptops) |
| `?noboot=1` | skip the boot intro |

## Stack

React 18 · TypeScript · Vite · Tailwind CSS · Framer Motion · Zustand · Three.js / React Three Fiber · GSAP

## Develop

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build → dist/
npm run preview   # serve the build locally
```

Pushing to `main` triggers a GitHub Actions workflow that builds and publishes `dist/` to GitHub Pages.

---

*Designed and built as a one-of-a-kind memento — no compromise.*
