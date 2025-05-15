<script setup lang="ts">
import Container from "@/components/Container.vue";
import applying from "@/assets/animations/applying.json"
import { Vue3Lottie } from "vue3-lottie";
</script>


<template>
  <Container>
    <div class="grid grid-cols-1 gap-4 p-4 center">
      <div>
        <Vue3Lottie :animationData="applying" class="w-1/2 h-1/2" :loop="true" :autoplay="true" :speed="0.6" />
        <h1 class="text-4xl font-bold">Applied</h1>
      </div>
      <div class="text-2xl font-bold text-center">
        <p class="text-lg">This is a simple application using Vue 3 and Lottie animations.</p>
      </div>
    </div>
    </ Container>
</template>
