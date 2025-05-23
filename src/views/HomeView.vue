<script setup lang="ts">
import Container from "@/components/Container.vue";
import Divider from "@/components/Divider.vue";
import applying from "@/assets/animations/applying.json";
import { Vue3Lottie } from "vue3-lottie";
import { Icon } from "@iconify/vue";
</script>

<template>
  <Container>
    <div class="flex flex-col items-center justify-center">
      <Divider label="vue3lottie" labelPosition="top" />

      <!-- lottie and app-name -->
      <div
        class="flex flex-col items-center w-full max-w-sm p-1 md:max-w-md lg:max-w-lg xl:max-w-xl">
        <Vue3Lottie
          :animationData="applying"
          :loop="true"
          :autoplay="true"
          :speed="0.6" />
        <h1 class="flex items-center justify-center text-2xl text-center">
          <Icon
            icon="material-symbols-light:font-download-outline-rounded"
            class="relative top-0.5 text-5xl dark:text-green-300 text-green-400 hover:rotate-90 ease-in-out duration-300" />
          <span
            class="relative underline right-1 decoration-green-400 dark:decoration-green-300"
            >pplied</span
          >
        </h1>
      </div>

      <!-- later.. -->

      <div
        class="flex flex-col items-center w-full max-w-sm p-1 text-center border-t rounded-lg md:max-w-md lg:max-w-lg xl:max-w-xl border-x border-color">
        stats
      </div>

      <Divider label="stats" labelPosition="bottom" />
    </div>
  </Container>
</template>
