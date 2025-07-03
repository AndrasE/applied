<script setup lang="ts">
import { computed } from "vue";

// Slot props to align content vertically, defaults to justify-start
const props = defineProps<{
  justify?: "start" | "center" | "between" | "end";
}>();

// Compute the flexbox justify class based on the prop
const justifyClass = computed(() => {
  return `justify-${props.justify ?? "start"}`;
});
</script>

<template>
  <!--
    Responsive container grid for page layout:
    - Side pattern bars and labels for visual design
    - Main content centered and vertically aligned
    - Uses slot for flexible content injection
  -->
  <div
    class="grid min-h-screen grid-cols-1 md:grid-cols-[auto_auto_1fr_auto_auto] lg:grid-cols-[1fr_auto_auto_minmax(0,theme(maxWidth.6xl))_auto_auto_1fr]">
    <!-- Left Buffer Label (for spacing on large screens) -->
    <span
      class="relative hidden lg:block text-tiny text-upright"
      role="presentation"
      aria-hidden="true">
      <span class="sticky top-1/3 hide-under-1420">buffer hidden</span>
    </span>

    <!-- Left Pattern Bar (vertical border and background pattern) -->
    <div
      class="border-r border-solid border-color hidden md:block md:w-9 lg:w-14 bg-[image:repeating-linear-gradient(315deg,var(--pattern-color-light)_0,var(--pattern-color-light)_1px,transparent_0,transparent_50%)] dark:bg-[image:repeating-linear-gradient(315deg,var(--pattern-color-dark)_0,var(--pattern-color-dark)_1px,transparent_0,transparent_50%)] bg-[size:10px_10px] bg-fixed"
      role="presentation"
      aria-hidden="true"></div>

    <!-- Left Pattern Label (for design annotation) -->
    <span
      class="items-end hidden md:flex text-tiny text-upright"
      role="presentation"
      aria-hidden="true">
      <span class="sm:sticky top-1/2 hide-under-950">linear gradient</span>
    </span>

    <!-- Main Content (slot for page content, vertically aligned) -->
    <div
      :class="[
        'relative flex flex-col items-center h-full pt-16 pb-20 sm:py-0',
        justifyClass,
      ]">
      <slot></slot>
    </div>

    <!-- Right Pattern Label (for design annotation) -->
    <span
      class="relative hidden md:block text-tiny text-upright"
      role="presentation"
      aria-hidden="true">
      <span class="sm:sticky top-1/2 hide-under-950">image repeating</span>
    </span>

    <!-- Right Pattern Bar (vertical border and background pattern) -->
    <div
      class="border-l border-solid border-color hidden md:block md:w-9 lg:w-14 bg-[image:repeating-linear-gradient(315deg,var(--pattern-color-light)_0,var(--pattern-color-light)_1px,transparent_0,transparent_50%)] dark:bg-[image:repeating-linear-gradient(315deg,var(--pattern-color-dark)_0,var(--pattern-color-dark)_1px,transparent_0,transparent_50%)] bg-[size:10px_10px] bg-fixed border-r-1 border-hide-over-1368"></div>

    <!-- Right Buffer Label (for spacing on large screens) -->
    <span
      class="items-end hidden lg:flex text-tiny text-upright"
      role="presentation"
      aria-hidden="true">
      <span class="sticky top-1/3 hide-under-1420">buffer lg flex</span>
    </span>
  </div>
</template>
