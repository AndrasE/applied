<script setup lang="ts">
import Container from "@/components/Container.vue";
import applying from "@/assets/animations/applying.json"
import { Vue3Lottie } from "vue3-lottie";
</script>


<template>
  <Container>
    <div class="flex flex-col flex-grow items-center justify-center min-h-screen w-full">
      <!-- divider line and label for lottie -->
      <span class="text-tiny">lottie</span>
      <hr class="border-t w-full" />

      <!-- lottie and app-name -->
      <div class="w-3/4 lg:w-1/2 xl:w-1/3 flex flex-col items-center p-1 ">
        <Vue3Lottie :animationData="applying" :loop="true" :autoplay="true" :speed="0.6" />
        <h1 class="text-3xl font-bold text-center">Applied</h1>
      </div>



      <!-- later.. -->

      <div class="flex flex-col items-center text-2xl font-bold text-center rounded-lg ">
        <p class="text-lg">This is a simple application using Vue 3 and Lottie animations.</p>
      </div>
      <!-- divider line and label for lottie -->
      <hr class="border-t w-full" />
      <span class="text-tiny">progress</span>
    </div>
  </Container>
</template>
