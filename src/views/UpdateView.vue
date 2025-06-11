<script setup lang="ts">
import { useRoute } from "vue-router";
import Container from "@/components/ui/Container.vue";
import Divider from "@/components/ui/Divider.vue";
import PageHeader from "@/components/ui/PageHeader.vue";
import JobCard from "@/components/job-cards/JobCard.vue";
import RouterButton from "@/components/ui/RouterButton.vue";
import jobs from "@/data/jobs.json";
import type { JobStatus } from "@/types/job";

const route = useRoute();
const jobId = Number(route.params.id);
const isValidId = !isNaN(jobId);

// Ensure jobs are typed correctly and status is of the correct type
const job = isValidId
  ? (() => {
      const found = jobs.find((j) => j.id === jobId);
      if (!found) return null;
      // Ensure status is of the correct type
      return {
        ...found,
        status: (found.status as JobStatus) ?? undefined,
      };
    })()
  : null;
</script>

<template>
  <Container v-if="job">
    <PageHeader label="Update job" />
    <Divider label="editing mode" labelPosition="top" />

    <div
      class="flex flex-col items-center w-full justify-between margin950and640 4border-color">
      <JobCard
        viewingMode="editing"
        class="w-full border-0 border-b sm:border-0 rounded-none pb-3 sm:pb-0 pt-0"
        :key="job.id"
        :job="job" />
    </div>
    <Divider label="prev list" labelPosition="bottom" />
    <RouterButton
      as="link"
      :to="`/jobs/${job.id}`"
      iconPosition="left"
      label="Cancel and go back "
      icon="heroicons-solid:arrow-left"
      customClass="pr-5 py-4 " />
  </Container>

  <p v-else class="p-6">Job not found.</p>
</template>
