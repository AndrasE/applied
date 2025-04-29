import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--default-font-family)", ...defaultTheme.fontFamily.sans], // default sans font
        heading: ['"Poppins"', "sans-serif"], // example heading font
        display: ['"Playfair Display"', "serif"], // another option
      },
    },
  },
  darkMode: "class",
};
