<script setup lang="ts">
import { RouterView } from "vue-router";
import Navbar from "@/components/ui/Navbar.vue";
</script>

<template>
  <Navbar />

  <RouterView v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" :key="$route.fullPath" />
    </transition>
  </RouterView>
</template>
