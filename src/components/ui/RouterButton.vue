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
    role="button"
    :is="to ? RouterLink : 'span'"
    :to="to || undefined"
    :onclick="handleClick"
    :class="[
      'inline-flex items-center text-sm group gap-1 hover:underline cursor-pointer text-[var(--green-accent-light)] dark:text-[var(--green-accent-dark)]',
      customClass,
    ]">
    <Icon
      v-if="icon && iconPosition === 'left'"
      :icon="icon"
      role="presentation"
      aria-hidden="true"
      class="inline-block transition-opacity duration-200 transform opacity-0 group-hover:opacity-100" />
    <span>
      {{ label }}
    </span>
    <Icon
      v-if="icon && iconPosition !== 'left'"
      :icon="icon"
      role="presentation"
      aria-hidden="true"
      class="inline-block transition-opacity duration-200 transform opacity-0 group-hover:opacity-100" />
  </component>
</template>
