<script setup lang="ts">
// JobCardView.vue: Read-only card for viewing job details
import { computed } from "vue";
import RouterButton from "../ui/RouterButton.vue";
import type { Job } from "../../types/job";
import { Icon } from "@iconify/vue";

const props = defineProps<{
  job: Job;
}>();

// Status text class for different job statuses
const statusTextClass = computed(() => {
  switch (props.job.status ?? "unknown") {
    case "applied":
      return "bg-[var(--green-accent-light)] dark:bg-[var(--green-accent-dark)] text-[var(--bg-light)] dark:text-[var(--bg-dark)] px-0.5 rounded-sm mt-1.5 sm:mt-0";
    case "1st round":
    case "2nd round":
    case "3rd round":
      return "bg-yellow-500 dark:bg-yellow-200 rounded text-[var(--bg-light)] dark:text-[var(--bg-dark)] px-0.5 rounded-sm mt-1.5 sm:mt-0";
    case "no response":
    case "rejected":
      return "bg-red-500 dark:bg-red-400 text-[var(--bg-light)] dark:text-[var(--bg-dark)] px-0.5 rounded-sm mt-1.5 sm:mt-0";
    case "job offer":
      return "bg-[var(--green-accent-light)] dark:bg-[var(--green-accent-dark)] text-[var(--bg-light)] dark:text-[var(--bg-dark)] px-0.5 rounded-sm mt-1.5 sm:mt-0";
    default:
      return "bg-gray-500 dark:bg-gray-400 text-[var(--bg-light)] dark:text-[var(--bg-dark)] px-0.5 rounded-sm mt-1.5 sm:mt-0";
  }
});
</script>

<template>
  <div class="flex items-start justify-between">
    <h2 class="w-full mb-1 text-lg break-words">{{ job.title }}</h2>
    <div class="flex flex-col items-end">
      <!-- Status label for job status -->
      <span
        class="flex items-center ml-2 text-xs whitespace-nowrap"
        :class="statusTextClass">
        {{ job.status ?? "unknown" }}
      </span>
      <span class="text-xs">{{ job.date }}</span>
    </div>
  </div>

  <div class="flex items-center justify-between">
    <p class="mb-2 text-sm">
      {{ job.company }}
    </p>
    <a
      v-if="job.link"
      :href="job.link"
      target="_blank"
      rel="noopener noreferrer">
      <Icon
        :aria-label="job.link"
        icon="heroicons-solid:link"
        class="w-4 h-4 text-hover" />
    </a>
  </div>

  <p class="text-sm text-justify break-words">{{ job.description }}</p>

  <div class="flex justify-end flex-1 gap-2">
    <!-- Button to update job -->
    <RouterButton
      :to="`/jobs/${job.id}/update`"
      label="Update job"
      icon="heroicons-solid:pencil-alt"
      icon-position="left"
      custom-class="pt-2" />
  </div>
</template>
