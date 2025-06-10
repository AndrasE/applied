<script setup lang="ts">
import { ref } from "vue";
import Container from "@/components/Container.vue";
import JobCard from "@/components/JobCard.vue";
import RouterButton from "@/components/RouterButton.vue";
import Divider from "@/components/Divider.vue";
import PageHeader from "@/components/PageHeader.vue";

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
  <Container v-if="job">
    <PageHeader label="Add job" />
    <Divider label="adding mode" labelPosition="top" />

    <div
      class="flex flex-col items-center w-full justify-between margin950and640 border-color">
      <JobCard
        viewingMode="adding"
        class="w-full border-0 border-b sm:border-0 rounded-none pb-3 sm:pb-0 pt-0"
        :key="job.id"
        :job="job" />
    </div>
    <Divider label="nein geh zurück" labelPosition="bottom" />
    <RouterButton
      as="link"
      :to="`/jobs`"
      iconPosition="left"
      label="Cancel and go back "
      icon="heroicons-solid:arrow-left"
      customClass="pr-5 py-4 " />
  </Container>
  <p v-else class="p-6">Job not found.</p>
</template>
