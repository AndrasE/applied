<script setup lang="ts">
defineProps({
  label: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <h1 class="mt-4 mb-0 text-2xl text-center sm:mb-3 sm:mt-4">
    {{ label }}
  </h1>
</template>
