<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { applyTheme } from "@/theme";
import { Icon, addCollection } from "@iconify/vue";
import clarityIcons from "@iconify-json/clarity/icons.json";

// Register the Clarity Icons collection for use in the toggle button
addCollection(clarityIcons);

// Track the current theme (light or dark)
const currentTheme = ref<"light" | "dark">("light");

// Track hover state for icon animation
const isHovered = ref(false);

// Compute the icon to display based on theme and hover state
const themeIcon = computed(() => {
  const isDark = currentTheme.value === "dark";
  const hoverIcon = isDark ? "ci:sun" : "ci:moon";
  const staticIcon = isDark ? "ci:moon" : "ci:sun";
  return isHovered.value ? hoverIcon : staticIcon;
});

// Set the theme on the document and in localStorage
const setTheme = (theme: "light" | "dark") => {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.theme = theme;
  applyTheme(theme);
};

// On mount, initialize the theme from localStorage or system preference
onMounted(() => {
  if (
    localStorage.theme === "dark" ||
    (!localStorage.theme &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    currentTheme.value = "dark";
  } else {
    currentTheme.value = "light";
  }
  setTheme(currentTheme.value);
});

// Toggle between light and dark themes
const toggleTheme = () => {
  currentTheme.value = currentTheme.value === "light" ? "dark" : "light";
  console.log("🌇 Theme set to", currentTheme.value);
};

// Watch for theme changes and apply them
watch(currentTheme, (newTheme) => {
  setTheme(newTheme);
});
</script>

<template>
  <!--
    ThemeToggle: Button to switch between light and dark themes.
    - Shows a sun or moon icon depending on the theme
    - Icon animates on hover
    - Accessible with aria-label
  -->
  <button
    aria-label="Toggle theme"
    type="button"
    @click="toggleTheme"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    class="flex cursor-pointer flex-center text-hover">
    <Icon
      :icon="themeIcon"
      :class="[
        'text-3xl',
        'transition-transform',
        'duration-300',
        'ease-in-out',
        { 'rotate-90': isHovered },
      ]" />
  </button>
</template>
