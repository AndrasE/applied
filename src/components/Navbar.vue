<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { Icon } from "@iconify/vue";
// const isActiveLink = (routePath: string) => {
//     const route = useRoute();
//     return route.path === routePath;
// };
</script>

<template>
    <nav
        class="fixed bottom-0 w-full z-50 h-auto sm:top-0 sm:left-0 sm:h-full sm:w-auto border-t-1 p-2 sm:border-r-1 border-subtle">
        <div
            class="flex flex-row justify-evenly items-center gap-2 sm:flex-col sm:justify-between sm:items-center sm:h-full sm:w-auto">

            <!-- logo -->
            <div class="hidden sm:flex sm:flex-col sm:items-start">
                <RouterLink to="/" class="w-full text-hover 3xl">
                    <Icon icon="material-symbols-light:font-download-outline-rounded" class="text-6xl" />
                </RouterLink>

                <!-- divider line -->
                <div class="block w-full mt-2 sm:items-end">
                    <div class="w-full h-px bg-slate-300 dark:bg-slate-600"></div>
                    <p class="text-tiny text-gray-500 dark:text-gray-300 text-center">logo</p>
                </div>
            </div>

            <!-- nav links -->
            <div class="flex flex-row sm:flex-col w-full items-center justify-center flex-grow">

                <!-- divider line -->
                <div class="block w-full">
                    <p class="text-tiny text-gray-500 dark:text-gray-300 text-center">nav</p>
                    <div class="w-full h-px bg-slate-300 dark:bg-slate-600"></div>
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
                <div class="block w-full sm:items-end">
                    <div class="w-full h-px bg-slate-300 dark:bg-slate-600"></div>
                    <p class="text-tiny text-gray-500 dark:text-gray-300 text-center">links</p>
                </div>
            </div>

            <!-- theme toggle -->
            <div class="hidden w-full sm:flex sm:flex-col sm:items-end text-center">
                <!-- divider line -->
                <div class="block w-full py-2 sm:items-end">
                    <p class="text-tiny text-gray-500 dark:text-gray-300">theme</p>
                    <div class="w-full h-px bg-slate-300 dark:bg-slate-600"></div>
                </div>
                <RouterLink to="/" class="flex-center text-tiny text-hover w-full 3xl">
                    <Icon icon="material-symbols-light:brightness-6" class="text-3xl" />
                </RouterLink>
            </div>
        </div>
    </nav>
</template>
