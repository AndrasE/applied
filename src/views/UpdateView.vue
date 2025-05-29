<script setup lang="ts">
import { useRoute } from "vue-router";
import Container from "@/components/Container.vue";
import jobs from "@/data/jobs.json";
import Divider from "@/components/Divider.vue";
import PageHeader from "@/components/PageHeader.vue";
import JobCard from "@/components/JobCard.vue";
import ButtonLinkWithIcon from "@/components/ButtonLinkWithIcon.vue";

const route = useRoute();
const jobId = Number(route.params.id);
const isValidId = !isNaN(jobId);

const job = isValidId ? jobs.find((j) => j.id === jobId) : null;
</script>

<template>
  <Container v-if="job">
    <PageHeader label="Update job" />
    <Divider label="editing mode" labelPosition="top" />

    <div class="flex flex-col items-center w-full justify-between margin950">
      <JobCard
        viewingMode="editing"
        class="w-full sm:border-0"
        :key="job.id"
        :job="job" />
    </div>
    <Divider label="prev list" labelPosition="bottom" />
    <ButtonLinkWithIcon
      as="link"
      :to="`/jobs`"
      iconPosition="left"
      label="Back to job listings"
      icon="heroicons-solid:arrow-left" />
  </Container>

  <p v-else class="p-6">Job not found.</p>
</template>
