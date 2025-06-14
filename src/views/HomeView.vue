<script setup lang="ts">
import Container from "@/components/ui/Container.vue";
import Divider from "@/components/ui/Divider.vue";
import { Icon } from "@iconify/vue";
import applying from "@/assets/animations/applying.json";
// Import Vue3Lottie and Icon components dynamically for better performance on initial load reduce bundle size 92.1 KiB -> 75.1 KiB
import { defineAsyncComponent, onMounted, ref } from "vue";
import type { Component } from "vue";

// Dynamically import Vue3Lottie with a type assertion
const isLottieReady = ref(false);

const Vue3Lottie = defineAsyncComponent({
  loader: () => import("vue3-lottie").then((m) => m.Vue3Lottie as Component),
  delay: 0,
  timeout: 3000,
});

onMounted(() => {
  setTimeout(() => {
    isLottieReady.value = true;
  }, 1000);
});
</script>

<template>
  <Container justify="center">
    <Divider label="vue3lottie" labelPosition="top" />
    <div
      class="flex flex-col items-center w-full max-w-sm p-1 mt-3 md:max-w-md lg:max-w-lg xl:max-w-xl">
      <div class="relative w-full aspect-[10/7] mb-3">
        <div
          aria-hidden="true"
          v-if="!isLottieReady"
          class="absolute inset-0 bg-[var(--skeleton-bg-light)] dark:bg-[var(--skeleton-bg-dark)] rounded-lg subtle-pulse flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs">
          loading...
        </div>
        <Vue3Lottie
          v-else
          :animationData="applying"
          :loop="true"
          :autoplay="true"
          :speed="0.6"
          class="w-full h-full" />
      </div>

      <h1 class="flex items-center justify-center mt-2 text-2xl text-center">
        <template v-if="!isLottieReady">
          <span
            class="block w-9 h-9 bg-[var(--skeleton-bg-light)] dark:bg-[var(--skeleton-bg-dark)] rounded mr-1 subtle-pulse"></span>
          <span
            class="block w-28 h-7 bg-[var(--skeleton-bg-light)] dark:bg-[var(--skeleton-bg-dark)] rounded subtle-pulse"></span>
        </template>
        <template v-else>
          <Icon
            icon="material-symbols-light:font-download-outline-rounded"
            class="relative top-0.5 text-5xl text-green-700 dark:text-green-300 hover:rotate-90 ease-in-out duration-300" />
          <span
            class="relative underline right-1 decoration-green-600 dark:decoration-green-300"
            >pplied</span
          >
        </template>
      </h1>
    </div>

    <p class="mb-3 text-sm text-center">
      <template v-if="!isLottieReady">
        <span
          class="block w-60 h-5 bg-[var(--skeleton-bg-light)] dark:bg-[var(--skeleton-bg-dark)] rounded mx-auto subtle-pulse mt-3"></span>
      </template>
      <template v-else> Personal job application tracker </template>
    </p>
    <Divider label="crud" labelPosition="bottom" />
  </Container>
</template>
