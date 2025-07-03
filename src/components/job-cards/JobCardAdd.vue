<script setup lang="ts">
// JobCardAdd.vue: Form for adding a new job
import { reactive, watch } from "vue";
import { useRouter } from "vue-router";
import RouterButton from "../ui/RouterButton.vue";
import type { Job } from "../../types/job";

// Props for v-model binding of the editable job object
const props = defineProps<{
  modelValue: Job;
}>();

// Emits: update:modelValue for v-model, plus add event
const emit = defineEmits<{
  (e: "update:modelValue", job: Job): void;
  (e: "add", job: Job): void;
}>();

// Local reactive copy for editing
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

const router = useRouter();

// Emit add event to parent
function handleAdd() {
  console.log("✅ JobCardAdd.vue: Emitting 'add'", localEditableJob);
  emit("add", localEditableJob);
}
</script>

<template>
  <!-- Form for adding a job -->
  <form @submit.prevent="handleAdd">
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
        <!-- Add job button -->
        <RouterButton
          :onClick="handleAdd"
          label="Add job"
          icon="heroicons-solid:plus"
          iconPosition="left"
          type="submit" />
      </div>
    </div>
  </form>
</template>
