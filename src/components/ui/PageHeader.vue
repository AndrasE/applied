<script setup lang="ts">
// Props for the PageHeader component:
// - label: required string to display as the page title
defineProps({
  label: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <!--
    PageHeader: Simple centered page title header.
    - Displays the provided label prop as an <h1>
    - Uses flex utilities for centering
  -->
  <div class="flex items-center justify-center text-center h-15">
    <h1 class="text-2xl">
      {{ label }}
    </h1>
  </div>
</template>
