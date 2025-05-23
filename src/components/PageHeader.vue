<script setup lang="ts">
defineProps({
  label: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <h1 class="mt-3 mb-0 text-2xl text-center sm:mb-5 sm:mt-3">
    {{ label }}
  </h1>
</template>
