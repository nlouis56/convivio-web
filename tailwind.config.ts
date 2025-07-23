import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#37abc8",
          50:  "#f0fbfd",
          100: "#d6f4fb",
          200: "#a8e3f3",
          300: "#79d1ea",
          400: "#4bbfde",
          500: "#37abc8",
          600: "#2b8aa2",
          700: "#216979",
          800: "#154752",
          900: "#0b2429"
        },
        accent: {
          DEFAULT: "#e00028",
          50:  "#ffe6e9",
          100: "#ffcdd1",
          200: "#ff9ba2",
          300: "#ff6874",
          400: "#ff3645",
          500: "#e00028",
          600: "#b70021",
          700: "#8e001a",
          800: "#650012",
          900: "#3c000b"
        },
        neutral:  "#0f172a",
        surface:  "#f8fafc",
        muted:    "#d6f4fb",
        danger:   "#ffb4c1"
      }
    }
  },
  plugins: [
    function({ addComponents }: { addComponents: any }) {
      addComponents({
        '.btn': {
          '@apply inline-flex items-center gap-2 font-medium rounded-lg px-4 py-2 bg-primary-500 text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors': {},
        },
        '.btn-accent': {
          '@apply inline-flex items-center gap-2 font-medium rounded-lg px-4 py-2 bg-accent-500 text-white hover:bg-accent-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 transition-colors': {},
        },
        '.btn-ghost': {
          '@apply px-3 py-2 rounded-md text-primary-600 hover:bg-muted transition-colors': {},
        },
        '.btn-danger': {
          '@apply inline-flex items-center gap-2 font-medium rounded-lg px-4 py-2 bg-accent-500 text-white hover:bg-accent-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 transition-colors': {},
        },
        '.link': {
          '@apply text-primary-600 hover:text-primary-700 underline underline-offset-2 transition-colors': {},
        },
        '.input': {
          '@apply w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-neutral focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors': {},
        },
        '.input-error': {
          '@apply border-accent-500 focus:ring-accent-500 focus:border-accent-500': {},
        },
        '.card': {
          '@apply bg-white rounded-lg shadow-md border border-gray-100': {},
        },
        '.text-error': {
          '@apply text-accent-600': {},
        },
        '.bg-danger-alert': {
          '@apply bg-danger border-l-4 border-accent-500 text-accent-700 p-4': {},
        }
      });
    }
  ],
};

export default config; 
