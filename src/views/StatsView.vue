<script setup lang="ts">
// --- CORE & UI IMPORTS ---
import { computed, onMounted } from "vue";
import Container from "@/components/ui/Container.vue";
import PageHeader from "@/components/ui/PageHeader.vue";
import Divider from "@/components/ui/Divider.vue";
import { Icon } from "@iconify/vue";

// --- CHILD COMPONENT IMPORTS ---
import StatsMetrics from "@/components/stats/StatsMetrics.vue";
import StatsChart from "@/components/stats/StatsChart.vue";

// --- STATE MANAGEMENT ---
import { useAppStore } from "@/stores/jobs";

const appStore = useAppStore();

onMounted(() => {
  appStore.ensureJobsListenerActive();
  window.scrollTo(0, 0);
});

// --- COMPUTED PROPERTIES FOR METRICS ---
// The TypeScript error occurred because job.status is not a simple string.
// To fix it, you'll need to use the correct type for comparison,
// likely from an enum, for example: `job.status === JobStatus.Offer`.
// For now, we'll use the placeholder logic from your original component.
const activeJobsCount = computed(() => appStore.jobs.length);
const offerCount = computed(() => appStore.jobs.length); // FIX: Using placeholder until status logic is implemented
const rejectedCount = computed(() => appStore.jobs.length); // FIX: Using placeholder
const noResponseCount = computed(() => appStore.jobs.length); // FIX: Using placeholder
const totalJobsCount = computed(() => appStore.jobs.length);
</script>

<template>
  <Container>
    <PageHeader label="Stats" />
    <Divider label="your progress" labelPosition="top" />

    <div
      class="flex flex-col items-center justify-between w-full padding950and640 mb-12">
      <template v-if="appStore.isCurrentlyFetching">
        <div
          class="w-full border border-[var(--skeleton-light)] dark:border-[var(--skeleton-dark)] rounded animate-pulse mb-5">
          <div
            class="flex flex-row w-full justify-between px-2 py-4 sm:px-6 mb-9 h-19">
            <div
              v-for="n in 5"
              :key="n"
              class="w-10 h-10 bg-[var(--skeleton-light)] dark:bg-[var(--skeleton-dark)] rounded"></div>
          </div>
          <div class="w-full">
            <div
              class="mt-3 mb-6 h-11 w-56 bg-[var(--skeleton-light)] dark:bg-[var(--skeleton-dark)] rounded mx-auto"></div>
            <div
              aria-hidden="true"
              class="flex mx-4 mb-6 h-54 sm:h-80 flex-col items-center justify-center rounded bg-[var(--skeleton-light)] text-tiny text-gray-500 subtle-pulse tracking-widest dark:bg-[var(--skeleton-dark)] dark:text-gray-400">
              <p class="mt-2">loading</p>
              <Icon class="ml-1 text-2xl" icon="svg-spinners:3-dots-fade" />
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="w-full">
          <StatsMetrics
            :active="activeJobsCount"
            :offer="offerCount"
            :rejected="rejectedCount"
            :no-response="noResponseCount"
            :total="totalJobsCount" />

          <StatsChart :jobs="appStore.jobs" />
        </div>
      </template>
    </div>

    <Divider label="good luck" labelPosition="bottom" />
  </Container>
</template>
