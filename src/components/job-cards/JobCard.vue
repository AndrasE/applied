<script setup lang="ts">
import { reactive, watch } from "vue";
// Import sub-components JobCard is the parent orchestration component
import JobCardBrowse from "./JobCardBrowse.vue";
import JobCardView from "./JobCardView.vue";
import JobCardEdit from "./JobCardEdit.vue";
import JobCardAdd from "./JobCardAdd.vue";
import type { Job } from "../../types/job";
import { getTodayFormatted } from "@/utils/getTodayFormatted";

const props = defineProps<{
  job: Job;
  charLimit?: number;
  viewingMode: "browsing" | "viewing" | "editing" | "adding";
  statusIconCustomClass?: string;
}>();

console.log("JobCard.vue: Viewing mode received:", props.viewingMode);

// Local reactive copy of the job for editing/adding
const editableJob = reactive<Job>({ ...props.job });

// Watch for mode changes and reset editable fields or populate
// This ensures editableJob is always in the correct state for the current mode
watch(
  () => props.viewingMode,
  (newMode) => {
    if (newMode === "adding") {
      // Assign properties individually
      editableJob.title = "";
      editableJob.company = "";
      editableJob.description = "";
      editableJob.status = "applied";
      editableJob.date = getTodayFormatted(); // Set today's date
      // Remove id if present
      if ("id" in editableJob) delete editableJob.id;
      console.log("JobCard.vue: editableJob initialized for 'adding'");
    } else if (newMode === "editing") {
      // Assign properties individually
      Object.keys(editableJob).forEach((key) => {
        // @ts-ignore
        delete editableJob[key];
      });
      Object.assign(editableJob, props.job);
      console.log("JobCard.vue: editableJob populated for 'editing'");
    }
  },
  { immediate: true, deep: true } // immediate: runs on initial component load. deep: watches nested changes.
);

// Emits events to the parent of JobCard.vue
const emit = defineEmits<{
  (e: "update", job: Job): void;
  (e: "delete", id: string): void;
  (e: "add", job: Job): void;
}>();

// Handlers for events emitted by the sub-components
function handleSaveJob(jobData: Job) {
  emit("update", jobData);
}

function handleDeleteJob(jobId: string) {
  console.log("🗑️ Deleting job:", jobId);
  emit("delete", jobId);
}

function handleAddJob(job: Job) {
  console.log("✅ JobCard.vue: Received 'add' event", job);
  emit("add", job);
}
</script>

<template>
  <div aria-label="job card" class="p-4 rounded border border-color">
    <template v-if="viewingMode === 'browsing'">
      <JobCardBrowse
        :job="job"
        :char-limit="charLimit"
        :status-icon-custom-class="statusIconCustomClass" />
    </template>

    <template v-else-if="viewingMode === 'viewing'">
      <JobCardView :job="job" />
    </template>

    <template v-else-if="viewingMode === 'editing'">
      <JobCardEdit
        v-model="editableJob"
        @save="handleSaveJob"
        @delete="handleDeleteJob" />
    </template>

    <template v-else-if="viewingMode === 'adding'">
      <JobCardAdd v-model="editableJob" @add="handleAddJob" />
    </template>
  </div>
</template>
