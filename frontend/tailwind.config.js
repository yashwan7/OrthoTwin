/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Hanken Grotesk"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        bone: {
          50: '#FAF9F5',
          100: '#F6F3EE',
          200: '#EFE9DF',
          300: '#ECE6DB',
          400: '#E2D9CB',
          500: '#D8CDBB',
          600: '#CDBFA9',
          700: '#6B635A',
          800: '#5A534A',
          900: '#2B2723',
        },
        vermilion: {
          50: '#FDF2EE',
          100: '#F6D8CF',
          200: '#F2CDC1',
          300: '#E59A85',
          500: '#B83C25',
          600: '#9E321E',
          700: '#8E2C18',
          900: '#5C1C0E',
        },
        sage: {
          50: '#F2F7F0',
          100: '#E3E9DD',
          200: '#DCE7D6',
          500: '#3F6B4A',
          700: '#2B5236',
          900: '#1D3B25',
        },
        ochre: {
          50: '#FEF9EE',
          100: '#FBF1DA',
          200: '#F5E5C2',
          500: '#C98A1B',
          700: '#6F4600',
        },
        medical: {
          bg: '#F6F3EE',
          surface: '#FFFFFF',
          card: '#FAF9F5',
          border: '#E2D9CB',
          active: '#B83C25',
          accent: '#B83C25',
          text: '#2B2723',
          muted: '#5A534A',
        }
      }
    },
  },
  plugins: [],
}
