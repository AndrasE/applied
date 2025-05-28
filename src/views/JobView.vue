<script setup lang="ts">
import { useRoute } from "vue-router";
import Container from "@/components/Container.vue";
import jobs from "@/data/jobs.json";
import Divider from "@/components/Divider.vue";
import PageHeader from "@/components/PageHeader.vue";
import JobCard from "@/components/JobCard.vue";
import RouterButton from "@/components/RouterButton.vue";

const route = useRoute();
const jobId = Number(route.params.id);
const isValidId = !isNaN(jobId);

const job = isValidId ? jobs.find((j) => j.id === jobId) : null;
</script>

<template>
  <Container v-if="job">
    <PageHeader label="Job details" />

    <div class="flex flex-col items-center justify-between margin950">
      <Divider label="viewing mode" labelPosition="top" />

      <JobCard viewingMode="viewing" :key="job.id" :job="job" />

      <Divider label="prev list" labelPosition="bottom" />

      <RouterButton
        :to="`/jobs`"
        iconPosition="left"
        label="Back to job listings"
        icon="heroicons-solid:arrow-left"
        customClass="relative right-3  sm:py-5" />
    </div>
  </Container>

  <p v-else class="p-6">Job not found.</p>
</template>
