<script setup lang="ts">
defineProps({
  label: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div class="flex items-center justify-center text-center h-15">
    <h1 class="text-2xl">
      {{ label }}
    </h1>
  </div>
</template>
