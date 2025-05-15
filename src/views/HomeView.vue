<script setup lang="ts">
import Container from "@/components/Container.vue";
import applying from "@/assets/animations/applying.json"
import { Vue3Lottie } from "vue3-lottie";
</script>


<template>
  <Container>
    <main class="bg-black-900 w-full text-green-700 border-y-1 border-solid border-color">
      <h1 class="text-3xl font-bold">Home</h1>
      <Vue3Lottie :animationData="applying" class="w-1/2 h-1/2" :loop="true" :autoplay="true" :speed="0.6" />
    </main>
    </ Container>
</template>
