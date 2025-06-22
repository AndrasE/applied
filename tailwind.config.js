export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx,css}"],
  safelist: [
    "fixed",
    "bottom-0",
    "w-full",
    "z-50",
    "h-auto",
    "p-2",
    "flex",
    "flex-row",
    "gap-2",
    "flex-center",
    "sm:flex-col",
    "ring-slate-700", // Add any other specific classes not working
    "dark:bg-[var(--bg-dark)]", // For JIT, sometimes custom variable usage needs safelisting
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
