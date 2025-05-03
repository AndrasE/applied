// On page load or when changing themes, best to add inline in `head` to avoid FOUC
export function setTheme(theme) {
  if (theme === "system") {
    localStorage.removeItem("theme");
  } else {
    localStorage.theme = theme;
  }

  document.documentElement.classList.toggle(
    "dark",
    localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
  );
}
