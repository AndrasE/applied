<script setup lang="ts">
import Navbar from "@/components/ui/Navbar.vue";
import NavPopup from "./components/ui/NavPopup.vue";
import { ref } from "vue";
import { RouterView } from "vue-router";

const navPopupRef = ref<InstanceType<typeof NavPopup> | null>(null);

const handleGlobalPopup = () => {
  if (navPopupRef.value) {
    navPopupRef.value.openPopup(); // Calls the openPopup method on NavPopup
  }
};
</script>

<template>
  <Navbar @open-popup="handleGlobalPopup" />

  <NavPopup ref="navPopupRef" />

  <RouterView v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" :key="$route.fullPath" />
    </transition>
  </RouterView>
</template>
