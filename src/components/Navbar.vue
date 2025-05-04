<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { Icon } from "@iconify/vue";
import { setTheme } from '@/theme.ts'
// const isActiveLink = (routePath: string) => {
//     const route = useRoute();
//     return route.path === routePath;
// };

const currentTheme = ref<'light' | 'dark' | 'system'>('system');
onMounted(() => {
    // Initialize the theme based on localStorage or system preference on component mount
    if (localStorage.theme) {
        currentTheme.value = localStorage.theme as 'light' | 'dark';
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        currentTheme.value = 'dark';
    } else {
        currentTheme.value = 'light';
    }
    setTheme(currentTheme.value); // Apply the initial theme
});

const toggleTheme = () => {
    if (currentTheme.value === 'light') {
        currentTheme.value = 'dark';
    } else {
        currentTheme.value = 'light';
    }
    localStorage.setItem('theme', currentTheme.value);
    setTheme(currentTheme.value);
};
</script>

<template>
    <nav class="fixed bottom-0 w-full z-50 h-auto nav-border sm:top-0 sm:left-0 sm:h-full sm:w-auto p-2 sm:border-r-1 ">
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


                <button @click="toggleTheme" class="text-hover xl cursor-pointer">
                    <Icon icon="material-symbols-light:brightness-6" class="text-4xl" />
                </button>
            </div>
        </div>
    </nav>
</template>
