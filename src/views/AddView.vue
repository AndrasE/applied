<script setup lang="ts">
import { ref } from "vue";
import { ref as dbRef, push } from "firebase/database"; // Import dbRef and push from Firebase
import { database } from "../config/database"; // Make sure you have a database export from your firebase config

import Container from "@/components/ui/Container.vue";
import JobCard from "@/components/job-cards/JobCard.vue";
import RouterButton from "@/components/ui/RouterButton.vue";
import Divider from "@/components/ui/Divider.vue";
import PageHeader from "@/components/ui/PageHeader.vue";
import router from "@/router";

// Define Job type
type JobStatus =
  | "applied"
  | "1st round"
  | "2nd round"
  | "3rd round"
  | "rejected"
  | "no response"
  | "job offer"
  | undefined;

interface Job {
  title: string;
  description: string;
  company: string;
  status?: JobStatus;
}

// Default job state - removed date since it's handled in JobCard
const job = ref<Job>({
  title: "",
  description: "",
  company: "",
  status: "applied",
});

async function addJobToFirebase(job: Job) {
  console.log("🔥 addJobToFirebase triggered");
  try {
    const jobsRef = dbRef(database, "jobs");
    await push(jobsRef, job);
    router.push("/jobs");
  } catch (error) {
    console.error("❌ Error adding job:", error);
  }
}
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
        :job="job"
        @add="addJobToFirebase" />
    </div>

    <Divider label="nein geh zurück" labelPosition="bottom" />
    <RouterButton
      as="link"
      :to="`/jobs`"
      iconPosition="left"
      label="Cancel and go back "
      icon="heroicons-solid:arrow-left"
      customClass="pr-5 py-4" />
  </Container>

  <p v-else class="p-6">Job not found.</p>
</template>
