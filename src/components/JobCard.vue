<script setup lang="ts">
import { computed, reactive, watch } from "vue";
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
  viewingMode: "browsing" | "viewing" | "editing" | "adding";
}>();
console.log("Viewing mode received:", props.viewingMode);

const emit = defineEmits<{
  (e: "update", job: Job): void;
}>();

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

const limit = computed(() =>
  props.charLimit != null ? props.charLimit : props.job.description.length
);

const truncatedDescription = computed(() => {
  const desc = props.job.description;
  return desc.length > limit.value ? desc.slice(0, limit.value) + "..." : desc;
});
</script>

<template>
  <div aria-label="job card" class="p-4 border rounded border-color">
    <!-- Job Title -->
    <h2 class="mb-1 text-lg">
      <!-- 'browsing' or 'viewing' mode -->
      <template v-if="viewingMode === 'browsing' || viewingMode === 'viewing'">
        {{ job.title }}
      </template>
      <!-- 'editing' or 'adding' mode (adding mode title reset to empty string) -->
      <template v-else>
        <input
          v-model="editableJob.title"
          class="w-full p-1 border border-color rounded"
          type="text"
          placeholder="Job title" />
      </template>
    </h2>

    <!-- Job Company -->
    <p class="mb-2 text-sm">
      <!-- 'browsing' or 'viewing' mode -->
      <template v-if="viewingMode === 'browsing' || viewingMode === 'viewing'">
        {{ job.company }}
      </template>
      <!--  'editing' or 'adding' mode (adding mode company reset to empty string) -->
      <template v-else>
        <input
          v-model="editableJob.company"
          class="w-full p-1 border border-color rounded"
          type="text"
          placeholder="Company name" />
      </template>
    </p>

    <!-- Job Description -->
    <p class="mb-2 text-sm text-justify break-words">
      <!-- 'browsing' or 'viewing' mode -->
      <template v-if="viewingMode === 'browsing' || viewingMode === 'viewing'">
        <!-- Truncate description if too long -->
        {{ truncatedDescription }}
      </template>
      <!-- 'editing' or 'adding' mode (adding mode description reset to empty string) -->
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
      <ButtonLinkWithIcon
        v-if="viewingMode === 'browsing'"
        :to="`/jobs/${job.id}`"
        label="Read more"
        icon="heroicons-solid:arrow-right" />
    </div>
  </div>
</template>
