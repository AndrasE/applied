<script setup lang="ts">
import { computed, reactive } from "vue";
import ActionButton from "./ActionButton.vue";
import RouterButton from "./RouterButton.vue";

interface Job {
  id: number;
  title: string;
  description: string;
  company: string;
  link: string;
}

const props = withDefaults(
  defineProps<{
    job: Job;
    charLimit?: number;
  }>(),
  {
    charLimit: undefined,
    buttonType: undefined,
  }
);

const emit = defineEmits<{
  (e: "update", job: Job): void;
}>();

// Local reactive copy to allow editing
const editableJob = reactive({ ...props.job });

const limit = computed(() => props.charLimit ?? props.job.description.length);

const emitUpdate = () => {
  emit("update", { ...editableJob });
};
</script>

<template>
  <div aria-label="job card" class="p-4 border rounded border-color">
    <!-- Editable Title -->
    <h2 class="mb-1 text-lg">
      <template v-if="viewingMode === 'browsing' || viewingMode === 'viewing'">
        {{ job.title }}
      </template>
      <template v-else>
        <input
          v-model="editableJob.title"
          class="w-full p-1 border border-color rounded"
          type="text"
          placeholder="Job title" />
      </template>
    </h2>

    <!-- Editable Company -->
    <p class="mb-2 text-sm">
      <template v-if="viewingMode === 'browsing' || viewingMode === 'viewing'">
        {{ job.company }}
      </template>
      <template v-else>
        <input
          v-model="editableJob.company"
          class="w-full p-1 border border-color rounded"
          type="text"
          placeholder="Company name" />
      </template>
    </p>

    <!-- Editable Description -->
    <p class="mb-2 text-sm text-justify break-words">
      <template v-if="viewingMode === 'viewing'">
        {{
          job.description.length > limit
            ? job.description.slice(0, limit) + "..."
            : job.description
        }}
        {{ job.description.slice(0, limit)
        }}{{ job.description.length > limit ? "..." : "" }}
      </template>
      <template v-else>
        <textarea
          v-model="editableJob.description"
          rows="18"
          class="w-full p-1 custom-scrollbar border border-color rounded"
          placeholder="Job description"></textarea>
      </template>
    </p>

    <!-- Action Buttons -->
    <div class="flex justify-start items-center mt-2">
      <RouterButton
        v-if="!editable"
        :to="`/jobs/${job.id}`"
        label="Read more"
        icon="heroicons-solid:arrow-right" />
    </div>
    <div class="flex justify-end items-center mt-2">
      <ActionButton
        v-if="!editable && buttonType === 'update'"
        outlineBtn
        deleteBtn
        label="Delete"
        @click="emitUpdate"
        customClass="mt-2" />
      <ActionButton
        v-if="!editable && buttonType === 'update'"
        outlineBtn
        label="Update"
        @click="emitUpdate"
        customClass="mt-2" />

      <ActionButton
        v-if="editable && buttonType === 'delete'"
        outlineBtn
        deleteBtn
        label="Cancel"
        @click="emitUpdate" />
      <ActionButton
        v-if="editable && buttonType === 'delete'"
        outlineBtn
        label="Update"
        @click="emitUpdate" />
    </div>
  </div>
</template>
