<script setup lang="ts">
import { computed } from "vue";
import { Icon } from "@iconify/vue";

const props = defineProps<{
  label: string;
  icon?: string;
  customClass?: string;
  deleteBtn?: boolean;
  outlineBtn?: boolean;
}>();

function handleClick() {
  // click handler logic
}

const buttonClass = computed(() => {
  if (!props.outlineBtn) {
    return [
      "inline-flex items-center gap-1 text-sm text-green-700 group dark:text-green-300 hover:underline cursor-pointer",
      props.customClass,
    ];
  }

  const base =
    "inline-flex items-center gap-1 text-sm cursor-pointer border rounded py-1 px-2 mx-1 ease-in-out duration-200";
  const theme = props.deleteBtn
    ? "text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-300/10 hover:dark:bg-red-500 hover:bg-red-300 hover:text-slate-800 hover:dark:text-slate-200"
    : "text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-300/10 hover:dark:bg-green-600 hover:bg-green-300 hover:text-slate-800 hover:dark:text-slate-200";
  return [base, theme, props.customClass];
});
</script>

<template>
  <component
    :is="'button'"
    type="button"
    @click="handleClick"
    :class="buttonClass">
    {{ label }}
    <Icon
      v-if="icon && !outlineBtn"
      :icon="icon"
      class="inline-block transition-opacity duration-200 transform opacity-0 group-hover:opacity-100" />
  </component>
</template>
