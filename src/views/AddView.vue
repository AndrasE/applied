<script setup lang="ts">
import { ref } from "vue";
import Container from "@/components/Container.vue";
import JobCard from "@/components/JobCard.vue";
import RouterButton from "@/components/RouterButton.vue";

interface Job {
  id: number;
  title: string;
  description: string;
  company: string;
  link: string;
}

const job = ref<Job>({
  id: 0,
  title: "",
  description: "",
  company: "",
  link: "",
});
</script>

<template>
  <Container>
    <main
      class="w-full text-green-700 border-solid bg-black-900 border-y-1 border-color">
      <h1 class="text-3xl font-bold">Add</h1>
      <JobCard viewingMode="adding" :key="job.id" :job="job" />

      <RouterButton
        to="/jobs"
        label="To Job"
        icon="heroicons-solid:arrow-right"
        iconPosition="right"
        customClass="my-10" />

      <RouterButton label="Toggle Limit" icon="heroicons-solid:arrow-down" />
    </main>
  </Container>
</template>
