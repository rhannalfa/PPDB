/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.jsx",
  ],
  theme: {
    extend: {},
  },
  plugins: [],

  theme: {
  extend: {
    fontFamily: {
  heading: ['Clash Display', 'sans-serif'],
  body: ['Plus Jakarta Sans', 'sans-serif'],
},
  },
},

}

