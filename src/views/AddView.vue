<script setup lang="ts">
import { ref, inject, onMounted } from "vue";
import { ref as dbRef, push, serverTimestamp } from "firebase/database";
import type { Job } from "@/types/job";
import Container from "@/components/ui/Container.vue";
import JobCard from "@/components/job-cards/JobCard.vue";
import RouterButton from "@/components/ui/RouterButton.vue";
import Divider from "@/components/ui/Divider.vue";
import PageHeader from "@/components/ui/PageHeader.vue";
import router from "@/router";

// Import useToast from vue-toastification
import { useToast } from "vue-toastification";

// Inject the global Firebase instances and modal functions
const firebaseAuth = inject<any>("firebaseAuthInstance");
const firebaseDatabase = inject<any>("firebaseDatabaseInstance");

const openAdminAuthModal =
  inject<(actionCallback: () => Promise<void>) => void>("openAdminAuthModal");
const checkIfCurrentUserIsAdmin = inject<() => boolean>(
  "checkIfCurrentUserIsAdmin"
);

// Get Toast instance
const toast = useToast();

const job = ref<Job>({
  title: "",
  description: "",
  company: "",
  status: "applied",
});

// Actual Database Operation Function
async function performAddJob(jobData: Job) {
  console.log("🔥 performAddJob triggered"); // Keep this console.log
  try {
    if (!firebaseDatabase) {
      console.error("🔥Firebase Database not available for adding job."); // Keep this console.error
      // Show a warning toast if database is not available
      toast.warning("Database not available. Cannot add job.", {
        timeout: 2200,
      });
      return; // Exit if no database
    }
    const jobsRef = dbRef(firebaseDatabase, "jobs");

    // Prepare the data to be pushed, including timestamps
    const dataToPush = {
      ...jobData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await push(jobsRef, dataToPush);
    console.log("✅ Job added successfully"); // Keep this console.log
    // Show an info toast
    toast.info("Job added successfully!", {
      timeout: 2200,
    });
    router.push("/jobs");
  } catch (error) {
    console.error("❌ Error adding job:", error); // Keep this console.error
    // Show a warning toast on error
    toast.warning("Failed to add job. Please try again.", {
      timeout: 2200,
    });
  }
}

// Wrapper Function for Authentication Check
// This function is called by the UI event (@add)
async function handleAddJob(jobData: Job) {
  // First, check if the user is already signed in as admin
  if (
    firebaseAuth &&
    firebaseAuth.currentUser &&
    checkIfCurrentUserIsAdmin &&
    checkIfCurrentUserIsAdmin()
  ) {
    console.log("🕵️ Admin already logged in, performing add directly."); // Keep this console.log
    await performAddJob(jobData);
  } else if (openAdminAuthModal) {
    // If not admin, or not authenticated, open the admin authentication modal
    // Pass 'performAddJob' as the callback to execute after successful authentication
    openAdminAuthModal(async () => {
      // Show an info toast after successful admin login (if modal doesn't already)
      toast.info("Admin login successful!", {
        timeout: 2200,
      });
      await performAddJob(jobData);
    });
  } else {
    // Fallback error if injections somehow fail
    console.error(
      "🕵️ Admin authentication modal not available. Is App.vue configured correctly?"
    ); // Keep this console.error
    // Show a warning toast for missing admin setup
    toast.warning("Admin authentication setup missing.", {
      timeout: 2200,
    });
  }
}

onMounted(() => {
  window.scrollTo(0, 0);
});
</script>

<template>
  <Container v-if="job">
    <PageHeader label="Add job" />
    <Divider label="adding mode" labelPosition="top" />

    <div
      class="flex flex-col items-center justify-between w-full margin950and640 border-color">
      <JobCard
        viewingMode="adding"
        class="w-full pt-0 pb-3 border-0 border-b rounded-none sm:border-0 sm:pb-0"
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
