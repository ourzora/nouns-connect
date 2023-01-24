const { fontFamily } = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        londrina: ["var(--font-londrina)", ...fontFamily.sans],
        pt: ["var(--font-pt)", ...fontFamily.sans],
      },
      height: {
        header: "var(--header-height)"
      }
    },
  },
  plugins: [],
};
