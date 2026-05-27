/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      screens: {
        xs: '380px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Sora"', 'Inter', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        // Kroje per-prelegent (różna typografia dla każdego)
        grotesk: ['"Space Grotesk"', 'sans-serif'],
        dmserif: ['"DM Serif Display"', 'Georgia', 'serif'],
        playfair: ['"Playfair Display"', 'Georgia', 'serif'],
        spacemono: ['"Space Mono"', 'monospace'],
      },
      colors: {
        border: 'hsl(220 20% 16%)',
        background: 'hsl(222 38% 5%)',
        foreground: 'hsl(210 40% 98%)',
        card: 'hsl(222 38% 6%)',
        'card-foreground': 'hsl(210 40% 98%)',
        gold: {
          DEFAULT: '#C9A14A',
          light: '#E6C77E',
          deep: '#9E7B33',
        },
        platinum: {
          DEFAULT: '#9FB8C8',
          light: '#E3ECF2',
        },
      },
      keyframes: {
        spotlight: {
          '0%': { opacity: '0', transform: 'translate(-72%, -62%) scale(0.5)' },
          '100%': { opacity: '1', transform: 'translate(-50%, -40%) scale(1)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
      animation: {
        spotlight: 'spotlight 2s ease 0.3s 1 forwards',
        'fade-up': 'fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
        shimmer: 'shimmer 6s linear infinite',
      },
    },
  },
  plugins: [],
}
