import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  safelist: ["text-tiny"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--default-font-family)", ...defaultTheme.fontFamily.sans],
        heading: ['"Poppins"', "sans-serif"],
        display: ['"Playfair Display"', "serif"],
      },
      fontSize: {
        tiny: ["0.425rem", { lineHeight: "1rem" }],
      },
    },
  },
  darkMode: "class",
};
