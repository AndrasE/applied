// On page load or when changing themes, best to add inline in `head` to avoid flicker or visual lag

export type Theme = "light" | "dark" | "system";

export function applyTheme(theme: Theme): void {
  // Set the theme
  if (theme === "system") {
    localStorage.removeItem("theme");
  } else {
    localStorage.theme = theme;
  }

  // Check if the user has a preference for dark mode returns true or false
  const isDark =
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  if (isDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}
