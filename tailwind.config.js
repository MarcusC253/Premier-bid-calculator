/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Geist"', '"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        ink: {
          DEFAULT: '#0A1628',
          soft: '#162236',
        },
        navy: {
          50: '#F1F4F9',
          100: '#DDE5EE',
          200: '#B6C5D8',
          300: '#7E97B8',
          400: '#506C90',
          500: '#324A6E',
          600: '#1F3556',
          700: '#162741',
          800: '#0F1B30',
          900: '#0A1628',
        },
        accent: {
          DEFAULT: '#C8A671',
          dark: '#A48452',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(10,22,40,0.04), 0 8px 24px rgba(10,22,40,0.06)',
        'card-lg': '0 2px 4px rgba(10,22,40,0.04), 0 24px 48px rgba(10,22,40,0.08)',
      },
    },
  },
  plugins: [],
}
