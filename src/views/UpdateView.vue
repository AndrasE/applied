<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ref as dbRef, onValue, update, remove } from "firebase/database";
import { database } from "../config/database";
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

// Setup Firebase listener
let unsubscribe: (() => void) | null = null;

onMounted(() => {
  const jobRef = dbRef(database, `jobs/${jobId}`);
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

// Handle job updates
async function handleUpdate(updatedJob: Job) {
  try {
    console.log("🔄 Updating job:", updatedJob);
    const jobRef = dbRef(database, `jobs/${jobId}`);
    const { id, ...jobWithoutId } = updatedJob;
    await update(jobRef, jobWithoutId);
    console.log("✅ Job updated successfully");
    router.push("/jobs");
  } catch (error) {
    console.error("❌ Error updating job:", error);
  }
}

// Handle job deletion
async function handleDelete(id: string) {
  try {
    console.log("🗑️ Deleting job:", id);
    const jobRef = dbRef(database, `jobs/${id}`);
    await remove(jobRef);
    console.log("✅ Job deleted successfully");
    router.push("/jobs");
  } catch (error) {
    console.error("❌ Error deleting job:", error);
  }
}
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

  <p v-else class="p-6">Job not found.</p>
</template>
