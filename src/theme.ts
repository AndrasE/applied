// Utility for applying and persisting light/dark/system theme preference
// On page load or when changing themes, best to add inline in `head` to avoid flicker or visual lag

export type Theme = "light" | "dark" | "system";

export function applyTheme(theme: Theme): void {
  // Set the theme in localStorage or remove for system
  if (theme === "system") {
    localStorage.removeItem("theme");
  } else {
    localStorage.theme = theme;
  }

  // Determine if dark mode should be enabled
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
