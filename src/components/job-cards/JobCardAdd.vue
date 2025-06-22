<script setup lang="ts">
import { reactive, watch } from "vue";
import { useRouter } from "vue-router";
import RouterButton from "../ui/RouterButton.vue";
import type { Job } from "../../types/job";

const props = defineProps<{
  modelValue: Job;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", job: Job): void;
  (e: "add", job: Job): void;
}>();

const localEditableJob = reactive({ ...props.modelValue });

watch(
  () => props.modelValue,
  (newValue) => {
    Object.assign(localEditableJob, newValue);
  },
  { deep: true, immediate: true }
);

watch(
  localEditableJob,
  (newValue) => {
    emit("update:modelValue", newValue);
  },
  { deep: true }
);

const router = useRouter();

function handleAdd() {
  console.log("✅ JobCardAdd.vue: Emitting 'add'", localEditableJob);
  emit("add", localEditableJob);
}
</script>

<template>
  <!-- Wrap everything in a <form> and use @submit.prevent -->
  <form @submit.prevent="handleAdd">
    <div>
      <div class="flex items-start justify-between">
        <h2 class="w-full mb-1 text-lg">
          <input
            v-model="localEditableJob.title"
            type="text"
            class="w-full p-1 border rounded border-color"
            placeholder="Job title" />
        </h2>
      </div>

      <p class="mb-2 text-sm">
        <input
          v-model="localEditableJob.company"
          type="text"
          class="w-full p-1 border rounded border-color"
          placeholder="Company name" />
      </p>

      <p class="text-sm text-justify break-words">
        <textarea
          v-model="localEditableJob.description"
          class="w-full p-1 border rounded border-color custom-scrollbar"
          placeholder="Job description"></textarea>
      </p>

      <div class="flex justify-end gap-2 pt-2">
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
