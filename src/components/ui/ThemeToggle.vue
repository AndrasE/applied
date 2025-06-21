<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { applyTheme } from "@/theme";
import { Icon, addCollection } from "@iconify/vue";
import clarityIcons from "@iconify-json/clarity/icons.json";

// Register the Clarity Icons collection
addCollection(clarityIcons);

// Check if the user has a preferred theme in localStorage
const currentTheme = ref<"light" | "dark">("light");

// Track hover state
const isHovered = ref(false);

// Function to apply the theme and set the icon
const themeIcon = computed(() => {
  const isDark = currentTheme.value === "dark";
  const hoverIcon = isDark ? "ci:sun" : "ci:moon";
  const staticIcon = isDark ? "ci:moon" : "ci:sun";
  return isHovered.value ? hoverIcon : staticIcon;
});

// Function to set the theme and update localStorage
const setTheme = (theme: "light" | "dark") => {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.theme = theme;
  applyTheme(theme);
};

// Initialize the theme based on localStorage or system preference
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

// Function to toggle the theme
const toggleTheme = () => {
  currentTheme.value = currentTheme.value === "light" ? "dark" : "light";
  console.log("🌇 Theme set to", currentTheme.value);
};

// Watch for changes in the theme and apply it
watch(currentTheme, (newTheme) => {
  setTheme(newTheme);
});
</script>

<template>
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
