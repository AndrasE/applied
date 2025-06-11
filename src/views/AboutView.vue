<script setup lang="ts">
import Container from "@/components/ui/Container.vue";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
import { reactive, ref } from "vue";
import { Icon } from "@iconify/vue";
import type { Job } from "@/types/job";

const props = defineProps<{
  job: Job;
  charLimit?: number;
  viewingMode: "browsing" | "viewing" | "editing" | "adding";
  statusIconCustomClass?: string;
}>();
console.log("Viewing mode received:", props.viewingMode);
const editableJob = reactive({ ...props.job });

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
  <Container>
    <Menu
      as="div"
      class="relative inline-block text-left w-full sm:w-auto flex-1">
      <div>
        <MenuButton
          class="inline-flex items-center justify-between w-full p-1 rounded border border-color bg-[var(--bg-light)] dark:bg-[var(--bg-dark)] text-gray-700 dark:text-gray-300">
          <span>{{ editableJob.status || "Select job status" }}</span>
          <Icon
            icon="mdi:chevron-down"
            class="w-4 h-4 ml-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
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
          class="origin-top-right absolute right-0 mt-1 w-full sm:w-36 rounded-sm border border-color shadow-lg z-10 bg-[var(--bg-light)] dark:bg-[var(--bg-dark)] focus:outline-none">
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
                :class="[
                  'block w-full text-left px-3 py-2 text-sm rounded-sm',
                  // Highlight when active (hover/focus)
                  active
                    ? 'text-[var(--green-accent-light)] dark:text-[var(--green-accent-dark)]'
                    : 'text-gray-700 dark:text-gray-300',
                  // Highlight when selected (current value)
                  statusOption === editableJob.status
                    ? 'bg-gray-100 dark:bg-gray-700 font-semibold' // Add specific style for selected
                    : '',
                ]">
                {{ statusOption }}
              </button>
            </MenuItem>
          </div>
        </MenuItems>
      </transition>
    </Menu>
  </Container>
</template>
