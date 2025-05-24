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
  <!-- purely visual divider line and label -->
  <div aria-hidden="true" class="hidden w-full sm:block">
    <template v-if="labelPosition === 'top'">
      <p
        v-if="label"
        aria-hidden="true"
        class="tracking-wider text-center text-tiny">
        {{ label }}
      </p>
      <div role="presentation" class="w-full h-px tiny-border" />
    </template>
    <template v-else>
      <div role="presentation" class="w-full h-px tiny-border" />
      <p
        v-if="label"
        aria-hidden="true"
        class="tracking-wider text-center text-tiny">
        {{ label }}
      </p>
    </template>
  </div>
</template>
