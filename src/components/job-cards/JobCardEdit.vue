<script setup lang="ts">
// JobCardEdit.vue: Editable card for updating a job
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
  (e: "delete", id: string): void;
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
    emit("update:modelValue", { ...newValue });
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
  emit("save", { ...localEditableJob });
}

function handleDelete() {
  if (localEditableJob.id) {
    emit("delete", localEditableJob.id);
  }
}
</script>

<template>
  <div>
    <div class="flex items-start justify-between">
      <h2 class="w-full mb-1 text-lg">
        <!-- Editable job title -->
        <input
          v-model="localEditableJob.title"
          type="text"
          class="w-full p-1 border rounded border-color"
          placeholder="Job title" />
      </h2>
    </div>

    <div
      class="flex flex-col justify-between w-full gap-1 mb-1 text-sm sm:flex-row">
      <!-- Status dropdown -->
      <JobStatusDropdown v-model="localEditableJob.status" />

      <div
        class="relative flex flex-row items-center w-full gap-1 sm:w-auto sm:flex-1 group">
        <!-- Readonly date field with refresh icon to update to today -->
        <input
          v-model="localEditableJob.date"
          type="text"
          readonly
          placeholder="Date"
          class="flex-1 w-full p-1 border rounded cursor-auto border-color" />

        <Icon
          icon="heroicons-solid:refresh"
          aria-label="update date"
          class="text-xl absolute right-1 cursor-pointer text-gray-500 dark:text-gray-400 group-hover:text-[var(--green-accent-light)] dark:group-hover:text-[var(--green-accent-dark)]"
          @click="updateDateToToday" />
      </div>
    </div>

    <p class="mb-1 text-sm">
      <!-- Editable company name -->
      <input
        v-model="localEditableJob.company"
        type="text"
        class="w-full p-1 border rounded border-color"
        placeholder="Company name" />
    </p>

    <p class="mb-2 text-sm">
      <!-- Editable company link -->
      <input
        v-model="localEditableJob.link"
        type="text"
        class="w-full p-1 border rounded border-color"
        placeholder="Company link" />
    </p>
    <p class="text-sm text-justify break-words">
      <!-- Editable job description -->
      <textarea
        v-model="localEditableJob.description"
        class="w-full p-1 border rounded border-color custom-scrollbar"
        placeholder="Job description"></textarea>
    </p>

    <div class="flex justify-end gap-2 pt-2">
      <!-- Delete and Save buttons -->
      <RouterButton
        label="Delete job"
        icon="heroicons-solid:trash"
        icon-position="left"
        @click="handleDelete" />
      <RouterButton
        label="Save changes"
        icon="heroicons-solid:check"
        icon-position="left"
        @click="handleSave" />
    </div>
  </div>
</template>
