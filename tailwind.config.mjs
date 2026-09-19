/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'brand-navy': '#10285D',    // Deep Navy Blue
        'brand-white': '#FFFFFF',   // Pure White
        'brand-gold': '#D4AF37',    // Metallic Gold[cite: 1]
        'brand-sky': '#6A93C3',     // Sky Blue[cite: 1]
        'brand-azure': '#1C6EA4',   // Azure Sea[cite: 1]
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'], // Per i titoli editoriali[cite: 1]
        sans: ['"Proza Libre"', 'sans-serif'],    // Per navigazione e testi[cite: 1]
      },
    },
  },
  plugins: [],
}
