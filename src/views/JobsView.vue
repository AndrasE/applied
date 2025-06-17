<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { ref as dbRef, onValue } from "firebase/database";
import { database } from "../config/database";
import Container from "@/components/ui/Container.vue";
import PageHeader from "@/components/ui/PageHeader.vue";
import Divider from "@/components/ui/Divider.vue";
import JobCard from "@/components/job-cards/JobCard.vue";
import RouterButton from "@/components/ui/RouterButton.vue";
import { Icon } from "@iconify/vue";
import type { Job, JobStatus } from "@/types/job";

import { useAppStore } from "../stores/jobs"; // Pinia store
const appStore = useAppStore(); // Use the store

// Variables for the *current* component's loading sequence,
// only relevant if appStore.jobsDataLoadedOnce is false
let snapshotReceived: boolean = false;
let minTimerDone: boolean = false;

// Firebase refs
// If 'jobs' is in the store, you'd use appStore.jobs directly,
// otherwise keep it local if only this component needs it
const jobs = ref<Job[]>([]); // Keep jobs local if it's not truly global state
const viewStyle = ref<string>(localStorage.getItem("jobsViewStyle") || "list");
const DEFAULT_LIMIT = 8;
const limit = ref<number>(DEFAULT_LIMIT);

// Setup Firebase listener
let unsubscribe: (() => void) | null = null;

// isJobsSkeletonReady now directly reflects the store's state
// It will be true if the store says data was loaded once, false otherwise.
// Since appStore.jobsDataLoadedOnce is a ref inside the store, this computed
// will react to its changes.
const isJobsSkeletonReady = computed(() => appStore.jobsDataLoadedOnce);
const skeletonMinDuration = 250; // ms

const attachFirebaseListener = () => {
  const jobsRef = dbRef(database, "jobs");
  const unsubscribeFn = onValue(
    jobsRef,
    (snapshot) => {
      const jobsData: Job[] = [];
      snapshot.forEach((childSnapshot) => {
        const job = childSnapshot.val();
        jobsData.push({
          ...job,
          id: childSnapshot.key,
          status: job.status as JobStatus,
        });
      });
      jobs.value = jobsData;

      // ONLY trigger the skeleton "completion" logic if it's the very first load
      if (!appStore.jobsDataLoadedOnce) {
        snapshotReceived = true;
        if (minTimerDone) {
          appStore.setJobsDataLoaded(); // Update Pinia store: hide skeleton, mark as loaded
        }
      }
      // If appStore.jobsDataLoadedOnce is already true, no action is needed here
      // regarding the skeleton, as it's already hidden.
      console.log("📥 Fetched jobs from Firebase:", jobsData);
    },
    (error) => {
      console.error("Firebase data fetch error:", error);
      // On error, still mark as loaded to hide skeleton and show potential error message
      if (!appStore.jobsDataLoadedOnce) {
        appStore.setJobsDataLoaded();
      }
    }
  );
  unsubscribe = unsubscribeFn;
};

onMounted(() => {
  // If data has already been loaded once in this app session (checked via store):
  if (appStore.jobsDataLoadedOnce) {
    console.log(
      "🚀 Data already loaded in this session, skipping initial skeleton logic."
    );
    attachFirebaseListener(); // Still attach listener for real-time updates
    return; // Exit onMounted
  }

  // --- Logic for the VERY FIRST load in the application session ---
  snapshotReceived = false;
  minTimerDone = false;

  // Start min duration timer
  setTimeout(() => {
    minTimerDone = true;
    if (snapshotReceived) {
      appStore.setJobsDataLoaded(); // Mark as loaded once globally
    }
  }, skeletonMinDuration);

  // Attach the listener for the first time in this session
  attachFirebaseListener();

  // Optionally, sync viewStyle with localStorage if it changes elsewhere
  const stored = localStorage.getItem("jobsViewStyle");
  if (stored && stored !== viewStyle.value) {
    viewStyle.value = stored;
  }
});

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe();
  }
});

const visibleJobs = computed(() => {
  return [...jobs.value].reverse().slice(0, limit.value);
});

const toggleLimit = () => {
  limit.value =
    limit.value === DEFAULT_LIMIT ? jobs.value.length : DEFAULT_LIMIT;
};

const changeView = (style: string) => {
  viewStyle.value = style;
  localStorage.setItem("jobsViewStyle", style);
};
</script>

<template>
  <Container>
    <PageHeader label="Recent applications" />

    <!-- toggle between list and grid  -->
    <div class="absolute flex-row hidden gap-3 top-12 right-4 sm:flex">
      <Icon
        type="button"
        aria-label="Toggle view list"
        @click="changeView('list')"
        icon="heroicons-solid:view-list"
        :class="[
          'text-xl text-hover',
          {
            'text-[var(--green-accent-light)] dark:text-[var(--green-accent-dark)]':
              viewStyle === 'list',
          },
        ]" />
      <Icon
        type="button"
        aria-label="Toggle view grid"
        @click="changeView('grid')"
        icon="flowbite:grid-outline"
        :class="[
          'text-xl text-hover',
          {
            'text-[var(--green-accent-light)] dark:text-[var(--green-accent-dark)]':
              viewStyle === 'grid',
          },
        ]" />
    </div>

    <Divider
      :label="viewStyle === 'grid' ? 'grid cols' : 'flex col'"
      labelPosition="top" />

    <!-- SKELETON LOADER -->
    <template v-if="!isJobsSkeletonReady">
      <div
        :class="[
          // These classes change based on viewStyle (grid or flex)
          viewStyle === 'grid'
            ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'flex flex-col gap-4',
          'w-full',
          'px-[1rem]',
          // margin950and640 utility class due to w-full need to be done separately
          'my-0',
          'sm:my-[1rem]',
          'md-lg:my-[1.5rem]',
        ]">
        <div
          v-for="n in DEFAULT_LIMIT"
          :key="'skeleton-' + n"
          class="py-5 px-4 border rounded border-[var(--skeleton-light)] dark:border-[var(--skeleton-dark)] bg-[var(--skeleton-bg-light)] dark:bg-[var(--skeleton-bg-dark)]">
          <div class="flex items-start justify-between animate-pulse">
            <!-- Title -->
            <div class="w-full mb-2">
              <div
                :class="[
                  'h-7 rounded bg-[var(--skeleton-light)] subtle-pulse dark:bg-[var(--skeleton-dark)]',
                  viewStyle === 'grid' ? 'w-3/4 xl:w-5/8' : 'w-3/4  md:w-1/3',
                ]"></div>
            </div>
            <!-- Status -->
            <div class="flex flex-col items-end">
              <div
                class="w-6 h-6 bg-[var(--skeleton-light)] subtle-pulse dark:bg-[var(--skeleton-dark)] rounded-full ml-1"></div>
            </div>
          </div>
          <!-- Company -->
          <div class="mb-2">
            <div
              :class="[
                'h-6 mb-1 rounded bg-[var(--skeleton-light)] subtle-pulse dark:bg-[var(--skeleton-dark)]',
                viewStyle === 'grid'
                  ? 'w-1/2 md:w-2/3 2xl:w-1/3'
                  : 'w-1/2 md:w-1/4',
              ]"></div>
          </div>
          <!-- Description -->
          <div>
            <div
              :class="[
                'w-full mb-2 rounded bg-[var(--skeleton-light)] text-tiny subtle-pulse dark:bg-[var(--skeleton-dark)]',
                viewStyle === 'grid'
                  ? 'h-22 sm:h-26 md:h-30 lg:h-34 '
                  : 'h-34 sm:h-22 md:h-20 lg:h-18 2xl:h-15',
              ]"></div>
            <!-- Button -->
            <div
              :class="[
                ' h-6 mb-1 rounded bg-[var(--skeleton-light)] subtle-pulse dark:bg-[var(--skeleton-dark)]',
                viewStyle === 'grid'
                  ? 'w-1/5 sm:w-2/5 lg:w:1/4'
                  : 'w-1/3 md:w-1/7',
              ]"></div>
          </div>
        </div>
      </div>
    </template>

    <!-- job listing cards list or grid view -->
    <transition name="fade" mode="out-in">
      <template v-if="isJobsSkeletonReady">
        <template v-if="viewStyle === 'grid'">
          <div
            class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 margin950and640">
            <JobCard
              v-for="job in visibleJobs"
              :job="job"
              :char-limit="200"
              :showLinkButton="true"
              :viewingMode="'browsing'"
              statusIconCustomClass="text-xl ml-1 mt-1" />
          </div>
        </template>
        <template v-else>
          <div class="flex flex-col gap-4 margin950and640">
            <JobCard
              v-for="job in visibleJobs"
              :job="job"
              :char-limit="330"
              :viewingMode="'browsing'"
              statusIconCustomClass="text-xl ml-1 mt-1" />
          </div>
        </template>
      </template>
    </transition>

    <Divider label="@click toggleLimit" labelPosition="bottom" />
    <!-- increase how many listing shown -->

    <RouterButton
      v-if="isJobsSkeletonReady"
      :label="limit === DEFAULT_LIMIT ? 'Browse all' : 'See less'"
      :icon="
        limit === DEFAULT_LIMIT
          ? 'heroicons-solid:arrow-down'
          : 'heroicons-solid:arrow-up'
      "
      :onClick="toggleLimit"
      customClass="pl-2 py-4" />
  </Container>
</template>
