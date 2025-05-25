<script setup lang="ts">
import { computed, reactive } from "vue";
import ButtonLinkWithIcon from "./ButtonLinkWithIcon.vue";

interface Job {
  id: number;
  title: string;
  description: string;
  company: string;
  link: string;
}

const props = defineProps<{
  job: Job;
  charLimit?: number;
  showLinkButton?: boolean;
  editable?: boolean;
}>();

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
      <template v-if="editable">
        <input
          v-model="editableJob.title"
          class="w-full p-1 border border-color rounded"
          type="text"
          placeholder="Job title" />
      </template>
      <template v-else>
        {{ job.title }}
      </template>
    </h2>

    <!-- Editable Company -->
    <p class="mb-2 text-sm">
      <template v-if="editable">
        <input
          v-model="editableJob.company"
          class="w-full p-1 border border-color rounded"
          type="text"
          placeholder="Company name" />
      </template>
      <template v-else>
        {{ job.company }}
      </template>
    </p>

    <!-- Editable Description -->
    <p class="mb-2 text-sm text-justify break-words">
      <template v-if="editable">
        <textarea
          v-model="editableJob.description"
          rows="18"
          class="w-full p-1 custom-scrollbar border border-color rounded"
          placeholder="Job description"></textarea>
      </template>
      <template v-else>
        {{ job.description.slice(0, limit)
        }}{{ job.description.length > limit ? "..." : "" }}
      </template>
    </p>

    <!-- Action Buttons -->
    <div class="flex justify-between items-center mt-2">
      <ButtonLinkWithIcon
        v-if="!editable && showLinkButton !== false"
        as="link"
        :to="`/jobs/${job.id}`"
        label="Read more"
        icon="heroicons-solid:arrow-right" />

      <button
        v-if="editable"
        @click="emitUpdate"
        class="text-sm px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
        Save
      </button>
    </div>
  </div>
</template>
