<script setup lang="ts">
import { ref, onMounted, onUnmounted, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ref as dbRef, onValue } from "firebase/database";
import Container from "@/components/ui/Container.vue";
import Divider from "@/components/ui/Divider.vue";
import PageHeader from "@/components/ui/PageHeader.vue";
import JobCard from "@/components/job-cards/JobCard.vue";
import RouterButton from "@/components/ui/RouterButton.vue";
import type { Job, JobStatus } from "@/types/job";

// --- Setup route, router, and state ---
const route = useRoute();
const jobId = route.params.id as string;

const router = useRouter();
const job = ref<Job | null>(null);

// --- Inject the Firebase database instance ---
const firebaseDatabase = inject<any>("firebaseDatabaseInstance");

// --- Setup Firebase listener ---
let unsubscribe: (() => void) | null = null;

onMounted(() => {
  // Scroll to the top on mount
  onMounted(() => {
    window.scrollTo(0, 0); // Scroll to the top overwriting any previous scroll
  });
  if (!jobId) {
    // No job ID provided, redirect
    console.error("No job ID provided");
    router.push("/jobs");
    return;
  }

  // Ensure firebaseDatabase is available
  if (!firebaseDatabase) {
    console.error("Firebase database instance not injected into JobView.vue!");
    router.push("/jobs"); // Redirect if database isn't available
    return;
  }

  // Reference to the job in the database
  const jobRef = dbRef(firebaseDatabase, `jobs/${jobId}`); // <-- Use the injected instance here!
  unsubscribe = onValue(jobRef, (snapshot) => {
    if (snapshot.exists()) {
      // Job found, update local state
      const jobData = snapshot.val();
      job.value = {
        ...jobData,
        id: snapshot.key,
        status: jobData.status as JobStatus,
      };
    } else {
      // Job not found, redirect
      job.value = null;
      router.push("/jobs");
    }
  });
});

// --- Cleanup listener on unmount ---
onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe();
  }
});
</script>

<template>
  <!-- Main container, only shown if job exists -->
  <Container v-if="job">
    <PageHeader label="Job details" />

    <Divider label="viewing mode" labelPosition="top" />
    <div
      class="flex flex-col items-center justify-between gap-4 margin950and640">
      <!-- JobCard in viewing mode -->
      <JobCard viewingMode="viewing" :key="job.id" :job="job" />
    </div>
    <Divider label="prev list" labelPosition="bottom" />

    <!-- Back to job listings button -->
    <RouterButton
      :to="`/jobs`"
      iconPosition="left"
      label="Back to job listings"
      icon="heroicons-solid:arrow-left"
      customClass="pr-5 py-4" />
  </Container>

  <!-- Fallback if job not found -->
  <p v-else class="p-6">Job not found.</p>
</template>
