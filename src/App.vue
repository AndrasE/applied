<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from '@/components/Navbar.vue';
</script>

<template>
  <Navbar />

  <transition name="fade" mode="out-in">
    <RouterView :key="$route.fullPath" />
  </transition>
</template>
