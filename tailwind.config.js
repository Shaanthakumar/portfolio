/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./portfolio.tsx",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brandGreen: "#0e4f4a",
        brandBeige: "#f1eee8",
        brandCoral: "#FF655E",
      },
      fontFamily: {
        sans: ['Kanit', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
