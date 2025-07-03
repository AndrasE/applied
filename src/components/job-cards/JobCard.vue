<script setup lang="ts">
// JobCard.vue: Parent orchestration component for job cards
import { ref, watch, type Ref } from "vue";
// Import sub-components for different modes
import JobCardBrowse from "./JobCardBrowse.vue";
import JobCardView from "./JobCardView.vue";
import JobCardEdit from "./JobCardEdit.vue";
import JobCardAdd from "./JobCardAdd.vue";
import type { Job } from "../../types/job";
import { getTodayFormatted } from "@/utils/getTodayFormatted";

// Props: job data, mode, and optional display settings
const props = defineProps<{
  job: Job;
  charLimit?: number;
  viewingMode: "browsing" | "viewing" | "editing" | "adding";
  statusIconCustomClass?: string;
}>();

console.log("📄 JobCard.vue: Viewing mode received:", props.viewingMode);

// Local reactive copy of the job for editing/adding
const editableJob = ref<Job>({ ...props.job });

// Watch for mode changes and reset editable fields or populate
// This ensures editableJob is always in the correct state for the current mode
watch(
  () => props.viewingMode,
  (newMode) => {
    if (newMode === "adding") {
      // Initialize empty job for adding mode
      editableJob.value = {
        title: "",
        company: "",
        description: "",
        status: "applied",
        date: getTodayFormatted(),
      };
      console.log("📄 JobCard.vue: editableJob initialized for 'adding'");
    } else if (newMode === "editing") {
      // Populate editableJob with current job data for editing
      editableJob.value = { ...props.job };
      console.log("📄 JobCard.vue: editableJob populated for 'editing'");
    }
  },
  { immediate: true }
);

// Emits events to the parent of JobCard.vue
const emit = defineEmits<{
  (e: "update", job: Job): void;
  (e: "delete", id: string): void;
  (e: "add", job: Job): void;
}>();

// Handlers for events emitted by the sub-components
function handleSaveJob(jobData: Job) {
  console.log("✅ JobCard.vue: Received 'update' event");
  emit("update", jobData);
}

function handleDeleteJob(jobId: string) {
  console.log("✅ JobCard.vue: Received 'delete' event");
  emit("delete", jobId);
}

function handleAddJob(job: Job) {
  console.log("✅ JobCard.vue: Received 'add' event");
  emit("add", job);
}
</script>

<template>
  <!-- Main job card container -->
  <div aria-label="job card" class="p-4 border rounded border-color">
    <!-- Render the correct sub-component based on viewingMode -->
    <template v-if="viewingMode === 'browsing'">
      <!-- Browsing mode: compact card for job list -->
      <JobCardBrowse
        :job="job"
        :char-limit="charLimit"
        :status-icon-custom-class="statusIconCustomClass" />
    </template>

    <template v-else-if="viewingMode === 'viewing'">
      <!-- Viewing mode: detailed read-only card -->
      <JobCardView :job="job" />
    </template>

    <template v-else-if="viewingMode === 'editing'">
      <!-- Editing mode: editable card with save/delete -->
      <JobCardEdit
        :model-value="editableJob"
        @update:model-value="(val) => (editableJob = { ...val })"
        @save="handleSaveJob"
        @delete="handleDeleteJob" />
    </template>

    <template v-else-if="viewingMode === 'adding'">
      <!-- Adding mode: empty card for new job entry -->
      <JobCardAdd
        :model-value="editableJob"
        @update:model-value="(val) => (editableJob = { ...val })"
        @add="handleAddJob" />
    </template>
  </div>
</template>
