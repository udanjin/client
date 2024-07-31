/** @type {import('tailwindcss').Config} */
export default {
  darkMode:'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        primary: ["Inter"],
      },
    },
  },
  plugins: [require("flowbite/plugin")({
    charts: true,
  })],

};
