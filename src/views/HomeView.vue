<script lang="ts">
// this variable exists at the module level. It is initialized ONLY ONCE
//  when this component file is first processed by your bundler. No re-initialization occurs on component unmounts or re-mounts within the same application session.
let lottieAnimationLoadedOnce: boolean = false;
</script>

<script setup lang="ts">
import Container from "@/components/ui/Container.vue";
import Divider from "@/components/ui/Divider.vue";
import { Icon } from "@iconify/vue"; // Icon is directly imported now, not async component
import applying from "@/assets/animations/applying.json";
import { defineAsyncComponent, onMounted, ref } from "vue";
import type { Component } from "vue";

// isLottieReady is a local reactive state for THIS component instance.
// Its initial value depends on whether the animation has loaded globally once.
const isLottieReady = ref(lottieAnimationLoadedOnce); // Initialize based on persistent state

const Vue3Lottie = defineAsyncComponent({
  loader: () => import("vue3-lottie").then((m) => m.Vue3Lottie as Component),
  delay: 0,
  timeout: 3000,
});

onMounted(() => {
  // If the animation has already been marked as loaded in this session,
  // isLottieReady is already true, so we do nothing more.
  if (lottieAnimationLoadedOnce) {
    return;
  }

  // If it's the first time this session, trigger the loading timeout
  setTimeout(() => {
    isLottieReady.value = true;
    lottieAnimationLoadedOnce = true; // Mark as loaded for future instances in this session
  }, 1200); // Your determined loading time
});
</script>

<template>
  <Container justify="center">
    <Divider label="vue3lottie" labelPosition="top" />
    <div
      class="flex flex-col items-center w-full max-w-sm p-1 mt-3 md:max-w-md lg:max-w-lg xl:max-w-xl">
      <div class="relative mb-3 w-full aspect-[10/7]">
        <div
          aria-hidden="true"
          v-if="!isLottieReady"
          class="absolute inset-0 mb-5 mt-1 mx-2 flex items-center justify-center rounded-lg bg-[var(--skeleton-bg-light)] text-tiny text-gray-500 subtle-pulse dark:bg-[var(--skeleton-bg-dark)] dark:text-gray-400">
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
            class="mr-1 block h-9 w-9 rounded bg-[var(--skeleton-bg-light)] subtle-pulse dark:bg-[var(--skeleton-bg-dark)]"></span>
          <span
            class="block h-7 w-23 rounded bg-[var(--skeleton-bg-light)] subtle-pulse dark:bg-[var(--skeleton-bg-dark)]"></span>
        </template>
        <template v-else>
          <Icon
            icon="material-symbols-light:font-download-outline-rounded"
            class="relative top-0.5 text-5xl text-green-700 duration-300 ease-in-out hover:rotate-90 dark:text-green-300" />
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
          class="mx-auto mt-3 block h-5 w-55 rounded bg-[var(--skeleton-bg-light)] subtle-pulse dark:bg-[var(--skeleton-bg-dark)]"></span>
      </template>
      <template v-else> Personal job application tracker </template>
    </p>
    <Divider label="crud" labelPosition="bottom" />
  </Container>
</template>
