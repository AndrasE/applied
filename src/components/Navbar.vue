<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router';

// const isActiveLink = (routePath: string) => {
//     const route = useRoute();
//     return route.path === routePath;
// };

</script>

<template>
    <nav
        class="fixed bottom-0 w-full z-50 h-auto sm:top-0 sm:left-0 sm:h-full sm:w-auto dark:bg-gray-950 dark:shadow-gray-300">
        <div
            class="flex flex-row gap-3 justify-center items-center p-2 h-full sm:flex-col sm:justify-center sm:items-center">
            <RouterLink to="/" class="text-gray-900 dark:text-gray-300 dark:hover:text-white text-lg">
                Home
            </RouterLink>
            <RouterLink to="/about" class=" text-gray-900 dark:text-gray-300 dark:hover:text-white text-lg">
                About
            </RouterLink>
            <RouterLink to="/services" class=" text-gray-900 dark:text-gray-300 dark:hover:text-white text-lg">
                Services
            </RouterLink>
        </div>
    </nav>
</template>