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

// --- Get the app store instance ---
const appStore = useAppStore();

// --- On mount, ensure jobs listener is active and scroll to top ---
onMounted(() => {
  appStore.ensureJobsListenerActive();
  window.scrollTo(0, 0);
});

// --- COMPUTED PROPERTIES FOR METRICS ---
// Count of jobs in active statuses
const activeJobsCount = computed(() => {
  return appStore.jobs.filter(
    (job) =>
      job.status === "applied" ||
      job.status === "1st round" ||
      job.status === "2nd round" ||
      job.status === "3rd round" ||
      job.status === "job offer"
  ).length;
});

// Count of jobs with offer status
const offerCount = computed(() => {
  return appStore.jobs.filter((job) => job.status === "job offer").length;
});

// Count of jobs with rejected status
const rejectedCount = computed(() => {
  return appStore.jobs.filter((job) => job.status === "rejected").length;
});

// Count of jobs with no response status
const noResponseCount = computed(() => {
  return appStore.jobs.filter((job) => job.status === "no response").length;
});

// Total jobs is simply the length of the entire jobs array
const totalJobsCount = computed(() => appStore.jobs.length);
</script>

<template>
  <Container>
    <PageHeader label="Stats" />
    <Divider label="your progress" labelPosition="top" />

    <div
      class="flex flex-col items-center justify-between w-full mb-12 padding950and640">
      <!-- Skeleton loading state while fetching jobs -->
      <template v-if="appStore.isCurrentlyFetching">
        <div class="w-full mb-5">
          <div
            class="flex flex-row w-full justify-between px-2 py-4 sm:px-6 mb-9 h-19 border border-[var(--skeleton-light)] dark:border-[var(--skeleton-dark)] rounded animate-pulse">
            <div
              v-for="n in 5"
              :key="n"
              class="w-10 h-10 bg-[var(--skeleton-light)] dark:bg-[var(--skeleton-dark)] rounded"></div>
          </div>
          <div
            class="w-full border border-[var(--skeleton-light)] dark:border-[var(--skeleton-dark)] rounded animate-pulse">
            <div
              class="mt-3 mb-6 h-12 w-56 bg-[var(--skeleton-light)] dark:bg-[var(--skeleton-dark)] rounded mx-auto"></div>
            <div
              aria-hidden="true"
              class="flex mx-4 mb-6 h-54 sm:h-80 flex-col items-center justify-center rounded bg-[var(--skeleton-light)] text-tiny text-gray-500 subtle-pulse tracking-widest dark:bg-[var(--skeleton-dark)] dark:text-gray-400">
              <p class="mt-2">loading</p>
              <Icon class="ml-1 text-2xl" icon="svg-spinners:3-dots-fade" />
            </div>
          </div>
        </div>
      </template>

      <!-- Metrics and chart when jobs are loaded -->
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
