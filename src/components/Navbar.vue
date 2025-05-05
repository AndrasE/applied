<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { RouterLink } from 'vue-router';
import { Icon, addCollection } from "@iconify/vue";
import clarityIcons from '@iconify-json/clarity/icons.json';
import { applyTheme } from '@/theme.ts'

// Register the Clarity Icons collection
addCollection(clarityIcons);

// Define reactive variables for the current theme and the icon.
const currentTheme = ref<'light' | 'dark'>('light');
const themeIcon = ref('ci:moon');

// Function to set the 'data-theme' attribute and store in localStorage.
const setTheme = (theme: 'light' | 'dark') => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.theme = theme;
};

// Initialize theme and icon on component mounted (initial detection) and applyTheme() (class switching to html)
onMounted(() => {
    if (localStorage.theme) {
        currentTheme.value = localStorage.theme as 'light' | 'dark';
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        currentTheme.value = 'dark';
    } else {
        currentTheme.value = 'light';
    }
    applyTheme(currentTheme.value);
    // Set the initial icon to match the resolved theme.
    themeIcon.value = currentTheme.value === 'dark'
        ? 'ci:moon'
        : 'ci:sun';
});

// Function to toggle the theme and update localStorage and the icon.
const toggleTheme = () => {
    currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme.value);
    applyTheme(currentTheme.value);
    themeIcon.value = currentTheme.value === 'dark'
        ? 'ci:moon'
        : 'ci:sun';
};

// Watch for changes in 'currentTheme' to update the document theme and icon.
watch(currentTheme, (newTheme) => {
    setTheme(newTheme);
    themeIcon.value = newTheme === 'dark'
        ? 'ci:moon'
        : 'ci:sun';
});

</script>

<template>
    <nav
        class="fixed bottom-0 w-full z-50 h-auto nav-border border-t-1 sm:border-t-0  sm:top-0 sm:left-0 sm:h-full sm:w-auto p-2 sm:border-r-1 ">
        <div class="flex flex-row flex-center gap-2 sm:flex-col sm:justify-between sm:items-center sm:h-full sm:w-auto">

            <!-- logo -->
            <div class="hidden sm:flex sm:flex-col">
                <RouterLink to="/" class="w-full text-hover 3xl">
                    <Icon icon="material-symbols-light:font-download-outline-rounded" class="text-6xl" />
                </RouterLink>

                <!-- divider line -->
                <div class="block mt-2">
                    <div class="sm:h-px tiny-border"></div>
                    <p class="text-tiny text-center tracking-widest">logo</p>
                </div>
            </div>

            <!-- nav links -->
            <div class="flex flex-row flex-center sm:w-full  flex-grow sm:flex-col">

                <!-- divider line -->
                <div class="sm:block sm:w-full flex flex-row items-center">
                    <p class="text-tiny text-center text-orientation tracking-wider">nav</p>
                    <div class="tiny-border h-12 w-px sm:w-full sm:h-px"></div>
                </div>

                <RouterLink to="/" class="nav-link text-hover">
                    <Icon icon="ci:house-01" class="text-2xl sm:text-3xl" />
                    Home
                </RouterLink>

                <RouterLink to="/jobs" class="nav-link text-hover">
                    <Icon icon="ci:handbag" class="text-2xl sm:text-3xl" />
                    Jobs
                </RouterLink>

                <RouterLink to="/addjob" class="nav-link text-hover">
                    <Icon icon="ci:file-add" class="text-2xl sm:text-3xl" />
                    Add
                </RouterLink>

                <RouterLink to="/about" class="nav-link text-hover">
                    <Icon icon="ci:text-align-left" class="text-2xl sm:text-3xl" />
                    About
                </RouterLink>

                <!-- divider line -->
                <div class="sm:block sm:w-full flex flex-row items-center">
                    <div class="tiny-border h-12 w-px sm:w-full sm:h-px"></div>
                    <p class="text-tiny text-center text-orientation ">link</p>
                </div>




            </div>

            <!-- theme toggle -->

            <div class="hidden sm:w-full sm:flex sm:flex-col sm:items-center">
                <!-- divider line -->
                <div class="block w-full mb-2">
                    <p class="text-tiny text-center tracking-widest">theme</p>
                    <div class="h-px tiny-border"></div>
                </div>


                <button @click="toggleTheme" class="flex flex-center text-hover  cursor-pointer">
                    <Icon :icon="themeIcon" class="text-2xl sm:text-3xl" />
                </button>
            </div>
        </div>
    </nav>
</template>
