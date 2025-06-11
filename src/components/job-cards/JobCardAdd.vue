<script setup lang="ts">
import { reactive, watch } from "vue";
import RouterButton from "../ui/RouterButton.vue";
import type { Job } from "../../types/job";

// Props for v-model binding of the job object (initially empty from parent)
const props = defineProps<{
  modelValue: Job;
}>();

// Emits: update:modelValue for v-model, plus add event
const emit = defineEmits<{
  (e: "update:modelValue", job: Job): void;
  (e: "add", job: Job): void;
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

// Handle Add action
function handleAdd() {
  emit("add", localEditableJob);
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
        label="Add job"
        icon="heroicons-solid:plus"
        icon-position="left"
        custom-class="pt-2 xl:pt-0 mr-2"
        @click="handleAdd" />
    </div>
  </div>
</template>
