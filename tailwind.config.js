/** @type {import('tailwindcss').Config} */
export default {
  // The 'content' array tells Tailwind which files to scan for classes.
  // It's crucial for Tailwind's JIT mode to generate the correct CSS.
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx,css}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
