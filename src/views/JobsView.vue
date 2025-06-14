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
const skeletonMinDuration = 20000; // ms

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
        :class="
          viewStyle === 'grid'
            ? 'grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 margin950and640'
            : 'flex flex-col gap-4 margin950and640'
        ">
        <JobCardBrowse
          v-for="n in 4"
          :key="'skeleton-' + viewStyle + '-' + n"
          :job="{
            id: n.toString(),
            title: '',
            company: '',
            description: '',
            status: undefined,
          }"
          :char-limit="viewStyle === 'grid' ? 200 : 330"
          statusIconCustomClass="invisible">
          <template #default>
            <div>
              <div class="flex items-start justify-between">
                <div class="mb-1 w-full">
                  <div
                    class="h-6 w-11/12 rounded bg-[var(--skeleton-bg-light)] subtle-pulse dark:bg-[var(--skeleton-bg-dark)]"></div>
                </div>
                <div class="flex flex-col items-end">
                  <div
                    class="h-6 w-6 ml-1 rounded-full bg-[var(--skeleton-bg-light)] subtle-pulse dark:bg-[var(--skeleton-bg-dark)]"></div>
                </div>
              </div>
              <div
                class="mb-2 h-4 w-2/3 rounded bg-[var(--skeleton-bg-light)] subtle-pulse dark:bg-[var(--skeleton-bg-dark)]"></div>
              <div
                class="mb-2 h-18 w-11/12 rounded bg-[var(--skeleton-bg-light)] subtle-pulse dark:bg-[var(--skeleton-bg-dark)]"></div>
              <div class="flex">
                <div
                  class="h-8 w-32 rounded bg-[var(--skeleton-bg-light)] subtle-pulse dark:bg-[var(--skeleton-bg-dark)] mt-2"></div>
              </div>
            </div>
          </template>
        </JobCardBrowse>
      </div>
    </template>

    <!-- job listing cards list or grid view -->
    <transition name="fade" mode="out-in">
      <template v-if="isJobsSkeletonReady">
        <template v-if="viewStyle === 'grid'">
          <div
            class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 margin950and640">
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
              statusIconCustomClass="text-xl ml-1  mt-1" />
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
