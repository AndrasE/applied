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
    <PageHeader label="Job details" />

    <div class="flex flex-col items-center justify-between w-full margin950">
      <Divider label="editable" labelPosition="top" />

      <JobCard
        editable
        class="w-full"
        :key="job.id"
        :job="job"
        :showLinkButton="false" />

      <Divider label="prev list" labelPosition="bottom" />
      <ButtonLinkWithIcon
        as="link"
        :to="`/jobs`"
        iconPosition="left"
        label="Back to job listings"
        icon="heroicons-solid:arrow-left"
        customClass="relative right-3 pb-9 sm:py-5" />
    </div>
  </Container>

  <p v-else class="p-6">Job not found.</p>
</template>
