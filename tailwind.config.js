/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      screens: {
        'mobile': '320px',
        'tablet': '768px',
        'desktop': '1024px',
      },
      maxWidth: {
        'content': '750px', // Maximum content width
      },
      colors: {
        'primary': '#3498db',
        'secondary': '#2ecc71',
        'accent': '#9b59b6',
        'dark': '#34495e',
        'light': '#ecf0f1'
      }
    },
  },
  plugins: [],
  darkMode: 'class' // Enable dark mode with class strategy
}
