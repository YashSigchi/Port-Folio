import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Literal hex values (mirroring the :root vars in globals.css) so opacity
      // modifiers like `bg-surface/90` or `border-indigo/25` are generated —
      // Tailwind can't apply `/NN` alpha to plain `var(--x)` colors.
      colors: {
        void: '#05060f',
        deep: '#0a0b1e',
        surface: '#11132b',
        glass: 'var(--bg-glass)',
        'border-subtle': 'var(--border-subtle)',
        'border-glow': 'var(--border-glow)',
        primary: '#f4f5ff',
        secondary: '#a9adcb',
        muted: '#6b7094',
        indigo: '#818cf8',
        violet: '#8b5cf6',
        magenta: '#d946ef',
        cyan: '#22d3ee',
        amber: '#fbbf24',
        lavender: '#c4b5fd',
        success: '#22c55e',
        danger: '#f43f5e',
      },
      fontFamily: {
        heading: ['var(--font-space-grotesk)', 'sans-serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
        hand: ['var(--font-caveat)', 'cursive'],
      },
      borderRadius: {
        card: '12px',
        panel: '20px',
        pill: '999px',
      },
      maxWidth: {
        container: '1280px',
      },
      transitionTimingFunction: {
        cosmic: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      backgroundImage: {
        nebula:
          'radial-gradient(60% 50% at 70% 20%, rgba(139,92,246,0.45), transparent 60%), radial-gradient(50% 40% at 20% 80%, rgba(34,211,238,0.25), transparent 60%), radial-gradient(40% 40% at 90% 90%, rgba(217,70,239,0.3), transparent 60%)',
        'btn-gradient': 'linear-gradient(135deg, #6366F1, #8B5CF6 50%, #D946EF)',
        'text-gradient': 'linear-gradient(90deg, #818CF8, #D946EF 60%, #22D3EE)',
      },
      boxShadow: {
        'btn-glow': '0 0 40px rgba(139,92,246,0.45)',
      },
    },
  },
  plugins: [],
};

export default config;
