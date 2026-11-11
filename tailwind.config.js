/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  // Keep the existing carefully tuned terminal design intact while migrating to utilities.
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        terminal: {
          base: '#111318',
          panel: '#15171c',
          raised: '#1c2026',
          line: '#343740',
          text: '#e6e7ea',
          muted: '#aeb2bc',
          red: '#ff7772',
          yellow: '#f3c86b',
          green: '#8bcda0',
          blue: '#91baff',
          lilac: '#c3a6ff',
        },
      },
      fontFamily: {
        mono: ['DM Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
