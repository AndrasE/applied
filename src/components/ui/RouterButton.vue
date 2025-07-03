<script setup lang="ts">
import { RouterLink } from "vue-router";
import { Icon } from "@iconify/vue";
import type { RouteLocationRaw } from "vue-router";

// Props for the RouterButton component:
// - to: optional route location (string or RouteLocationRaw)
// - onClick: optional click handler function
// - label: button text (required)
// - icon: optional icon name for Iconify
// - iconPosition: 'left' or 'right' (default: 'right')
// - customClass: optional extra classes for styling
const props = withDefaults(
  defineProps<{
    to?: string | RouteLocationRaw; // Allow both string and RouteLocationRaw for flexibility
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

// Ensures the onClick handler is called when the button is clicked
// (workaround for Vue's event handling with dynamic components)
const handleClick = (event: MouseEvent) => {
  if (props.onClick) {
    props.onClick();
  }
};
</script>

<template>
  <!--
    RouterButton: Flexible button or router link with optional icon.
    - Renders as a RouterLink if 'to' is provided, otherwise as a span
    - Supports left/right icon, label, and custom classes
    - Handles click events for both navigation and custom logic
  -->
  <component
    role="button"
    :is="to ? RouterLink : 'span'"
    :to="to || undefined"
    :onclick="handleClick"
    :class="[
      'inline-flex items-center text-sm group gap-1 hover:underline cursor-pointer text-[var(--green-accent-light)] dark:text-[var(--green-accent-dark)]',
      customClass,
    ]">
    <!-- Left icon (if specified) -->
    <Icon
      v-if="icon && iconPosition === 'left'"
      :icon="icon"
      role="presentation"
      aria-hidden="true"
      class="inline-block transition-opacity duration-200 transform opacity-0 group-hover:opacity-100" />
    <span>
      {{ label }}
    </span>
    <!-- Right icon (if specified) -->
    <Icon
      v-if="icon && iconPosition !== 'left'"
      :icon="icon"
      role="presentation"
      aria-hidden="true"
      class="inline-block transition-opacity duration-200 transform opacity-0 group-hover:opacity-100" />
  </component>
</template>
