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
            class="flex flex-row justify-evenly items-center p-2 gap-2 h-full  sm:gap-5 sm:flex-col sm:justify-center sm:items-center">
            <span
                class="hidden sm:flex sm:flex-col justify-center items-center w-full  text-gray-900 dark:text-gray-300 text-lg">
                <Icon icon="bxl:visual-studio" class="text-4xl rotate-90" />


            </span>
            <RouterLink to="/"
                class="flex flex-col justify-center items-center w-full  text-gray-900 dark:text-gray-300 dark:hover:text-white text-lg">
                <Icon icon="ci:house-01" class="text-2xl sm:text-4xl " />
                Home
            </RouterLink>
            <RouterLink to=" /jobs"
                class="flex flex-col justify-center items-center w-full  text-gray-900 dark:text-gray-300 dark:hover:text-white text-lg">
                <Icon icon="ci:handbag" class="text-2xl sm:text-4xl" />
                Jobs
            </RouterLink>
            <RouterLink to="/addjob"
                class="flex flex-col justify-center items-center w-full  text-gray-900 dark:text-gray-300 dark:hover:text-white text-lg">
                <Icon icon="ci:file-add" class="text-2xl sm:text-4xl" />
                Add
            </RouterLink>
            <RouterLink to=" /about"
                class="flex flex-col justify-center items-center w-full  text-gray-900 dark:text-gray-300 dark:hover:text-white text-lg">
                <Icon icon="ci:text-align-left" class="text-2xl sm:text-4xl" />
                About
            </RouterLink>
        </div>
    </nav>
</template>