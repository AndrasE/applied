<script setup lang="ts">
import Container from "@/components/ui/Container.vue";
import Divider from "@/components/ui/Divider.vue";
import applying from "@/assets/animations/applying.json";
// Import Vue3Lottie and Icon components dynamically for better performance on initial load reduce bundle size 92.1 KiB -> 75.1 KiB
import { defineAsyncComponent } from "vue";
import type { Component } from "vue";

// Dynamically import Vue3Lottie with a type assertion
const Vue3Lottie = defineAsyncComponent(() =>
  import("vue3-lottie").then((m) => m.Vue3Lottie as Component)
);

// Dynamically import Icon component from @iconify/vue with a type assertion
const Icon = defineAsyncComponent(() =>
  import("@iconify/vue").then((m) => m.Icon as Component)
);
</script>

<template>
  <Container justify="center">
    <Divider label="vue3lottie" labelPosition="top" />

    <!-- lottie and app-name -->
    <div
      class="flex flex-col items-center w-full mt-3 max-w-sm p-1 md:max-w-md lg:max-w-lg xl:max-w-xl">
      <Vue3Lottie
        :animationData="applying"
        :loop="true"
        :autoplay="true"
        :speed="0.6" />
      <h1 class="flex items-center justify-center text-2xl text-center">
        <Icon
          icon="material-symbols-light:font-download-outline-rounded"
          class="relative top-0.5 text-5xl text-green-700 dark:text-green-300 hover:rotate-90 ease-in-out duration-300" />
        <span
          class="relative underline right-1 decoration-green-600 dark:decoration-green-300"
          >pplied</span
        >
      </h1>
    </div>

    <!-- later.. -->
    <p class="text-center text-sm mb-3">Personal job application tracker</p>
    <Divider label="crud" labelPosition="bottom" />
  </Container>
</template>
