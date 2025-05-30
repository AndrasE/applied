<script setup lang="ts">
import { computed, reactive, watch } from "vue";
import RouterButton from "./RouterButton.vue";

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
  viewingMode: "browsing" | "viewing" | "editing" | "adding";
}>();
console.log("Viewing mode received:", props.viewingMode);

// Local reactive copy to allow editing
const editableJob = reactive({ ...props.job });

// Watch for mode changes and reset editable fields in 'adding' mode
watch(
  () => props.viewingMode,
  (newMode) => {
    if (newMode === "adding") {
      // Clear editable fields for new entry
      editableJob.title = "";
      editableJob.company = "";
      editableJob.description = "";
      editableJob.link = "";
    } else if (newMode === "editing") {
      // Reset to current job values for editing
      Object.assign(editableJob, props.job);
    }
  },
  { immediate: true } // Run it on first load
);

// Character limit for description or fallback to full length
const limit = computed(() =>
  props.charLimit != null ? props.charLimit : props.job.description.length
);

// Truncate description based on character limit
const truncatedDescription = computed(() => {
  const desc = props.job.description;
  return desc.length > limit.value ? desc.slice(0, limit.value) + "..." : desc;
});

// Emit events for update and delete actions
const emit = defineEmits<{
  (e: "update", job: Job): void;
  (e: "delete", id: number): void;
  (e: "add", job: Job): void;
}>();
</script>

<template>
  <div aria-label="job card" class="p-4 rounded border border-color">
    <!-- Job title -->
    <h2 class="mb-1 text-lg">
      <!-- Browse or view mode -->
      <template v-if="viewingMode === 'browsing' || viewingMode === 'viewing'">
        {{ job.title }}
      </template>
      <!-- Update or add mode -->
      <template v-else>
        <input
          v-model="editableJob.title"
          type="text"
          class="w-full rounded border border-color p-1"
          placeholder="Job title" />
      </template>
    </h2>

    <!-- Company name -->
    <p class="mb-2 text-sm">
      <!-- Browse or view mode -->
      <template v-if="viewingMode === 'browsing' || viewingMode === 'viewing'">
        {{ job.company }}
      </template>
      <!-- Update or add mode -->
      <template v-else>
        <input
          v-model="editableJob.company"
          type="text"
          class="w-full rounded border border-color p-1"
          placeholder="Company name" />
      </template>
    </p>

    <!-- Description -->
    <p class="text-sm text-justify break-words">
      <!--  Browse or view mode -->
      <template v-if="viewingMode === 'browsing' || viewingMode === 'viewing'">
        {{ truncatedDescription }}
      </template>
      <!-- Update or add mode -->
      <template v-else>
        <textarea
          v-model="editableJob.description"
          class="w-full rounded border border-color p-1 custom-scrollbar"
          placeholder="Job description"></textarea>
      </template>
    </p>

    <!-- Buttons and links based on mode -->
    <div class="flex">
      <!-- Browse mode  -->
      <RouterButton
        v-if="viewingMode === 'browsing'"
        :to="`/jobs/${job.id}`"
        label="Read more"
        icon="heroicons-solid:arrow-right"
        custom-class="pt-2" />
      <div class="flex flex-1 justify-end gap-2">
        <!-- Viewing mode -->
        <template v-if="viewingMode === 'viewing'">
          <RouterButton
            :to="`/jobs/${job.id}/update`"
            label="Update job"
            icon="heroicons-solid:pencil-alt"
            icon-position="left"
            custom-class="pt-2"
            @click="$emit('update', editableJob)" />
        </template>
        <!-- Editing mode -->
        <template v-else-if="viewingMode === 'editing'">
          <RouterButton
            :to="`/jobs`"
            label="Delete job"
            icon="heroicons-solid:trash"
            icon-position="left"
            custom-class="pt-2 xl:pt-0  mr-2  "
            @click="$emit('delete', job.id)" />
          <RouterButton
            :to="`/jobs/${job.id}`"
            label="Save changes"
            icon="heroicons-solid:check"
            icon-position="left"
            custom-class="pt-2 xl:pt-0 "
            @click="$emit('update', editableJob)" />
        </template>
        <!-- Adding mode -->
        <template v-else>
          <RouterButton
            :to="`/jobs`"
            label="Add job"
            icon="heroicons-solid:plus"
            icon-position="left"
            custom-class="pt-2 xl:pt-0 mr-2"
            @click="$emit('add', editableJob)" />
        </template>
      </div>
    </div>
  </div>
</template>
