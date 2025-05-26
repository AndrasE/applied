<script setup lang="ts">
import { Icon } from "@iconify/vue";

const { label, icon, onClick, customClass } = defineProps<{
  label: string;
  icon?: string;
  outlineBtn?: boolean;
  deleteBtn?: boolean;
  onClick?: () => void;
  customClass?: string;
}>();

const handleClick = (event: MouseEvent) => {
  if (onClick) onClick();
};
</script>

<template>
  <component
    v-if="!outlineBtn"
    type="button"
    :is="'button'"
    @click="handleClick"
    :class="[
      'inline-flex items-center gap-1 text-sm text-green-700 group dark:text-green-300 hover:underline cursor-pointer',
      customClass,
    ]">
    {{ label }}
    <Icon
      role="presentation"
      :icon="icon ?? ''"
      class="inline-block transition-opacity duration-200 transform opacity-0 group-hover:opacity-100" />
  </component>
  <component
    v-else
    type="button"
    :is="'button'"
    @click="handleClick"
    :class="[
      'inline-flex items-center gap-1 text-sm cursor-pointer border rounded py-0.5 px-1 mx-1  text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-300/10  hover:dark:bg-green-700 hover:bg-green-300 hover:text-slate-800 hover:dark:text-slate-200',
      customClass,
    ]">
    {{ label }}
  </component>
</template>
