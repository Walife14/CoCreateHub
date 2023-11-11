/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      colors: {
        'light-gray': '#6c6c6c',
        'dark-gray': '#242424',
        'red': '#F13E3E'
      }
    },
  },
  plugins: [],
}

