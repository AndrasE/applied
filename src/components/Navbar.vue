<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router';
import { Icon } from "@iconify/vue";


// const isActiveLink = (routePath: string) => {
//     const route = useRoute();
//     return route.path === routePath;
// };

</script>

<template>
    <nav
        class="fixed bottom-0 w-full z-50 h-auto sm:top-0 sm:left-0 sm:h-full sm:w-auto dark:bg-gray-950 dark:shadow-gray-300">

        <div
            class="flex flex-row justify-evenly items-center gap-2 sm:flex-col sm:justify-between sm:items-center sm:h-full sm:w-auto">
            <div class="hidden sm:flex sm:flex-col sm:items-start">
                <RouterLink to="/"
                    class=" items-center w-full text-gray-900 dark:text-gray-300 dark:hover:text-white text-lg">
                    <Icon icon="material-symbols-light:font-download-outline-rounded" class="text-6xl" />
                </RouterLink>
            </div>
            <div class="flex flex-row sm:flex-col items-center justify-center flex-grow p-2 sm:p-0 gap-2 sm:gap-y-4 ">
                <RouterLink to="/"
                    class="flex flex-col justify-center items-center w-full text-gray-900 dark:text-gray-300 dark:hover:text-white text-lg transition-transform duration-300 ease-in-out sm:hover:scale-103">
                    <Icon icon="ci:house-01" class="text-2xl sm:text-4xl" />
                    Home
                </RouterLink>

                <RouterLink to="/jobs"
                    class="flex flex-col justify-center items-center w-full text-gray-900 dark:text-gray-300 dark:hover:text-white text-lg transition-transform duration-300 ease-in-out sm:hover:scale-103">
                    <Icon icon="ci:handbag" class="text-2xl sm:text-4xl" />
                    Jobs
                </RouterLink>

                <RouterLink to="/addjob"
                    class="flex flex-col justify-center items-center w-full text-gray-900 dark:text-gray-300 dark:hover:text-white text-lg transition-transform duration-300 ease-in-out sm:hover:scale-103">
                    <Icon icon="ci:file-add" class="text-2xl sm:text-4xl" />
                    Add
                </RouterLink>

                <RouterLink to="/about"
                    class="flex flex-col justify-center items-center w-full text-gray-900 dark:text-gray-300 dark:hover:text-white text-lg transition-transform duration-300 ease-in-out sm:hover:scale-103">
                    <Icon icon="ci:text-align-left" class="text-2xl sm:text-4xl" />
                    About
                </RouterLink>
            </div>
            <div class="hidden sm:flex sm:flex-col sm:items-end">
                <RouterLink to="/"
                    class=" items-center w-full text-gray-900 dark:text-gray-300 dark:hover:text-white text-lg">
                    <Icon icon="material-symbols-light:brightness-6" class="text-6xl" />
                </RouterLink>
            </div>
        </div>
    </nav>
</template>
