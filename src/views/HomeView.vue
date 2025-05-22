<script setup lang="ts">
import Container from "@/components/Container.vue";
import applying from "@/assets/animations/applying.json"
import { Vue3Lottie } from "vue3-lottie";
import { Icon } from "@iconify/vue";

</script>


<template>
  <Container>
    <div class="flex flex-col  items-center justify-center ">
      <!-- divider line and label for lottie -->
      <div class="block w-full">
        <p class="text-tiny text-center tracking-wider">vue3lottie</p>
        <div class="tiny-border h-px w-full"></div>
      </div>

      <!-- lottie and app-name -->
      <div class="w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl  flex flex-col items-center p-1 ">
        <Vue3Lottie :animationData="applying" :loop="true" :autoplay="true" :speed="0.6" />
        <h1 class="text-2xl text-center flex items-center justify-center">
          <Icon icon="material-symbols-light:font-download-outline-rounded"
            class="relative top-0.5 text-5xl dark:text-green-300 text-green-400 hover:rotate-90 ease-in-out duration-300" />
          <span class="relative right-1 underline decoration-green-400 dark:decoration-green-300">pplied</span>
        </h1>
      </div>



      <!-- later.. -->

      <div class="flex flex-col items-center text-2xl text-center rounded-lg ">
        <div class="flex flex-center h-40 w-100 border-t border-x  border-color">
          stats
        </div>
      </div>

      <!-- divider line and label for lottie -->
      <div class="block w-full">
        <div class="tiny-border h-px w-full"></div>
        <p class="text-tiny text-center tracking-wider">stats comin up</p>
      </div>
    </div>
  </Container>
</template>
