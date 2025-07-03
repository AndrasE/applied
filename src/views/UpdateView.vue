<script setup lang="ts">
import { ref, onMounted, onUnmounted, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  ref as dbRef,
  onValue,
  update,
  remove,
  serverTimestamp,
} from "firebase/database";
import Container from "@/components/ui/Container.vue";
import Divider from "@/components/ui/Divider.vue";
import PageHeader from "@/components/ui/PageHeader.vue";
import JobCard from "@/components/job-cards/JobCard.vue";
import RouterButton from "@/components/ui/RouterButton.vue";
import type { Job, JobStatus } from "@/types/job";

// Import useToast from vue-toastification
import { useToast } from "vue-toastification";

// --- Setup route, router, and state ---
const route = useRoute();
const router = useRouter();
const jobId = route.params.id as string;
const job = ref<Job | null>(null);

// --- Inject dependencies from app context ---
const openAdminAuthModal =
  inject<(actionCallback: () => Promise<void>) => void>("openAdminAuthModal");
const checkIfCurrentUserIsAdmin = inject<() => boolean>(
  "checkIfCurrentUserIsAdmin"
);
const firebaseAuth = inject<any>("firebaseAuthInstance");
const firebaseDatabase = inject<any>("firebaseDatabaseInstance");

const toast = useToast();

let unsubscribe: (() => void) | null = null;
// NEW: Flag to indicate if we've intentionally deleted the job
const isDeletingJob = ref(false);

// --- Listen for job data on mount ---
onMounted(() => {
  if (!jobId) {
    // No job ID provided, show warning and redirect
    console.error("No job ID provided for update.");
    toast.warning("No job ID provided for update.", {
      timeout: 2200,
    });
    router.push("/jobs");
    return;
  }

  if (!firebaseDatabase) {
    // Firebase not available, show warning
    console.error("UpdateView.vue: Firebase Database not injected!");
    toast.warning("Database not available. Cannot fetch job details.", {
      timeout: 2200,
    });
    return;
  }

  // Reference to the job in the database
  const jobRef = dbRef(firebaseDatabase, `jobs/${jobId}`);
  unsubscribe = onValue(
    jobRef,
    (snapshot) => {
      if (snapshot.exists()) {
        // Job found, update local state
        const jobData = snapshot.val();

        job.value = {
          ...jobData,
          id: snapshot.key,
          status: jobData.status as JobStatus,
        };
      } else {
        // IMPORTANT: Only show "not found" toast if we're NOT in the process of deleting
        if (!isDeletingJob.value) {
          job.value = null;
          console.warn("UpdateView.vue: Job not found, redirecting.");
          toast.warning("Job not found. Redirecting to jobs list.", {
            timeout: 2200,
          });
          router.push("/jobs");
        } else {
          // Suppress toast if deletion was intentional
          console.log(
            "Job intentionally deleted, suppressing 'not found' toast."
          );
        }
      }
    },
    (error) => {
      // Error fetching job data
      console.error("UpdateView.vue: Error fetching job data:", error);
      toast.warning("Error fetching job data. Please try again.", {
        timeout: 2200,
      });
      job.value = null;
      router.push("/jobs");
    }
  );
});

// --- Cleanup listener on unmount ---
onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe();
  }
});

// --- Actual Database Operations (performUpdate/performDelete) ---
async function performUpdate(updatedJob: Job) {
  try {
    console.log("🔄 Updating job:", updatedJob);
    if (!firebaseDatabase) {
      // Database not available
      console.error("Firebase Database not available for update.");
      toast.warning("Database not available. Cannot update job.", {
        timeout: 2200,
      });
      return;
    }
    const jobRef = dbRef(firebaseDatabase, `jobs/${jobId}`);

    // Remove id from update payload
    const { id, ...jobWithoutId } = updatedJob;
    const updateData = {
      ...jobWithoutId,
      updatedAt: serverTimestamp(),
    };

    await update(jobRef, updateData);
    console.log("✅ Job updated successfully");
    toast.info("Job updated successfully!", {
      timeout: 2200,
    });
    router.push("/jobs");
  } catch (error) {
    // Handle update error
    console.error("❌ Error updating job:", error);
    toast.warning("Failed to update job. Please try again.", {
      timeout: 2200,
    });
  }
}

async function performDelete(id: string) {
  try {
    console.log("🗑️ Deleting job:", id);
    if (!firebaseDatabase) {
      // Database not available
      console.error("Firebase Database not available for delete.");
      toast.warning("Database not available. Cannot delete job.", {
        timeout: 2200,
      });
      return;
    }

    // NEW: Set flag to true BEFORE deleting
    isDeletingJob.value = true;
    // NEW: Unsubscribe the listener BEFORE deleting
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null; // Clear it to prevent accidental re-use
    }

    const jobRef = dbRef(firebaseDatabase, `jobs/${id}`);
    await remove(jobRef);
    console.log("✅ Job deleted successfully");
    toast.info("Job deleted successfully!", {
      timeout: 2200,
    });
    router.push("/jobs");
  } catch (error) {
    // Handle delete error
    console.error("❌ Error deleting job:", error);
    toast.warning("Failed to delete job. Please try again.", {
      timeout: 2200,
    });
    // IMPORTANT: If delete fails, reset the flag so listener behaves normally again
    isDeletingJob.value = false;
  }
}

// --- Wrapper functions that handle authentication check ---
async function handleUpdate(updatedJob: Job) {
  if (
    firebaseAuth &&
    firebaseAuth.currentUser &&
    checkIfCurrentUserIsAdmin &&
    checkIfCurrentUserIsAdmin()
  ) {
    // Admin already logged in, perform update
    console.log("🕵️️ Admin already logged in, performing update directly.");
    await performUpdate(updatedJob);
  } else if (openAdminAuthModal) {
    // Open admin auth modal, then perform update
    openAdminAuthModal(async () => {
      toast.info("Admin login successful!", {
        timeout: 2200,
      });
      await performUpdate(updatedJob);
    });
  } else {
    // Admin auth setup missing
    console.error(
      "🕵️️ Admin authentication modal not available. Is App.vue configured correctly?"
    );
    toast.warning("Admin authentication setup missing.", {
      timeout: 2200,
    });
  }
}

async function handleDelete(id: string) {
  if (
    firebaseAuth &&
    firebaseAuth.currentUser &&
    checkIfCurrentUserIsAdmin &&
    checkIfCurrentUserIsAdmin()
  ) {
    // Admin already logged in, perform delete
    console.log("🕵️️ Admin already logged in, performing delete directly.");
    await performDelete(id);
  } else if (openAdminAuthModal) {
    // Open admin auth modal, then perform delete
    openAdminAuthModal(async () => {
      toast.info("Admin login successful!", {
        timeout: 2200,
      });
      await performDelete(id);
    });
  } else {
    // Admin auth setup missing
    console.error(
      "🕵️️ Admin authentication modal not available. Is App.vue configured correctly?"
    );
    toast.warning("Admin authentication setup missing.", {
      timeout: 2200,
    });
  }
}

// --- Scroll to top on mount (UI polish) ---
onMounted(() => {
  // This onMounted is outside the main listener logic,
  // ensure this is the intended behavior (scroll once on component mount)
  window.scrollTo(0, 0);
});
</script>

<template>
  <!-- Main container, only shown if job exists -->
  <Container v-if="job">
    <PageHeader label="Update job" />
    <Divider label="editing mode" labelPosition="top" />

    <div
      class="flex flex-col items-center justify-between w-full margin950and640">
      <!-- JobCard in editing mode -->
      <JobCard
        viewingMode="editing"
        :job="job"
        @update="handleUpdate"
        @delete="handleDelete"
        class="w-full pt-0 pb-3 border-0 border-b rounded-none sm:border-0 sm:pb-0" />
    </div>

    <Divider label="prev list" labelPosition="bottom" />
    <!-- Cancel/go back button -->
    <RouterButton
      :to="`/jobs`"
      iconPosition="left"
      label="Cancel and go back"
      icon="heroicons-solid:arrow-left"
      customClass="pr-5 py-4" />
  </Container>

  <!-- Fallback if job not found -->
  <p v-else class="p-6">404 Job not found.</p>
</template>
