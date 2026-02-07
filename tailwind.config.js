/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      backgroundImage: {
        forestNight: "url('/src/assets/images/night-forest-bg.jpeg')",
      },
    },
  },
  plugins: [],
};
