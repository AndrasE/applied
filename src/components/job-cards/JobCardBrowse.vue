<script setup lang="ts">
import { computed } from "vue";
import RouterButton from "../ui/RouterButton.vue";
import { Icon } from "@iconify/vue";
import type { Job } from "../../types/job";

const props = defineProps<{
  job: Job;
  charLimit?: number;
  statusIconCustomClass?: string;
}>();

// Character limit for description or fallback to full length
const limit = computed(() =>
  props.charLimit != null ? props.charLimit : props.job.description.length
);

// Truncate description based on character limit
const truncatedDescription = computed(() => {
  const desc = props.job.description;
  return desc.length > limit.value ? desc.slice(0, limit.value) + "..." : desc;
});

// Status icon mapping (copied from your original JobCard)
const statusIconInfo = computed(() => {
  switch (props.job.status ?? "unknown") {
    case "applied":
      return {
        icon: "heroicons:check-circle",
        label: "Applied",
        class:
          "text-[var(--green-accent-light)] dark:text-[var(--green-accent-dark)]",
      };
    case "1st round":
    case "2nd round":
    case "3rd round":
      return {
        icon: "heroicons:exclamation-circle",
        label: "Interview round",
        class: "text-yellow-500 dark:text-yellow-200 text-2xl",
      };
    case "rejected":
      return {
        icon: "heroicons:x-circle",
        label: "Rejected",
        class: "text-red-500 dark:text-red-400 text-2xl",
      };
    case "no response":
      return {
        icon: "heroicons:minus-circle",
        label: "No response",
        class: "text-red-500 dark:text-red-400 text-2xl",
      };
    case "job offer":
      return {
        icon: "heroicons:sparkles",
        label: "job offer",
        class:
          "text-[var(--green-accent-light)] dark:text-[var(--green-accent-dark)]",
      };
    default:
      return {
        icon: "heroicons:question-mark-circle",
        label: "",
        class: "text-gray-500 dark:text-gray-400 text-2xl",
      };
  }
});
</script>

<template>
  <div class="flex items-start justify-between">
    <h2 class="w-full mb-1 text-lg">{{ job.title }}</h2>
    <div class="flex flex-col items-end">
      <Icon
        :aria-label="statusIconInfo.label"
        :icon="statusIconInfo.icon"
        :class="[statusIconCustomClass, statusIconInfo.class]" />
    </div>
  </div>

  <p class="mb-2 text-sm">{{ job.company }}</p>

  <p class="text-sm text-justify break-words">{{ truncatedDescription }}</p>

  <div class="flex">
    <RouterButton
      as="link"
      :to="{
        name: 'jobDetail',
        params: { id: job.id },
      }"
      label="Read more"
      icon="heroicons-solid:arrow-right"
      custom-class="pt-2" />
  </div>
</template>
