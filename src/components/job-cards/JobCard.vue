<script setup lang="ts">
import { ref, watch, type Ref } from "vue";
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

console.log("📄 JobCard.vue: Viewing mode received:", props.viewingMode);

// Local reactive copy of the job for editing/adding
const editableJob = ref<Job>({ ...props.job });

// Watch for mode changes and reset editable fields or populate
// This ensures editableJob is always in the correct state for the current mode
watch(
  () => props.viewingMode,
  (newMode) => {
    if (newMode === "adding") {
      editableJob.value = {
        title: "",
        company: "",
        description: "",
        status: "applied",
        date: getTodayFormatted(), // Set today's date
      };
      console.log("📄 JobCard.vue: editableJob initialized for 'adding'");
    } else if (newMode === "editing") {
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
        :model-value="editableJob"
        @update:model-value="(val) => (editableJob = { ...val })"
        @save="handleSaveJob"
        @delete="handleDeleteJob" />
    </template>

    <template v-else-if="viewingMode === 'adding'">
      <JobCardAdd
        :model-value="editableJob"
        @update:model-value="(val) => (editableJob = { ...val })"
        @add="handleAddJob" />
    </template>
  </div>
</template>
