<script setup lang="ts">
import { RouterLink } from "vue-router";
import { Icon } from "@iconify/vue";

const props = defineProps<{
  to: string;
  label: string;
  icon?: string;
  iconPosition?: "left" | "right";
  customClass?: string;
}>();

const iconName = props.icon ?? "heroicons-outline:arrow-right";
const iconLeft = props.iconPosition === "left";
</script>

<template>
  <RouterLink
    :to="to"
    :class="[
      'inline-flex items-center gap-1 text-sm text-green-500 group dark:text-green-300 hover:underline',
      customClass,
    ]">
    <Icon
      v-if="iconLeft"
      :icon="iconName"
      class="inline-block transition-opacity duration-200 transform opacity-0 group-hover:opacity-100" />
    {{ label }}
    <Icon
      v-if="!iconLeft"
      :icon="iconName"
      class="inline-block transition-opacity duration-200 transform opacity-0 group-hover:opacity-100" />
  </RouterLink>
</template>
