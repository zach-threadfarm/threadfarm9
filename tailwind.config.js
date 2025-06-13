/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Avenir', 'sans-serif'],
      },
      colors: {
        primary: '#1a73e8',
        secondary: '#5f6368',
        background: '#ffffff',
        text: '#202124',
      },
    },
  },
  plugins: [],
}; 