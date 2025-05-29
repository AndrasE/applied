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

const emit = defineEmits<{
  (e: "update", job: Job): void;
  (e: "delete", id: number): void;
}>();
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
    <p class="text-sm text-justify break-words">
      <!-- 'browsing' or 'viewing' mode -->
      <template v-if="viewingMode === 'browsing' || viewingMode === 'viewing'">
        <!-- Truncate description if too long -->
        {{ truncatedDescription }}
      </template>
      <!-- 'editing' or 'adding' mode (adding mode description reset to empty string) -->
      <template v-else>
        <textarea
          v-model="editableJob.description"
          rows="33"
          class="w-full p-1 custom-scrollbar border border-color rounded"
          placeholder="Job description"></textarea>
      </template>
    </p>

    <!-- Action Buttons -->
    <div
      class="flex flex-col sm:flex-row justify-between sm:items-center mt-4 gap-2">
      <!-- 'browsing' mode: browsing -->
      <ButtonLinkWithIcon
        v-if="viewingMode === 'browsing'"
        :to="`/jobs/${job.id}`"
        label="Read more"
        icon="heroicons-solid:arrow-right" />

      <!-- Button group aligned right -->
      <div class="flex-1 flex justify-end gap-2">
        <!-- 'viewing' mode: viewing -->
        <template v-if="viewingMode === 'viewing'">
          <ButtonLinkWithIcon
            :to="`/jobs/${job.id}/update`"
            label="Update job"
            icon-position="left"
            icon="heroicons-solid:pencil-alt"
            @click="$emit('update', editableJob)" />
        </template>

        <!-- viewing mode: editing -->
        <template v-else-if="viewingMode === 'editing'">
          <ButtonLinkWithIcon
            label="Delete job"
            icon-position="left"
            icon="heroicons-solid:trash"
            :to="`/jobs`"
            @click="$emit('delete', job.id)" />
          <ButtonLinkWithIcon
            label="Save changes"
            icon-position="left"
            icon="heroicons-solid:check"
            @click="$emit('update', editableJob)" />
        </template>
      </div>
    </div>
  </div>
</template>
