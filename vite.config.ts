import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base is set to './' so the build works on GitHub Pages project sites,
// custom domains, and any static host without rewrites.
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          r3f: ['@react-three/fiber', '@react-three/drei', '@react-three/postprocessing', 'postprocessing'],
          motion: ['framer-motion', 'gsap'],
        },
      },
    },
  },
})
