<script setup lang="ts">
import { ref, inject, onMounted } from "vue";
import { ref as dbRef, push, serverTimestamp } from "firebase/database"; // <-- Import serverTimestamp
import type { Job } from "@/types/job";
import Container from "@/components/ui/Container.vue";
import JobCard from "@/components/job-cards/JobCard.vue";
import RouterButton from "@/components/ui/RouterButton.vue";
import Divider from "@/components/ui/Divider.vue";
import PageHeader from "@/components/ui/PageHeader.vue";
import router from "@/router";

// --- Inject the global Firebase instances and modal functions ---
const firebaseAuth = inject<any>("firebaseAuthInstance");
const firebaseDatabase = inject<any>("firebaseDatabaseInstance");

const openAdminAuthModal =
  inject<(actionCallback: () => Promise<void>) => void>("openAdminAuthModal");
const checkIfCurrentUserIsAdmin = inject<() => boolean>(
  "checkIfCurrentUserIsAdmin"
);

const job = ref<Job>({
  title: "",
  description: "",
  company: "",
  status: "applied",
});

// --- Actual Database Operation Function ---
async function performAddJob(jobData: Job) {
  console.log("🔥 performAddJob triggered");
  try {
    if (!firebaseDatabase) {
      console.error("🔥Firebase Database not available for adding job.");
      return;
    }
    const jobsRef = dbRef(firebaseDatabase, "jobs");

    // Prepare the data to be pushed, including timestamps
    const dataToPush = {
      ...jobData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await push(jobsRef, dataToPush);
    console.log("✅ Job added successfully");
    router.push("/jobs");
  } catch (error) {
    console.error("❌ Error adding job:", error);
  }
}

// --- Wrapper Function for Authentication Check ---
// This function is called by the UI event (@add)
async function handleAddJob(jobData: Job) {
  // First, check if the user is already signed in as admin
  if (
    firebaseAuth &&
    firebaseAuth.currentUser &&
    checkIfCurrentUserIsAdmin &&
    checkIfCurrentUserIsAdmin()
  ) {
    console.log("🕵️ Admin already logged in, performing add directly.");
    await performAddJob(jobData);
  } else if (openAdminAuthModal) {
    // If not admin, or not authenticated, open the admin authentication modal
    // Pass 'performAddJob' as the callback to execute after successful authentication
    openAdminAuthModal(() => performAddJob(jobData));
  } else {
    // Fallback error if injections somehow fail
    console.error(
      "🕵️ Admin authentication modal not available. Is App.vue configured correctly?"
    );
  }
}

onMounted(() => {
  window.scrollTo(0, 0); // Scroll to the top overwriting any previous scroll
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
        :job="job"
        @add="handleAddJob" />
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
