<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { RouterLink } from "vue-router";

interface Job {
  id: number;
  title: string;
  description: string;
  company: string;
  link: string;
}
defineProps<{
  job: Job;
  charLimit: number;
}>();
</script>

<template>
  <div class="p-4 border rounded shadow border-color">
    <h2 class="mb-1 text-lg">{{ job.title }}</h2>
    <p class="mb-2 text-sm">{{ job.company }}</p>
    <p class="mb-3 text-sm text-justify break-words">
      {{ job.description.slice(0, charLimit)
      }}{{ job.description.length > charLimit ? "..." : "" }}
    </p>
    <RouterLink
      :to="`/jobs/${job.id}`"
      class="inline-flex items-center gap-1 text-sm text-green-500 group dark:text-green-300 hover:underline">
      Read more
      <Icon
        icon="heroicons-outline:arrow-right"
        class="inline-block transition-opacity duration-200 transform opacity-0 group-hover:opacity-100" />
    </RouterLink>
  </div>
</template>
