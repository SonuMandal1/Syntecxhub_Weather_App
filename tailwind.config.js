/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cream: '#FAF6EC',
        surface: '#FFFDF8',
        gold: '#D4AF6A',
        emerald: { DEFAULT: '#10B981', deep: '#0E7C5A', ink: '#0B6347' },
        teal: { DEFAULT: '#2DD4BF' },
        amber: { alert: '#E8743B' },
        page: 'var(--page)',
        card: 'var(--card)',
        ink: 'var(--ink)',
        body: 'var(--body)',
        temp: 'var(--temp)',
        accent: 'var(--accent-ink)',
        line: 'var(--line)',
        night: { DEFAULT: '#0F1713', surface: '#16211C' },
      },
      fontFamily: {
        serif: ['Fraunces', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: { card: '20px' },
      boxShadow: {
        card: '0 1px 2px rgba(31,42,36,.04), 0 8px 24px -12px rgba(31,42,36,.12)',
        lift: '0 2px 4px rgba(31,42,36,.05), 0 18px 36px -14px rgba(31,42,36,.22)',
        inset: 'inset 0 2px 6px rgba(31,42,36,.08)',
      },
    },
  },
  plugins: [],
};
