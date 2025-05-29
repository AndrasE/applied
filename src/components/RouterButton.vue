<script setup lang="ts">
import { RouterLink } from "vue-router";
import { Icon } from "@iconify/vue";

const props = withDefaults(
  defineProps<{
    to?: string;
    onClick?: () => void;
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

// Neccessary if onClick is not directly referenced, it won’t be triggered. Even though onClick is defined and passed, this syntax won’t work properly. See at JobsView.vue
const handleClick = (event: MouseEvent) => {
  if (props.onClick) {
    props.onClick();
  }
};
</script>

<template>
  <component
    :is="to ? RouterLink : 'span'"
    :to="to || undefined"
    @click="handleClick"
    :class="[
      'relative inline-flex items-center justify-center text-sm text-green-700 group dark:text-green-300 hover:underline cursor-pointer',
      customClass,
    ]">
    <!-- Label (centered text) -->
    <span class="text-center">
      {{ label }}
    </span>

    <!-- Icon on left -->
    <Icon
      v-if="icon && iconPosition === 'left'"
      :icon="icon"
      role="presentation"
      aria-hidden="true"
      class="absolute left-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

    <!-- Icon on right -->
    <Icon
      v-if="icon && iconPosition !== 'left'"
      :icon="icon"
      role="presentation"
      aria-hidden="true"
      class="absolute right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
  </component>
</template>
