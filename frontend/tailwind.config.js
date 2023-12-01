/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    fontFamily: {
      'sans': ['Lexend', 'Arial', 'sans-serif']
    },
    extend: {
      colors: {
        'light-gray': '#6c6c6c',
        'dark-gray': '#242424',
        'red': '#F13E3E'
      },

      animation: {
        float: 'floatAround 8s linear infinite'
      },

      keyframes: theme => ({
        floatAround: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(5px, 2px)' },
          '50%': { transform: 'translate(2px, 3px)' },
          '75%': { transform: 'translate(-3px, -5px)' }
        }
      })
    },
  },
  plugins: [],
}

