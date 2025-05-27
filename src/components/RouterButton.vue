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
    iconPosition: "right",
  }
);
</script>

<template>
  <component
    :is="to ? RouterLink : 'span'"
    :to="to || undefined"
    :class="[
      'inline-flex items-center gap-1 text-sm text-green-700 group dark:text-green-300 hover:underline cursor-pointer',
      customClass,
    ]">
    <Icon
      v-if="icon && iconPosition === 'left'"
      :icon="icon"
      role="presentation"
      aria-hidden="true"
      class="inline-block transition-opacity duration-200 transform opacity-0 group-hover:opacity-100" />
    {{ label }}
    <Icon
      v-if="icon && iconPosition !== 'left'"
      :icon="icon"
      role="presentation"
      aria-hidden="true"
      class="inline-block transition-opacity duration-200 transform opacity-0 group-hover:opacity-100" />
  </component>
</template>
