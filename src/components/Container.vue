<script setup lang="ts">
import { ref } from "vue";


</script>


<template>
    <div
        class="grid min-h-screen grid-cols-1 md:grid-cols-[auto_auto_1fr_auto_auto] lg:grid-cols-[1fr_auto_auto_minmax(0,theme(maxWidth.6xl))_auto_auto_1fr]">
        <!-- Left Buffer Label -->
        <span class="hidden lg:flex justify-center items-start relative bottom-30 text-tiny text-upright "
            role="presentation" aria-hidden="true">
            <span class="hide-under-1420"> buffer hidden</span>
        </span>

        <!-- Left Pattern Bar -->
        <div
            class="border-r border-solid border-color hidden md:block w-14 bg-[image:repeating-linear-gradient(315deg,var(--pattern-color-light)_0,var(--pattern-color-light)_1px,transparent_0,transparent_50%)] dark:bg-[image:repeating-linear-gradient(315deg,var(--pattern-color-dark)_0,var(--pattern-color-dark)_1px,transparent_0,transparent_50%)] bg-[size:10px_10px] bg-fixed">
        </div>

        <!-- Left Pattern Label -->
        <span class="hidden md:flex md:justify-center text-tiny text-upright" role="presentation" aria-hidden="true">
            image repeating
        </span>

        <!-- Main Content -->
        <slot></slot>

        <!-- Right Pattern Label -->
        <span class="hidden md:flex md:justify-center text-tiny text-upright" role="presentation" aria-hidden="true">
            linear gradient
        </span>

        <!-- Right Pattern Bar -->
        <div
            class="border-l border-solid border-color hidden md:block w-14 bg-[image:repeating-linear-gradient(315deg,var(--pattern-color-light)_0,var(--pattern-color-light)_1px,transparent_0,transparent_50%)] dark:bg-[image:repeating-linear-gradient(315deg,var(--pattern-color-dark)_0,var(--pattern-color-dark)_1px,transparent_0,transparent_50%)] bg-[size:10px_10px] bg-fixed">
        </div>

        <!-- Right Buffer Label -->
        <span class="hidden lg:flex justify-center items-end relative bottom-30 text-tiny text-upright"
            role="presentation" aria-hidden="true">
            <span class="hide-under-1420"> buffer lg flex</span>
        </span>
    </div>
</template>
