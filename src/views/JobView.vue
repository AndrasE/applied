<script setup lang="ts">
import { useRoute } from "vue-router";
import Container from "@/components/Container.vue";
import { Icon } from "@iconify/vue";
import jobs from "@/data/jobs.json";
import Divider from "@/components/Divider.vue";
import PageHeader from "@/components/PageHeader.vue";

const route = useRoute();
const jobId = Number(route.params.id); // "1", "2", …

const job = jobs.find((j) => j.id === jobId); // look‑up the one listing
</script>

<template>
  <Container v-if="job">
    <div class="flex flex-col h-full sm:items-center">
      <PageHeader label="Job details" />

      <Divider label="flex flex-col" labelPosition="top" />

      <div
        class="flex flex-col items-center justify-start h-full sm:justify-center">
        <!-- job details -->
        <div
          class="p-4 m-3 border rounded border-color xs:w-full md:w-3/4 xl:w-1/2">
          <h2 class="mb-1 text-lg">{{ job.title }}</h2>
          <p class="mb-2 text-sm">{{ job.company }}</p>
          <p class="mb-3 text-sm text-justify break-all word-break:">
            {{ job.description }}
          </p>
        </div>
        <Divider label="prev list" labelPosition="bottom" />
        <RouterLink
          :to="`/jobs`"
          class="inline-flex items-center gap-1 mb-8 text-sm text-green-500 group sm:mb-4 dark:text-green-300 hover:underline">
          <Icon
            icon="heroicons-outline:arrow-left"
            class="inline-block transition-opacity duration-200 transform opacity-0 group-hover:opacity-100" />
          Back to all
        </RouterLink>
      </div>
    </div>
  </Container>

  <p v-else class="p-6">Job not found.</p>
</template>
