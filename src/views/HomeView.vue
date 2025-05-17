<script setup lang="ts">
import Container from "@/components/Container.vue";
import applying from "@/assets/animations/applying.json"
import { Vue3Lottie } from "vue3-lottie";
</script>


<template>
  <Container>
    <div class="flex flex-col flex-grow items-center justify-center min-h-screen w-full">
      <!-- divider line and label for lottie -->
      <div class="sm:block sm:w-full flex flex-row items-center">
        <p class="text-tiny text-center text-orientation tracking-wider">lottie</p>
        <div class="tiny-border h-12 w-px sm:w-full sm:h-px"></div>
      </div>

      <!-- lottie and app-name -->
      <div class="w-3/4 lg:w-1/2 xl:w-1/3 flex flex-col items-center p-1 ">
        <Vue3Lottie :animationData="applying" :loop="true" :autoplay="true" :speed="0.6" />
        <h1 class="text-3xl text-center">Applied</h1>
      </div>



      <!-- later.. -->

      <div class="flex flex-col items-center text-2xl font-bold text-center rounded-lg ">
        <div class="flex flex-center h-60 w-150 border border-color">
          stats
        </div>
      </div>
      <!-- divider line and label for lottie -->
      <div class="sm:block sm:w-full flex flex-row items-center">
        <div class="tiny-border h-12 w-px sm:w-full sm:h-px"></div>
        <p class="text-tiny text-center text-orientation tracking-wider">stats</p>
      </div>
    </div>
  </Container>
</template>
