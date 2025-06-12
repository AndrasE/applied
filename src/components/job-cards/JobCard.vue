<script setup lang="ts">
import { reactive, watch } from "vue";
// Import sub-components JobCard is the parent orchestration component
import JobCardBrowse from "./JobCardBrowse.vue";
import JobCardView from "./JobCardView.vue";
import JobCardEdit from "./JobCardEdit.vue";
import JobCardAdd from "./JobCardAdd.vue";
import type { Job } from "../../types/job";

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
      // Initialize for a new job
      Object.assign(editableJob, {
        id: undefined, // Crucial: new jobs shouldn't have an ID yet
        title: "",
        company: "",
        description: "",
        link: "",
        status: "applied", // Default for new jobs
        date: "",
      });
      console.log(
        "JobCard.vue: editableJob initialized for 'adding'(clearing fields)"
      );
    } else if (newMode === "editing") {
      // Populate with existing job data for editing
      Object.assign(editableJob, props.job);
      console.log(
        "JobCard.vue: editableJob populated for 'editing' for job id:"
      );
    }
  },
  { immediate: true, deep: true } // immediate: runs on initial component load. deep: watches nested changes.
);

// Emits events to the parent of JobCard.vue
const emit = defineEmits<{
  (e: "update", job: Job): void;
  (e: "delete", id: number): void;
  (e: "add", job: Job): void;
}>();

// Handlers for events emitted by the sub-components
function handleSaveJob(jobData: Job) {
  emit("update", jobData);
}

function handleDeleteJob(jobId: number) {
  emit("delete", jobId);
}

function handleAddJob(jobData: Job) {
  emit("add", jobData);
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
