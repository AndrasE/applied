<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { RouterLink } from "vue-router";
import RouterLinkWithIcon from "./RouterLinkWithIcon.vue";

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
    <RouterLinkWithIcon :to="`/jobs/${job.id}`" label="Read more" />
  </div>
</template>
