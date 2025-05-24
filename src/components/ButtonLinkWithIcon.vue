<script setup lang="ts">
import { RouterLink } from "vue-router";
import { Icon } from "@iconify/vue";

//Polymorphic component reusable component that supports both RouterLink and Button tags while style remains the same unless added custom class

// Props
// to: string | undefined; // URL to navigate to when the component is a link
// label: string; // Text to display on the button or link
// icon: string | undefined; // Icon to display
// iconPosition: "left" | "right"; // Position of the icon relative to the label
// as: "link" | "button"; // Determines if the component is a link or button
// onClick: () => void | undefined; // Function to call when the button is clicked
const props = withDefaults(
  defineProps<{
    to?: string;
    label: string;
    icon?: string;
    iconPosition?: "left" | "right";
    as?: "link" | "button";
    onClick?: () => void;
    customClass?: string;
  }>(),
  {
    iconPosition: "right", // Default icon position
    as: "link", // Default to link
  }
);
// Default values for props as either link or button
const tagType = props.as === "button" ? "button" : RouterLink;

// Neccessary if onClick is not directly referenced, it won’t be triggered. Even though onClick is defined and passed, this syntax won’t work properly. See at JobsView.vue
const handleClick = (event: MouseEvent) => {
  if (props.as === "button" && props.onClick) {
    props.onClick();
  }
};
</script>

<template>
  <component
    :is="tagType"
    :to="as === 'link' ? to : undefined"
    @click="handleClick"
    :class="[
      'inline-flex items-center gap-1 text-sm text-green-600 group dark:text-green-300 hover:underline',
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
