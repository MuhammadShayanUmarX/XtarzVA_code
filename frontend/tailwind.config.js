/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ─── Core Brand Palette ───────────────────────────────────────────
        brand: {
          950: '#03050f',   // deepest bg
          900: '#080d1e',   // main bg
          800: '#0e1528',   // card bg
          700: '#1a2236',   // elevated surface
          600: '#2a3349',   // border / dividers
          500: '#3d4f6a',   // subtle text
          400: '#8aa0c0',   // muted text
          200: '#c8d6ea',   // secondary text
          50:  '#eef3fb',   // primary text
        },
        // ─── Accent Colors ─────────────────────────────────────────────────
        accent: {
          primary:  '#4f6ef7',  // electric indigo/blue – CTAs
          glow:     '#7c94fa',  // lighter glow variant
          cyan:     '#22d3ee',  // data / metrics
          emerald:  '#10b981',  // success / approved
          violet:   '#a78bfa',  // creative / agents
          rose:     '#fb7185',  // danger / problems
          amber:    '#fbbf24',  // warning / profit
          fuchsia:  '#e879f9',  // special highlight
        },
        // ─── Semantic Aliases ─────────────────────────────────────────────
        surface: {
          0: '#03050f',
          1: '#080d1e',
          2: '#0e1528',
          3: '#1a2236',
        },
        // ─── Landing Page Redesign Palette (Premium Obsidian Cobalt & Wasabi) ─
        landing: {
          bg: '#0B0D13',
          surface: '#151822',
          elevated: '#1E2230',
          divider: '#2A2E3D',
          primary: '#F8FAFC',
          secondary: '#A2A8C2',
          muted: '#64748B',
          accent: '#3E63DD',
          accentSoft: '#8DA4EF',
          accentLime: '#D2F13C',
        },
      },
      backgroundImage: {
        'gradient-hero':    'radial-gradient(ellipse 100% 80% at 50% -5%, rgba(79,110,247,0.22) 0%, rgba(167,139,250,0.08) 40%, transparent 70%)',
        'gradient-card':    'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 100%)',
        'gradient-cta':     'linear-gradient(135deg, #4f6ef7 0%, #a78bfa 100%)',
        'gradient-mesh':    'radial-gradient(at 40% 20%, #4f6ef720 0px, transparent 50%), radial-gradient(at 80% 0%, #22d3ee18 0px, transparent 50%), radial-gradient(at 0% 50%, #a78bfa15 0px, transparent 50%)',
        'gradient-swarm':   'linear-gradient(180deg, rgba(79,110,247,0.05) 0%, transparent 100%)',
        'noise':            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Geist Mono', 'monospace'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-2xl': ['4.5rem',  { lineHeight: '1.05', letterSpacing: '-0.04em', fontWeight: '700' }],
        'display-xl':  ['3.75rem', { lineHeight: '1.05', letterSpacing: '-0.04em', fontWeight: '700' }],
        'display-lg':  ['3rem',    { lineHeight: '1.1',  letterSpacing: '-0.03em', fontWeight: '700' }],
        'display-md':  ['2.25rem', { lineHeight: '1.15', letterSpacing: '-0.025em', fontWeight: '700' }],
      },
      letterSpacing: {
        tightest: '-0.04em',
        tighter:  '-0.03em',
        tight:    '-0.02em',
        heading:  '-0.01em',
        normal:   '0em',
        wide:     '0.05em',
        widest:   '0.2em',
      },
      borderRadius: {
        sm:  '6px',
        md:  '10px',
        lg:  '14px',
        xl:  '20px',
        '2xl': '24px',
        '3xl': '32px',
      },
      boxShadow: {
        sm:      '0 1px 2px rgba(0,0,0,0.5)',
        md:      '0 4px 16px rgba(0,0,0,0.6)',
        lg:      '0 8px 32px rgba(0,0,0,0.7)',
        card:    '0 0 0 1px rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.4)',
        glow:    '0 0 0 1px rgba(79,110,247,0.4), 0 0 24px rgba(79,110,247,0.2)',
        'glow-cyan':   '0 0 0 1px rgba(34,211,238,0.3), 0 0 20px rgba(34,211,238,0.15)',
        'glow-violet': '0 0 0 1px rgba(167,139,250,0.3), 0 0 20px rgba(167,139,250,0.15)',
        'glow-emerald':'0 0 0 1px rgba(16,185,129,0.3), 0 0 20px rgba(16,185,129,0.15)',
        inner:   'inset 0 2px 8px rgba(0,0,0,0.4)',
      },
      animation: {
        'fade-in':       'fade-in 0.4s ease-out both',
        'slide-up':      'slide-up 0.5s ease-out both',
        'scale-in':      'scale-in 0.3s ease-out both',
        'pulse-glow':    'pulse-glow 2s ease-in-out infinite',
        'shimmer':       'shimmer 2.5s infinite linear',
        'spin-slow':     'spin 8s linear infinite',
        'float':         'float 6s ease-in-out infinite',
        'orbit':         'orbit 12s linear infinite',
        'scan-line':     'scan-line 3s linear infinite',
        'data-flow':     'data-flow 2s linear infinite',
        'border-spin':   'border-spin 4s linear infinite',
        'typing':        'typing 1.5s steps(20) infinite',
        'pulse-slow':    'pulse-slow 8s ease-in-out infinite',
        'twinkle':       'twinkle 3s ease-in-out infinite',
      },
      keyframes: {
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%':   { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%':      { opacity: '1',   transform: 'scale(1.05)' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        'orbit': {
          '0%':   { transform: 'rotate(0deg) translateX(80px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(80px) rotate(-360deg)' },
        },
        'scan-line': {
          '0%':   { left: '-2px' },
          '100%': { left: '102%' },
        },
        'data-flow': {
          '0%':   { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: '0' },
        },
        'border-spin': {
          '0%':   { '--angle': '0deg' },
          '100%': { '--angle': '360deg' },
        },
        'typing': {
          '0%':   { width: '0ch' },
          '50%':  { width: '20ch' },
          '100%': { width: '0ch' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1) translate(-50%, -50%)' },
          '50%':      { opacity: '0.8', transform: 'scale(1.1) translate(-50%, -50%)' },
        },
        'twinkle': {
          '0%, 100%': { opacity: '0.2', transform: 'scale(0.8)' },
          '50%':      { opacity: '1', transform: 'scale(1.2)' },
        },
      },
    },
  },
  plugins: [],
}
