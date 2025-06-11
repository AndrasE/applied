<script setup lang="ts">
import { computed, ref } from "vue";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
import { Icon } from "@iconify/vue";
import type { Job } from "@/types/job"; // Assuming Job type is here or accessible

// Props: modelValue for v-model binding
const props = defineProps<{
  modelValue: Job["status"]; // The current status to display and update
}>();

// Emits: update:modelValue for v-model binding
const emit = defineEmits<{
  (e: "update:modelValue", status: Job["status"]): void;
}>();

// Internal list of status options
const jobStatusOptions = ref<Job["status"][]>([
  "applied",
  "1st round",
  "2nd round",
  "3rd round",
  "rejected",
  "no response",
  "job offer",
]);

// Computed property to display the selected status, or a default
const displayedStatus = computed(() => {
  return props.modelValue || "Select job status";
});

// Function to update the status and emit the event
function selectStatus(status: Job["status"]) {
  emit("update:modelValue", status);
}
</script>

<template>
  <Menu
    as="div"
    class="relative inline-block text-left w-full sm:w-auto flex-1 group">
    <div>
      <MenuButton
        class="inline-flex items-center justify-between w-full p-1 rounded border border-color bg-[var(--bg-light)] dark:bg-[var(--bg-dark)] text-gray-700 dark:text-gray-300 focus:ring-1 focus:ring-slate-700 dark:focus:ring-slate-300">
        <span>{{ displayedStatus }}</span>
        <Icon
          icon="mdi:chevron-down"
          class="ml-2 h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-[var(--green-accent-light)] dark:group-hover:text-[var(--green-accent-dark)] cursor-pointer"
          aria-label="Toggle job status dropdown" />
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
        class="origin-top-right absolute right-0 mt-1 w-full rounded-sm border border-color shadow-lg z-10 bg-[var(--bg-light)] dark:bg-[var(--bg-dark)] focus:outline-none">
        <div class="p-1">
          <MenuItem disabled>
            <span
              class="block px-3 py-2 text-sm text-gray-500 cursor-not-allowed">
              Select job status
            </span>
          </MenuItem>

          <MenuItem
            v-for="statusOption in jobStatusOptions"
            :key="statusOption"
            v-slot="{ active }">
            <button
              @click="selectStatus(statusOption)"
              :class="[
                'block w-full text-left px-3 py-2 text-sm rounded-sm',
                active
                  ? 'text-[var(--green-accent-light)] dark:text-[var(--green-accent-dark)]'
                  : '',
                statusOption === modelValue
                  ? '  text-[var(--green-accent-light)] dark:text-[var(--green-accent-dark)] '
                  : '',
              ]">
              {{ statusOption }}
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>
