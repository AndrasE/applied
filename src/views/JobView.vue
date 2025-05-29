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

    <Divider label="viewing mode" labelPosition="top" />
    <div class="flex flex-col items-center justify-between gap-4 margin950">
      <JobCard viewingMode="viewing" :key="job.id" :job="job" />

      <Divider label="prev list" labelPosition="bottom" />
      <div class="flex justify-center my-5 bg-yellow-800">
        <RouterButton
          :to="`/jobs`"
          iconPosition="left"
          label="Back to job listings"
          icon="heroicons-solid:arrow-left"
          customClass="pd-3 " />
      </div>
    </div>
  </Container>

  <p v-else class="p-6">Job not found.</p>
</template>
