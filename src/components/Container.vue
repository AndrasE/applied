<script setup lang="ts">
import { ref } from "vue";


</script>


<template>
    <div
        class="grid min-h-screen grid-cols-1 md:grid-cols-[auto_auto_1fr_auto_auto] lg:grid-cols-[1fr_auto_auto_minmax(0,theme(maxWidth.6xl))_auto_auto_1fr]">

        <!-- Left Buffer Label -->
        <span class="hidden lg:block relative text-tiny text-upright" role="presentation" aria-hidden="true">
            <span class="sticky top-1/3 hide-under-1420">buffer hidden</span>
        </span>

        <!-- Left Pattern Bar -->
        <div class="border-r border-solid border-color hidden md:block md:w-9 lg:w-14 bg-[image:repeating-linear-gradient(315deg,var(--pattern-color-light)_0,var(--pattern-color-light)_1px,transparent_0,transparent_50%)] dark:bg-[image:repeating-linear-gradient(315deg,var(--pattern-color-dark)_0,var(--pattern-color-dark)_1px,transparent_0,transparent_50%)] bg-[size:10px_10px] bg-fixed"
            role="presentation" aria-hidden="true">
        </div>

        <!-- Left Pattern Label -->
        <span class="hidden lg:flex items-end text-tiny text-upright" role="presentation" aria-hidden="true">
            <span class="sm:sticky top-1/2 hide-under-950">linear gradient</span>
        </span>

        <!-- Main Content -->
        <slot></slot>

        <!-- Right Pattern Label -->
        <span class="hidden md:block text-tiny text-upright relative" role="presentation" aria-hidden="true">
            <span class="sm:sticky top-1/2 hide-under-950">image repeating</span>
        </span>

        <!-- Right Pattern Bar -->
        <div
            class="border-l border-solid border-color hidden md:block md:w-9 lg:w-14 bg-[image:repeating-linear-gradient(315deg,var(--pattern-color-light)_0,var(--pattern-color-light)_1px,transparent_0,transparent_50%)] dark:bg-[image:repeating-linear-gradient(315deg,var(--pattern-color-dark)_0,var(--pattern-color-dark)_1px,transparent_0,transparent_50%)] bg-[size:10px_10px] bg-fixed">
        </div>

        <!-- Right Buffer Label -->
        <span class="hidden lg:flex items-end text-tiny text-upright" role="presentation" aria-hidden="true">
            <span class="sticky top-1/3 hide-under-1420">buffer lg flex</span>
        </span>
    </div>
</template>
