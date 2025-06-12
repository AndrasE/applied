<script setup lang="ts">
import { ref } from "vue";
import { database } from "../config/database";
import { ref as dbRef, push } from "firebase/database";
import Container from "@/components/ui/Container.vue";
import JobCard from "@/components/job-cards/JobCard.vue";
import RouterButton from "@/components/ui/RouterButton.vue";
import Divider from "@/components/ui/Divider.vue";
import PageHeader from "@/components/ui/PageHeader.vue";
import { useRouter } from "vue-router";

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
  date?: string;
}

// Router for navigation after save
const router = useRouter();

// Default job state
const job = ref<Job>({
  title: "asd",
  description: "asd",
  company: "asd",
  status: "applied",
  date: getTodayFormatted(),
});

// Format today as dd/mm/yy
function getTodayFormatted(): string {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yy = String(today.getFullYear()).slice(-2);
  return `${dd}/${mm}/${yy}`;
}

// Save to Firebase Realtime Database
async function addJobToFirebase() {
  try {
    const jobsRef = dbRef(database, "jobs"); // adds to /jobs path
    await push(jobsRef, job.value);
    router.push("/jobs"); // go back to job list
  } catch (error) {
    console.error("Error adding job:", error);
  }
}
</script>

<template>
  <Container v-if="job">
    <PageHeader label="Add job" />
    <Divider label="adding mode" labelPosition="top" />

    <div class="flex justify-end px-4 pt-4">
      <button @click="addJobToFirebase" class="btn btn-primary">
        Add Job to Firebase
      </button>
    </div>
    <div
      class="flex flex-col items-center w-full justify-between margin950and640 border-color">
      <JobCard
        viewingMode="adding"
        class="w-full border-0 border-b sm:border-0 rounded-none pb-3 sm:pb-0 pt-0"
        :job="job" />
    </div>

    <Divider label="nein geh zurück" labelPosition="bottom" />
    <RouterButton
      as="link"
      @click="addJobToFirebase"
      :to="`/jobs`"
      iconPosition="left"
      label="Cancel and go back "
      icon="heroicons-solid:arrow-left"
      customClass="pr-5 py-4" />
  </Container>

  <p v-else class="p-6">Job not found.</p>
</template>
