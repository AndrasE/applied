<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { ref as dbRef, onValue } from "firebase/database";
import { database } from "../config/database";
import Container from "@/components/ui/Container.vue";
import PageHeader from "@/components/ui/PageHeader.vue";
import Divider from "@/components/ui/Divider.vue";
import JobCard from "@/components/job-cards/JobCard.vue";
import JobCardBrowse from "@/components/job-cards/JobCardBrowse.vue";
import RouterButton from "@/components/ui/RouterButton.vue";
import { Icon } from "@iconify/vue";
import type { Job, JobStatus } from "@/types/job";

// Firebase refs
const jobs = ref<Job[]>([]);
const viewStyle = ref<string>(localStorage.getItem("jobsViewStyle") || "list");
const DEFAULT_LIMIT = 8;
const limit = ref<number>(DEFAULT_LIMIT);

// Setup Firebase listener
let unsubscribe: (() => void) | null = null;

// Only show skeleton once per session
let jobsSkeletonLoadedOnce: boolean = false;

const isJobsSkeletonReady = ref(jobsSkeletonLoadedOnce);
const skeletonMinDuration = 55400; // ms

onMounted(() => {
  let snapshotReceived = false;
  let minTimerDone = false;

  // Start min duration timer
  setTimeout(() => {
    minTimerDone = true;
    if (snapshotReceived && !jobsSkeletonLoadedOnce) {
      isJobsSkeletonReady.value = true;
      jobsSkeletonLoadedOnce = true;
    }
  }, skeletonMinDuration);

  const jobsRef = dbRef(database, "jobs");
  const unsubscribeFn = onValue(jobsRef, (snapshot) => {
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
    snapshotReceived = true;
    if (minTimerDone && !jobsSkeletonLoadedOnce) {
      isJobsSkeletonReady.value = true;
      jobsSkeletonLoadedOnce = true;
    }
    if (jobsSkeletonLoadedOnce) {
      isJobsSkeletonReady.value = true;
    }
    console.log("📥 Fetched jobs from Firebase:", jobsData);
  });
  unsubscribe = unsubscribeFn;

  // Optionally, sync viewStyle with localStorage if it changes elsewhere
  const stored = localStorage.getItem("jobsViewStyle");
  if (stored && stored !== viewStyle.value) {
    viewStyle.value = stored;
  }
});

// Clean up listener on component unmount
onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe();
  }
});

const visibleJobs = computed(() => {
  // Reverse the array to show newest entries first
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
          'my-0',
          'sm:my-[1rem]',
          'md-lg:my-[1.5rem]',
        ]">
        <div
          v-for="n in DEFAULT_LIMIT"
          :key="'skeleton-' + n"
          class="py-5 px-4 border rounded border-[var(--skeleton-light)] dark:border-[var(--skeleton-dark)] bg-[var(--skeleton-bg-light)] dark:bg-[var(--skeleton-bg-dark)]">
          <div class="flex items-start justify-between animate-pulse">
            <div class="w-full mb-2">
              <div
                class="w-3/4 xl:w-1/2 h-8 rounded bg-[var(--skeleton-light)] subtle-pulse dark:bg-[var(--skeleton-dark)]"></div>
            </div>
            <div class="flex flex-col items-end">
              <div
                class="w-8 h-8 bg-[var(--skeleton-light)] subtle-pulse dark:bg-[var(--skeleton-dark)] rounded-full ml-1"></div>
            </div>
          </div>

          <div class="mb-2">
            <div
              class="w-1/2 xl:w-1/3 h-6 mb-1 rounded bg-[var(--skeleton-light)] subtle-pulse dark:bg-[var(--skeleton-dark)]"></div>
          </div>

          <div>
            <div
              :class="[
                'w-full mb-2 rounded bg-[var(--skeleton-light)] text-tiny subtle-pulse dark:bg-[var(--skeleton-dark)] ',
                viewStyle === 'grid' ? 'h-36' : 'h-16',
              ]"></div>
            <div
              class="w-22 md:w-24 xl:w-28 h-6 mb-1 rounded bg-[var(--skeleton-light)] text-tiny subtle-pulse dark:bg-[var(--skeleton-dark)]"></div>
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
