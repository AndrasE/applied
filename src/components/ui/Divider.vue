<script setup lang="ts">
// Props for the Divider component:
// - label: optional text to display above or below the divider line
// - labelPosition: controls whether the label appears on 'top' or 'bottom' (default: 'top')
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
  <!-- Purely visual divider line and optional label for section separation -->
  <div aria-hidden="true" class="hidden w-full sm:block">
    <template v-if="labelPosition === 'top'">
      <!-- Label above the divider line -->
      <p v-if="label" aria-hidden="true" class="text-center text-tiny">
        {{ label }}
      </p>
      <div role="presentation" class="w-full h-px tiny-border" />
    </template>
    <template v-else>
      <!-- Label below the divider line -->
      <div role="presentation" class="w-full h-px tiny-border" />
      <p v-if="label" aria-hidden="true" class="text-center text-tiny">
        {{ label }}
      </p>
    </template>
  </div>
</template>
