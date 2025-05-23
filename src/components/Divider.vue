<script setup lang="ts">
defineProps({
  label: String,
  labelPosition: {
    type: String,
    default: "top", // or 'bottom'
    validator: (val: string) => ["top", "bottom"].includes(val),
  },
});
</script>

<template>
  <!-- divider line and label -->
  <div class="hidden w-full sm:block">
    <template v-if="labelPosition === 'top'">
      <p v-if="label" class="tracking-wider text-center text-tiny">
        {{ label }}
      </p>
      <div class="w-full h-px tiny-border" />
    </template>
    <template v-else>
      <div class="w-full h-px tiny-border" />
      <p v-if="label" class="tracking-wider text-center text-tiny">
        {{ label }}
      </p>
    </template>
  </div>
</template>
