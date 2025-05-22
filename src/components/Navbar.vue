<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { RouterLink } from 'vue-router';
import { Icon, addCollection } from "@iconify/vue";
import clarityIcons from '@iconify-json/clarity/icons.json';
import { applyTheme } from '@/theme.ts'

// Register the Clarity Icons collection
addCollection(clarityIcons);

// Define reactive variables for the current theme and the icon.
const currentTheme = ref<'light' | 'dark'>('light'); // This variable is used to store the current theme of the application.
const isHovered = ref(false); // This variable is used to track the hover state of the icon.
const themeIcon = computed(() => { // This computed property returns the icon based on the current theme and hover state.
    const isDark = currentTheme.value === 'dark'; // Check if the current theme is dark.
    const hoverIcon = isDark ? 'ci:sun' : 'ci:moon';    // icon shown on hover (indicates the *next* theme)
    const staticIcon = isDark ? 'ci:moon' : 'ci:sun';   // icon shown normally
    return isHovered.value ? hoverIcon : staticIcon; // Return the icon based on the hover state.
});

// Function to set the 'data-theme' attribute and store in localStorage.
const setTheme = (theme: 'light' | 'dark') => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.theme = theme;
    applyTheme(theme); // <- this was missing
};

// Initialize theme and icon on component mounted (initial detection) and applyTheme() (class switching to html)
onMounted(() => {
    if (localStorage.theme === 'dark' || (!localStorage.theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        currentTheme.value = 'dark';
    } else {
        currentTheme.value = 'light';
    }

    setTheme(currentTheme.value); // Apply theme to <html>
});

const toggleTheme = () => {
    currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light';
};
watch(currentTheme, (newTheme) => {
    setTheme(newTheme);
});



</script>

<template>
    <header class="fixed top-0 left-0 w-full z-50 sm:hidden">
        <div
            class="flex flex-row flex-center gap-2 h-auto w-full p-2 border-color border-b-1 bg-[var(--bg-light)] dark:bg-[var(--bg-dark)]">
            <div class="flex flex-row items-center">
                <p class="text-tiny text-center text-orientation">logo</p>
                <div class="tiny-border h-12 w-px"></div>
            </div>
            <RouterLink to="/" class="w-full flex text-hover">
                <Icon icon="material-symbols-light:font-download-outline-rounded" class="text-5xl" />
            </RouterLink>

            <div class=" flex sm:hidden ">
                <button @click="toggleTheme" @mouseenter="isHovered = true" @mouseleave="isHovered = false"
                    class="flex flex-center text-hover cursor-pointer " aria-label="Toggle theme">
                    <Icon :icon="themeIcon" class="text-3xl transition-transform duration-300 ease-in-out"
                        :class="{ 'rotate-270': isHovered }" />
                </button>
                <div class="flex flex-row items-center pl-2">
                    <div class="tiny-border h-12 w-px"></div>
                    <p class="text-tiny text-center text-orientation">theme</p>
                </div>
            </div>
        </div>
    </header>

    <nav class="fixed bottom-0 w-full z-50 h-auto border-color border-t-1
               sm:border-t-0 sm:top-0 sm:left-0 sm:h-full sm:w-auto sm:border-r-1
               p-2 bg-[var(--bg-light)] dark:bg-[var(--bg-dark)]">
        <div class="flex flex-row flex-center gap-2 sm:flex-col sm:justify-between sm:items-center sm:h-full sm:w-auto">

            <div class="hidden sm:flex sm:flex-col sm:items-center">
                <RouterLink to="/" class="w-full text-hover">
                    <Icon icon="material-symbols-light:font-download-outline-rounded" class="text-6xl" />
                </RouterLink>
                <div class="block mt-2">
                    <div class="sm:h-px tiny-border"></div>
                    <p class="text-tiny text-center tracking-widest">logo</p>
                </div>
            </div>

            <div class="flex flex-row flex-center sm:w-full flex-grow sm:flex-col">
                <div class="sm:block sm:w-full flex flex-row items-center">
                    <p class="text-tiny text-center text-orientation tracking-wider">nav</p>
                    <div class="tiny-border h-12 w-px sm:w-full sm:h-px"></div>
                </div>

                <RouterLink to="/" class="nav-link text-hover">
                    <Icon icon="ci:house-01" class="text-2xl sm:text-3xl" />Home
                </RouterLink>
                <RouterLink to="/jobs" class="nav-link text-hover">
                    <Icon icon="ci:handbag" class="text-2xl sm:text-3xl" />Jobs
                </RouterLink>
                <RouterLink to="/add" class="nav-link text-hover">
                    <Icon icon="ci:file-add" class="text-2xl sm:text-3xl" />Add
                </RouterLink>
                <RouterLink to="/about" class="nav-link text-hover">
                    <Icon icon="ci:text-align-left" class="text-2xl sm:text-3xl" />About
                </RouterLink>

                <div class="sm:block sm:w-full flex flex-row items-center">
                    <div class="tiny-border h-12 w-px sm:w-full sm:h-px"></div>
                    <p class="text-tiny text-center text-orientation ">link</p>
                </div>
            </div>

            <div class="hidden sm:w-full sm:flex sm:flex-col sm:items-center">
                <div class="block w-full mb-2">
                    <p class="text-tiny text-center tracking-widest">theme</p>
                    <div class="h-px tiny-border"></div>
                </div>
                <button @click="toggleTheme" @mouseenter="isHovered = true" @mouseleave="isHovered = false"
                    class="flex flex-center text-hover cursor-pointer " aria-label="Toggle theme">
                    <Icon :icon="themeIcon" class="text-2xl sm:text-3xl transition-transform duration-300 ease-in-out"
                        :class="{ 'rotate-270': isHovered }" />
                </button>
            </div>
        </div>
    </nav>
</template>
