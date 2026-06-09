import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useUI } from '../store'

const BOOT_LINES = ['initializing cosmos...', 'mounting projects...', 'calibrating aurora...', 'ready.']

export function BootSequence() {
  const booted = useUI((s) => s.booted)
  const setBooted = useUI((s) => s.setBooted)

  useEffect(() => {
    const t = setTimeout(() => setBooted(true), 2700)
    const skip = () => setBooted(true)
    window.addEventListener('keydown', skip)
    return () => {
      clearTimeout(t)
      window.removeEventListener('keydown', skip)
    }
  }, [setBooted])

  return (
    <AnimatePresence>
      {!booted && (
        <motion.div
          className="fixed inset-0 z-[400] grid place-items-center bg-void"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => setBooted(true)}
        >
          <div className="text-center">
            <motion.h1
              className="font-display text-aurora"
              style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)', fontWeight: 700, letterSpacing: '-0.04em' }}
              initial={{ opacity: 0, filter: 'blur(14px)', scale: 1.06 }}
              animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            >
              VISHNU · OS
            </motion.h1>

            <div className="mt-6 h-4 overflow-hidden font-mono text-[0.72rem] tracking-[0.2em] text-ink-muted">
              {BOOT_LINES.map((line, i) => (
                <motion.p
                  key={line}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: [0, 1, 1, 0], y: [12, 0, 0, -12] }}
                  transition={{ duration: 0.62, delay: 0.5 + i * 0.5, times: [0, 0.2, 0.8, 1] }}
                  className="absolute left-1/2 -translate-x-1/2"
                >
                  {line}
                </motion.p>
              ))}
            </div>

            <motion.p
              className="mt-10 font-mono text-[0.62rem] tracking-[0.2em] text-ink-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 2 }}
            >
              press any key to enter
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
