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
      updatedAt: serverTimestamp(),
    };

    await update(jobRef, updateData);
    console.log("✅ Job updated successfully");
    router.push("/jobs");
  } catch (error) {
    console.error("❌ Error updating job:", error);
  }
}

async function performDelete(id: string) {
  try {
    console.log("🗑️ Deleting job:", id);
    if (!firebaseDatabase) {
      console.error("Firebase Database not available for delete.");
      return;
    }
    const jobRef = dbRef(firebaseDatabase, `jobs/${id}`);
    await remove(jobRef);
    console.log("✅ Job deleted successfully");
    router.push("/jobs");
  } catch (error) {
    console.error("❌ Error deleting job:", error);
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
    console.log("🕵️️ Admin already logged in, performing update directly.");
    await performUpdate(updatedJob);
  } else if (openAdminAuthModal) {
    openAdminAuthModal(() => performUpdate(updatedJob));
  } else {
    console.error(
      "🕵️️ Admin authentication modal not available. Is App.vue configured correctly?"
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
    console.log("🕵️️ Admin already logged in, performing delete directly.");
    await performDelete(id);
  } else if (openAdminAuthModal) {
    openAdminAuthModal(() => performDelete(id));
  } else {
    console.error(
      "🕵️️ Admin authentication modal not available. Is App.vue configured correctly?"
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
      class="flex flex-col items-center justify-between w-full margin950and640">
      <JobCard
        viewingMode="editing"
        :job="job"
        @update="handleUpdate"
        @delete="handleDelete"
        class="w-full pt-0 pb-3 border-0 border-b rounded-none sm:border-0 sm:pb-0" />
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
