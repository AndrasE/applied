<script setup lang="ts">
import { RouterLink } from "vue-router";
import { Icon } from "@iconify/vue";

const props = withDefaults(
  defineProps<{
    to?: string;
    label: string;
    icon?: string;
    iconPosition?: "left" | "right";
    customClass?: string;
  }>(),
  {
    to: "",
    iconPosition: "right", // Default icon position
  }
);
</script>

<template>
  <component
    :is="RouterLink"
    :to="to"
    :class="[
      'inline-flex items-center gap-1 text-sm text-green-700 group dark:text-green-300 hover:underline',
      customClass,
    ]">
    <Icon
      role="presentation"
      v-if="iconPosition === 'left'"
      :icon="icon ?? ''"
      class="inline-block transition-opacity duration-200 transform opacity-0 group-hover:opacity-100" />
    {{ label }}
    <Icon
      role="presentation"
      v-if="iconPosition !== 'left'"
      :icon="icon ?? ''"
      class="inline-block transition-opacity duration-200 transform opacity-0 group-hover:opacity-100" />
  </component>
</template>
