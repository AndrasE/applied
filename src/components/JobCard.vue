<script setup lang="ts">
import { computed } from "vue";
import ButtonLinkWithIcon from "./ButtonLinkWithIcon.vue";

interface Job {
  id: number;
  title: string;
  description: string;
  company: string;
  link: string;
}

const props = defineProps<{
  job: Job;
  charLimit?: number;
  showLinkButton?: boolean;
  icon?: string;
}>();

const limit = computed(() => props.charLimit ?? props.job.description.length);
</script>

<template>
  <div class="p-4 border rounded shadow border-color">
    <h2 class="mb-1 text-lg">{{ job.title }}</h2>
    <p class="mb-2 text-sm">{{ job.company }}</p>
    <p class="mb-2 text-sm text-justify break-words">
      {{ job.description.slice(0, limit)
      }}{{ job.description.length > limit ? "..." : "" }}
    </p>
    <ButtonLinkWithIcon
      v-if="showLinkButton !== false"
      as="link"
      :to="`/jobs/${job.id}`"
      label="Read more"
      :icon="'heroicons:arrow-right'" />
  </div>
</template>
