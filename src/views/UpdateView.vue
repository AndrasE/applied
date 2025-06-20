<script setup lang="ts">
import { ref, onMounted, onUnmounted, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  ref as dbRef,
  onValue,
  update,
  remove,
  serverTimestamp, // <-- Make sure this is imported instead of ServerValue
} from "firebase/database";
import Container from "@/components/ui/Container.vue";
import Divider from "@/components/ui/Divider.vue";
import PageHeader from "@/components/ui/PageHeader.vue";
import JobCard from "@/components/job-cards/JobCard.vue";
import RouterButton from "@/components/ui/RouterButton.vue";
import type { Job, JobStatus } from "@/types/job";

const route = useRoute();
const router = useRouter();
const jobId = route.params.id as string;
const job = ref<Job | null>(null);

const openAdminAuthModal =
  inject<(actionCallback: () => Promise<void>) => void>("openAdminAuthModal");
const checkIfCurrentUserIsAdmin = inject<() => boolean>(
  "checkIfCurrentUserIsAdmin"
);
const firebaseAuth = inject<any>("firebaseAuthInstance");
const firebaseDatabase = inject<any>("firebaseDatabaseInstance");

let unsubscribe: (() => void) | null = null;

onMounted(() => {
  // Removed: console.log("UpdateView.vue: Component Mounted.");
  // Removed: console.log("UpdateView.vue: Job ID from route params:", jobId);

  if (!jobId) {
    console.error("No job ID provided for update."); // Keep this, it's an important validation error
    router.push("/jobs");
    return;
  }

  if (!firebaseDatabase) {
    console.error("UpdateView.vue: Firebase Database not injected!"); // Keep this, it's a critical configuration error
    return;
  }

  const jobRef = dbRef(firebaseDatabase, `jobs/${jobId}`);
  unsubscribe = onValue(
    jobRef,
    (snapshot) => {
      // Removed: console.log("UpdateView.vue: onValue listener triggered.");
      // Removed: console.log("UpdateView.vue: Snapshot exists?", snapshot.exists());

      if (snapshot.exists()) {
        const jobData = snapshot.val();
        // Removed: console.log("UpdateView.vue: Job data found:", jobData);
        job.value = {
          ...jobData,
          id: snapshot.key,
          status: jobData.status as JobStatus,
        };
      } else {
        // Removed: console.warn("UpdateView.vue: No job data found for ID:", jobId);
        job.value = null;
        router.push("/jobs");
      }
    },
    (error) => {
      console.error("UpdateView.vue: Error fetching job data:", error); // Keep this, it's an error
      job.value = null;
      router.push("/jobs");
    }
  );
});

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe();
  }
});

// --- Actual Database Operations (performUpdate/performDelete) ---
async function performUpdate(updatedJob: Job) {
  try {
    console.log("🔄 Updating job:", updatedJob); // Keep this, confirms action
    if (!firebaseDatabase) {
      console.error("Firebase Database not available for update."); // Keep this, critical error
      return;
    }
    const jobRef = dbRef(firebaseDatabase, `jobs/${jobId}`);

    const { id, ...jobWithoutId } = updatedJob;
    const updateData = {
      ...jobWithoutId,
      updatedAt: serverTimestamp(), // Correctly using serverTimestamp()
    };

    await update(jobRef, updateData);
    console.log("✅ Job updated successfully"); // Keep this, confirms success
    router.push("/jobs");
  } catch (error) {
    console.error("❌ Error updating job:", error); // Keep this, captures errors
  }
}

async function performDelete(id: string) {
  try {
    console.log("🗑️ Deleting job:", id); // Keep this, confirms action
    if (!firebaseDatabase) {
      console.error("Firebase Database not available for delete."); // Keep this, critical error
      return;
    }
    const jobRef = dbRef(firebaseDatabase, `jobs/${id}`);
    await remove(jobRef);
    console.log("✅ Job deleted successfully"); // Keep this, confirms success
    router.push("/jobs");
  } catch (error) {
    console.error("❌ Error deleting job:", error); // Keep this, captures errors
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
    console.log("🕵️️ Admin already logged in, performing update directly."); // Keep this, confirms auth flow
    await performUpdate(updatedJob);
  } else if (openAdminAuthModal) {
    openAdminAuthModal(() => performUpdate(updatedJob));
  } else {
    console.error(
      "🕵️️ Admin authentication modal not available. Is App.vue configured correctly?" // Keep this, critical config error
    );
  }
}

async function handleDelete(id: string) {
  if (
    firebaseAuth &&
    firebaseAuth.currentUser &&
    checkIfCurrentUserIsAdmin &&
    checkIfCurrentUserIsAdmin()
  ) {
    console.log("🕵️️ Admin already logged in, performing delete directly."); // Keep this, confirms auth flow
    await performDelete(id);
  } else if (openAdminAuthModal) {
    openAdminAuthModal(() => performDelete(id));
  } else {
    console.error(
      "🕵️️ Admin authentication modal not available. Is App.vue configured correctly?" // Keep this, critical config error
    );
  }
}

onMounted(() => {
  window.scrollTo(0, 0); // Scroll to the top overwriting any previous scroll
});
</script>

<template>
  <Container v-if="job">
    <PageHeader label="Update job" />
    <Divider label="editing mode" labelPosition="top" />

    <div
      class="flex flex-col items-center w-full justify-between margin950and640 border-color">
      <JobCard
        viewingMode="editing"
        :job="job"
        @update="handleUpdate"
        @delete="handleDelete"
        class="w-full border-0 border-b sm:border-0 rounded-none pb-3 sm:pb-0 pt-0" />
    </div>

    <Divider label="prev list" labelPosition="bottom" />
    <RouterButton
      :to="`/jobs`"
      iconPosition="left"
      label="Cancel and go back"
      icon="heroicons-solid:arrow-left"
      customClass="pr-5 py-4" />
  </Container>

  <p v-else class="p-6">404 Job not found.</p>
</template>
