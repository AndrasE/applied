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

// isIconRotated is a local reactive state for THIS component instance.
const isIconRotated = ref(false);

const Vue3Lottie = defineAsyncComponent({
  loader: () => import("vue3-lottie").then((m) => m.Vue3Lottie as Component),
  delay: 0,
  timeout: 3000,
});

onMounted(() => {
  window.scrollTo(0, 0); // Scroll to the top overwriting any previous scroll
  // If the animation has already been marked as loaded in this session,
  // isLottieReady is already true, so we do nothing more.
  if (lottieAnimationLoadedOnce) {
    return;
  }

  // Set the icon to be rotated initially when the skeleton is present
  isIconRotated.value = true;

  // If it's the first time this session, trigger the loading timeout
  setTimeout(() => {
    isLottieReady.value = true;
    lottieAnimationLoadedOnce = true; // Mark as loaded for future instances in this session
    setTimeout(() => {
      isIconRotated.value = false;
    }, 300);
  }, 1400);
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
          class="absolute inset-0 mb-3 mt-1 mx-3 flex items-center justify-center rounded-lg bg-[var(--skeleton-light)] text-tiny text-gray-500 subtle-pulse tracking-widest dark:bg-[var(--skeleton-dark)] dark:text-gray-400">
          loading...
        </div>
        <Vue3Lottie
          v-else
          :animationData="applying"
          :loop="true"
          :autoplay="true"
          :speed="0.8"
          class="w-full h-full" />
      </div>

      <h1 class="flex items-center justify-center mt-2 text-2xl text-center">
        <template v-if="!isLottieReady">
          <span
            class="mr-1 block h-10 w-10 mt-2 rounded bg-[var(--skeleton-light)] subtle-pulse dark:bg-[var(--skeleton-dark)]"></span>
          <span
            class="block h-7 w-19 mt-2 rounded bg-[var(--skeleton-light)] subtle-pulse dark:bg-[var(--skeleton-dark)]"></span>
        </template>
        <template v-else>
          <Icon
            icon="material-symbols-light:font-download-outline-rounded"
            :class="[
              'relative top-0.5 text-5xl text-[var(--green-accent-light)] dark:text-[var(--green-accent-dark)] duration-300 ease-in-out',
              { 'rotate-90': isIconRotated },
            ]" />
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
          class="mx-auto mt-2 block h-5 w-53 rounded bg-[var(--skeleton-light)] subtle-pulse dark:bg-[var(--skeleton-dark)]"></span>
      </template>
      <template v-else> Personal job application tracker </template>
    </p>
    <Divider label="crud" labelPosition="bottom" />
  </Container>
</template>
