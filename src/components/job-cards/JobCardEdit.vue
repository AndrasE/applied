<script setup lang="ts">
import { reactive, watch } from "vue";
import RouterButton from "../ui/RouterButton.vue";
import JobStatusDropdown from "../ui/JobStatusDropdown.vue";
import { Icon } from "@iconify/vue";
import type { Job } from "../../types/job";

// Props for v-model binding of the editable job object
const props = defineProps<{
  modelValue: Job;
}>();

// Emits: update:modelValue for v-model, plus save and delete events
const emit = defineEmits<{
  (e: "update:modelValue", job: Job): void;
  (e: "save", job: Job): void;
  (e: "delete", id: number): void;
}>();

// Create a local reactive copy of modelValue to allow editing
const localEditableJob = reactive({ ...props.modelValue });

// Watch for changes in modelValue from the parent and update local copy
watch(
  () => props.modelValue,
  (newValue) => {
    Object.assign(localEditableJob, newValue);
  },
  { deep: true, immediate: true }
);

// Watch for changes in localEditableJob and emit to parent
watch(
  localEditableJob,
  (newValue) => {
    emit("update:modelValue", newValue);
  },
  { deep: true }
);

// Function to update date to today
function updateDateToToday() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = String(today.getFullYear()).slice(-2); // get last 2 digits
  localEditableJob.date = `${day}/${month}/${year}`;
}

// Handle Save/Delete actions
function handleSave() {
  emit("save", localEditableJob);
}

function handleDelete() {
  if (localEditableJob.id != null) {
    emit("delete", localEditableJob.id);
  }
}
</script>

<template>
  <div>
    <div class="flex items-start justify-between">
      <h2 class="mb-1 w-full text-lg">
        <input
          v-model="localEditableJob.title"
          type="text"
          class="w-full rounded border border-color p-1"
          placeholder="Job title" />
      </h2>
    </div>

    <div
      class="flex flex-col sm:flex-row text-sm justify-between gap-1 w-full mb-1">
      <JobStatusDropdown v-model="localEditableJob.status" />

      <div
        class="flex flex-row relative items-center gap-1 w-full sm:w-auto sm:flex-1 group">
        <input
          v-model="localEditableJob.date"
          type="text"
          readonly
          placeholder="Date"
          class="w-full flex-1 rounded border p-1 border-color cursor-auto" />

        <Icon
          icon="heroicons-solid:refresh"
          aria-label="update date"
          class="text-xl absolute right-1 cursor-pointer text-gray-500 dark:text-gray-400 group-hover:text-[var(--green-accent-light)] dark:group-hover:text-[var(--green-accent-dark)]"
          @click="updateDateToToday" />
      </div>
    </div>

    <p class="mb-2 text-sm">
      <input
        v-model="localEditableJob.company"
        type="text"
        class="w-full rounded border border-color p-1"
        placeholder="Company name" />
    </p>

    <p class="text-sm text-justify break-words">
      <textarea
        v-model="localEditableJob.description"
        class="w-full rounded border border-color p-1 custom-scrollbar"
        placeholder="Job description"></textarea>
    </p>

    <div class="flex justify-end gap-2 pt-2">
      <RouterButton
        :to="`/jobs`"
        label="Delete job"
        icon="heroicons-solid:trash"
        icon-position="left"
        custom-class="pt-2 xl:pt-0 mr-2"
        @click="handleDelete" />
      <RouterButton
        :to="`/jobs/${localEditableJob.id}`"
        label="Save changes"
        icon="heroicons-solid:check"
        icon-position="left"
        custom-class="pt-2 xl:pt-0"
        @click="handleSave" />
    </div>
  </div>
</template>
