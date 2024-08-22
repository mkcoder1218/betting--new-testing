/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        "max-sm": { max: "575px" }, // Custom max-width for screens smaller than 576px
        "max-md": { max: "767px" }, // Custom max-width for screens smaller than 768px
        "max-lg": { max: "1280px" }, // Custom max-width for screens smaller than 992px
        "max-xl": { max: "1360px" }, // Custom max-width for screens smaller than 1200px
      },
      fontFamily: {
        custom: ['"Helvetica Neue"', "Helvetica", "Arial", "sans-serif"],
      },
      width: {
        "28p": "28%",
        "99p": "99%",
        "90p": "94%", // Custom width of 28%
      },
    },
  },
  plugins: [],
};