/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // background depth layers — the cosmos
        void: '#06070B',
        deep: '#0A0C12',
        surface: '#0F1118',
        elevated: '#161A26',
        // text
        ink: {
          DEFAULT: '#EDEFF7',
          secondary: '#9EA3B8',
          muted: '#4A5068',
        },
        // aurora accent ramp
        aurora: {
          cyan: '#6EE7F9',
          blue: '#818CF8',
          violet: '#A78BFA',
          pink: '#F472B6',
          ember: '#FB923C',
        },
      },
      fontFamily: {
        display: ['"Clash Display"', 'Space Grotesk', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        hero: ['clamp(2.75rem, 9vw, 7rem)', { lineHeight: '1.02', letterSpacing: '-0.04em', fontWeight: '700' }],
        display: ['clamp(2.25rem, 5.5vw, 3.75rem)', { lineHeight: '1.08', letterSpacing: '-0.03em', fontWeight: '600' }],
        h1: ['2.5rem', { lineHeight: '1.15', letterSpacing: '-0.025em', fontWeight: '600' }],
        h2: ['1.75rem', { lineHeight: '1.25', letterSpacing: '-0.015em', fontWeight: '500' }],
        h3: ['1.25rem', { lineHeight: '1.4', letterSpacing: '-0.01em', fontWeight: '500' }],
        body: ['1rem', { lineHeight: '1.7', letterSpacing: '0' }],
        small: ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.005em' }],
        caption: ['0.75rem', { lineHeight: '1.25', letterSpacing: '0.02em' }],
        'mono-ui': ['0.8125rem', { lineHeight: '1.4', letterSpacing: '0.04em' }],
      },
      borderRadius: {
        sm: '6px',
        md: '12px',
        lg: '20px',
        xl: '32px',
      },
      boxShadow: {
        'glow-sm': '0 0 12px rgba(110,231,249,0.25)',
        'glow-cyan': '0 0 24px rgba(110,231,249,0.35), 0 0 80px rgba(110,231,249,0.12)',
        'glow-violet': '0 0 24px rgba(167,139,250,0.35), 0 0 80px rgba(167,139,250,0.12)',
        'glow-pink': '0 0 24px rgba(244,114,182,0.35), 0 0 80px rgba(244,114,182,0.12)',
        'glow-md': '0 0 32px rgba(167,139,250,0.30), 0 0 8px rgba(167,139,250,0.50)',
        'glow-lg': '0 0 64px rgba(110,231,249,0.20), 0 0 24px rgba(110,231,249,0.40)',
        'glow-bloom': '0 0 120px rgba(167,139,250,0.15)',
        glass:
          '0 0 48px rgba(110,231,249,0.08), 0 24px 64px rgba(0,0,0,0.60), inset 0 1px 0 rgba(237,239,247,0.07), inset 1px 0 0 rgba(237,239,247,0.03)',
      },
      backgroundImage: {
        aurora: 'linear-gradient(135deg, #6EE7F9 0%, #818CF8 35%, #A78BFA 65%, #F472B6 100%)',
        'aurora-radial': 'radial-gradient(circle at 50% 0%, rgba(110,231,249,0.18), rgba(167,139,250,0.10) 40%, transparent 70%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
        'in-out-circ': 'cubic-bezier(0.85, 0, 0.15, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        drift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'spin-slow': {
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        drift: 'drift 8s linear infinite',
        float: 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'fade-up': 'fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both',
        blink: 'blink 1.1s step-end infinite',
        shimmer: 'shimmer 3s linear infinite',
        'spin-slow': 'spin-slow 24s linear infinite',
      },
    },
  },
  plugins: [],
}
