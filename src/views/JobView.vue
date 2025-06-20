<script setup lang="ts">
import { ref, onMounted, onUnmounted, inject } from "vue"; // <-- Add 'inject' here
import { useRoute, useRouter } from "vue-router";
import { ref as dbRef, onValue } from "firebase/database";
// REMOVE THIS LINE: import { database } from "../config/database";
import Container from "@/components/ui/Container.vue";
import Divider from "@/components/ui/Divider.vue";
import PageHeader from "@/components/ui/PageHeader.vue";
import JobCard from "@/components/job-cards/JobCard.vue";
import RouterButton from "@/components/ui/RouterButton.vue";
import type { Job, JobStatus } from "@/types/job";

const route = useRoute();
const jobId = route.params.id as string;

const router = useRouter();
const job = ref<Job | null>(null);

// Inject the Firebase database instance
const firebaseDatabase = inject<any>("firebaseDatabaseInstance"); // <-- Add this line!

// Setup Firebase listener
let unsubscribe: (() => void) | null = null;

onMounted(() => {
  onMounted(() => {
    window.scrollTo(0, 0); // Scroll to the top overwriting any previous scroll
  });
  if (!jobId) {
    console.error("No job ID provided");
    router.push("/jobs");
    return;
  }

  // Add a check to ensure firebaseDatabase is available
  if (!firebaseDatabase) {
    console.error("Firebase database instance not injected into JobView.vue!");
    router.push("/jobs"); // Redirect if database isn't available
    return;
  }

  const jobRef = dbRef(firebaseDatabase, `jobs/${jobId}`); // <-- Use the injected instance here!
  unsubscribe = onValue(jobRef, (snapshot) => {
    if (snapshot.exists()) {
      const jobData = snapshot.val();
      job.value = {
        ...jobData,
        id: snapshot.key,
        status: jobData.status as JobStatus,
      };
    } else {
      job.value = null;
      router.push("/jobs");
    }
  });
});

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe();
  }
});
</script>

<template>
  <Container v-if="job">
    <PageHeader label="Job details" />

    <Divider label="viewing mode" labelPosition="top" />
    <div
      class="flex flex-col items-center justify-between gap-4 margin950and640">
      <JobCard viewingMode="viewing" :key="job.id" :job="job" />
    </div>
    <Divider label="prev list" labelPosition="bottom" />

    <RouterButton
      :to="`/jobs`"
      iconPosition="left"
      label="Back to job listings"
      icon="heroicons-solid:arrow-left"
      customClass="pr-5 py-4" />
  </Container>

  <p v-else class="p-6">Job not found.</p>
</template>
