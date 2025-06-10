<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import RouterButton from "./RouterButton.vue";
import { Icon } from "@iconify/vue";
import type { Job } from "@/types/job";

import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";

const props = defineProps<{
  job: Job;
  charLimit?: number;
  viewingMode: "browsing" | "viewing" | "editing" | "adding";
  statusIconCustomClass?: string;
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

// Function to update date to today
function updateDateToToday() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = String(today.getFullYear()).slice(-2); // get last 2 digits
  editableJob.date = `${day}/${month}/${year}`;
}

// Status icon mapping based on JobStatus type (all lowercase)
const statusIconInfo = computed(() => {
  switch (props.job.status ?? "unknown") {
    case "applied":
      return {
        icon: "heroicons:check-circle",
        label: "Applied",
        class:
          "text-[var(--green-accent-light)] dark:text-[var(--green-accent-dark)]",
      };
    case "1st round":
    case "2nd round":
    case "3rd round":
      return {
        icon: "heroicons:exclamation-circle",
        label: "Interview round",
        class: "text-yellow-500 dark:text-yellow-200 text-2xl",
      };
    case "rejected":
      return {
        icon: "heroicons:x-circle",
        label: "Rejected",
        class: "text-red-500 dark:text-red-400 text-2xl",
      };
    case "no response":
      return {
        icon: "heroicons:minus-circle",
        label: "No response",
        class: "text-red-500 dark:text-red-400 text-2xl",
      };
    case "job offer":
      return {
        icon: "heroicons:sparkles",
        label: "job offer",
        class:
          "text-[var(--green-accent-light)] dark:text-[var(--green-accent-dark)]",
      };
    default:
      return {
        icon: "heroicons:question-mark-circle",
        label: "",
        class: "text-gray-500 dark:text-gray-400 text-2xl",
      };
  }
});

const statusTextClass = computed(() => {
  switch (props.job.status ?? "unknown") {
    case "applied":
      return "bg-[var(--green-accent-light)] dark:bg-[var(--green-accent-dark)] text-[var(--bg-light)] dark:text-[var(--bg-dark)] px-0.5 rounded-sm mt-1.5 sm:mt-0";
    case "1st round":
    case "2nd round":
    case "3rd round":
      return "bg-yellow-500 dark:bg-yellow-200 rounded text-[var(--bg-light)] dark:text-[var(--bg-dark)] px-0.5 rounded-sm mt-1.5 sm:mt-0";
    case "no response":
    case "rejected":
      return "bg-red-500 dark:bg-red-400 text-[var(--bg-light)] dark:text-[var(--bg-dark)] px-0.5 rounded-sm mt-1.5 sm:mt-0";
    case "job offer":
      return "bg-[var(--green-accent-light)] dark:bg-[var(--green-accent-dark)] text-[var(--bg-light)] dark:text-[var(--bg-dark)] px-0.5 rounded-sm mt-1.5 sm:mt-0";
    default:
      return "bg-gray-500 dark:bg-gray-400 text-[var(--bg-light)] dark:text-[var(--bg-dark)] px-0.5 rounded-sm mt-1.5 sm:mt-0";
  }
});
const jobStatusOptions = ref([
  "applied",
  "1st round",
  "2nd round",
  "3rd round",
  "rejected",
  "no response",
  "job offer",
]);
</script>

<template>
  <div aria-label="job card" class="p-4 rounded border border-color">
    <!-- Job title  and status -->
    <div class="flex items-start justify-between">
      <h2 class="mb-1 w-full text-lg">
        <!-- Browse or view mode -->
        <template
          v-if="viewingMode === 'browsing' || viewingMode === 'viewing'">
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
      <!-- Status icons browsing mode -->
      <template v-if="viewingMode === 'browsing'">
        <div class="flex flex-col items-end">
          <Icon
            :area-label="statusIconInfo.label"
            :icon="statusIconInfo.icon"
            :class="[statusIconCustomClass, statusIconInfo.class]" />
        </div>
      </template>

      <!-- status text -->
      <template v-if="viewingMode === 'viewing'">
        <div class="flex flex-col items-end">
          <span
            class="flex items-center text-xs ml-2 whitespace-nowrap"
            :class="statusTextClass">
            {{ job.status ?? "unknown" }}
          </span>
          <!-- Date -->
          <span class="text-xs">{{ job.date }}</span>
        </div>
      </template>
    </div>

    <!-- Status input and date for editing mode -->
    <template v-if="viewingMode === 'editing'">
      <div
        class="flex flex-col sm:flex-row text-sm justify-between gap-1 w-full mb-1">
        <Menu
          as="div"
          class="relative inline-block text-left w-full sm:w-auto flex-1 group">
          <div>
            <MenuButton
              class="inline-flex items-center justify-between w-full p-1 rounded border border-color bg-[var(--bg-light)] dark:bg-[var(--bg-dark)] text-gray-700 dark:text-gray-300 focus:ring-1 focus:ring-slate-700 dark:focus:ring-slate-300">
              <span>{{ editableJob.status || "Select job status" }}</span>
              <Icon
                icon="mdi:chevron-down"
                class="ml-2 h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-[var(--green-accent-light)] dark:group-hover:text-[var(--green-accent-dark)]"
                aria-label="update date" />
            </MenuButton>
          </div>

          <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95">
            <MenuItems
              class="origin-top-right absolute right-0 mt-1 w-full rounded-sm border border-color z-10 bg-[var(--bg-light)] dark:bg-[var(--bg-dark)] focus:outline-none">
              <div class="p-1">
                <MenuItem disabled>
                  <span
                    class="block px-3 py-2 text-sm text-gray-00 cursor-not-allowed text-gray-500 dark:text-gray-400">
                    Select job status
                  </span>
                </MenuItem>

                <MenuItem
                  v-for="statusOption in jobStatusOptions"
                  :key="statusOption"
                  v-slot="{ active }">
                  <button
                    @click="editableJob.status = statusOption as Job['status']"
                    :class="[
                      'block w-full text-left px-3 py-2 text-sm rounded-sm ',
                      // Highlight when active (hover/focus)
                      active
                        ? 'text-[var(--green-accent-light)] dark:text-[var(--green-accent-dark)]'
                        : '',
                      // Highlight when selected (current value)
                      statusOption === editableJob.status
                        ? ' text-[var(--green-accent-light)] dark:text-[var(--green-accent-dark)]'
                        : '',
                    ]">
                    {{ statusOption }}
                  </button>
                </MenuItem>
              </div>
            </MenuItems>
          </transition>
        </Menu>
        <div
          class="flex flex-row relative items-center gap-1 w-full sm:w-auto sm:flex-1 group">
          <input
            v-model="editableJob.date"
            type="text"
            readonly
            placeholder="Date"
            class="w-full flex-1 rounded border p-1 border-color cursor-auto" />

          <Icon
            icon="heroicons-solid:refresh"
            aria-label="update date"
            class="text-2xl absolute right-1 cursor-pointer text-gray-500 dark:text-gray-400 group-hover:text-[var(--green-accent-light)] dark:group-hover:text-[var(--green-accent-dark)]"
            @click="updateDateToToday" />
        </div>
      </div>
    </template>

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
      <template v-if="viewingMode === 'browsing'">
        <RouterButton
          :to="`/jobs/${job.id}`"
          label="Read more"
          icon="heroicons-solid:arrow-right"
          custom-class="pt-2" />
      </template>
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
        <template v-else-if="viewingMode === 'adding'">
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
