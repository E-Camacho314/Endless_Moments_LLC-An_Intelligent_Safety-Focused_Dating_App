/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}",       // for App Router
      "./pages/**/*.{js,ts,jsx,tsx}",     // for Pages Router if used
      "./components/**/*.{js,ts,jsx,tsx}" // for reusable components
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  }
  