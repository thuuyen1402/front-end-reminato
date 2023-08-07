/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./__mocks__/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors:{
        youtube:{
          primary:"#EA3322",
          secondary:"#0F0F0F"
        }
      },
      fontFamily: {
        primary: ["Montserrat", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
}