/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        londrina: ["var(--font-londrina)", "sans-serif"],
        pt: ["var(--font-pt)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
