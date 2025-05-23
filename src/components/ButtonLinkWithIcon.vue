<script setup lang="ts">
import { RouterLink } from "vue-router";
import { Icon } from "@iconify/vue";

//polymorphic component reusable component that supports both RouterLink and button style remains the same unless added custom class
const props = defineProps<{
  to?: string;
  label: string;
  icon?: string;
  iconPosition?: "left" | "right";
  as?: "link" | "button";
  onClick?: () => void;
  customClass?: string;
}>();

const tagType = props.as === "button" ? "button" : RouterLink;

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
      'inline-flex items-center gap-1 text-sm text-green-500 group dark:text-green-300 hover:underline',
      customClass,
    ]">
    <Icon
      v-if="iconPosition === 'left'"
      :icon="icon ?? ''"
      class="inline-block transition-opacity duration-200 transform opacity-0 group-hover:opacity-100" />
    {{ label }}
    <Icon
      v-if="iconPosition !== 'left'"
      :icon="icon ?? ''"
      class="inline-block transition-opacity duration-200 transform opacity-0 group-hover:opacity-100" />
  </component>
</template>
