<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import Container from "@/components/ui/Container.vue";
import PageHeader from "@/components/ui/PageHeader.vue";
import Divider from "@/components/ui/Divider.vue";
import JobCard from "@/components/job-cards/JobCard.vue";
import RouterButton from "@/components/ui/RouterButton.vue";
import { Icon } from "@iconify/vue";
import { useAppStore } from "@/stores/jobs";
const appStore = useAppStore();

const viewStyle = ref<string>(localStorage.getItem("jobsViewStyle") || "list");
const DEFAULT_LIMIT = 8;
const limit = ref<number>(DEFAULT_LIMIT);

// Skeleton logic: show skeleton if isCurrentlyFetching is true
const isJobsSkeletonReady = computed(() => !appStore.isCurrentlyFetching);

// Data comes directly from the store's reactive state
const visibleJobs = computed(() => {
  return appStore.sortedJobs.slice(0, limit.value);
});

// --- Lifecycle Hook ---
onMounted(() => {
  // This will attach the listener only once per app session when JobsView is first mounted.
  // If the listener is already active, it will do nothing.
  appStore.ensureJobsListenerActive();
});

const toggleLimit = () => {
  limit.value =
    limit.value === DEFAULT_LIMIT ? appStore.jobs.length : DEFAULT_LIMIT;
};

const changeView = (style: string) => {
  viewStyle.value = style;
  localStorage.setItem("jobsViewStyle", style);
};
</script>

<template>
  <Container>
    <PageHeader label="Recent applications" />

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

    <div v-if="appStore.error" class="text-red-500 text-center my-4">
      Error loading jobs: {{ appStore.error }}
    </div>

    <template v-if="appStore.isCurrentlyFetching">
      <div
        :class="[
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
                :class="[
                  'h-7 rounded bg-[var(--skeleton-light)] subtle-pulse dark:bg-[var(--skeleton-dark)]',
                  viewStyle === 'grid' ? 'w-3/4 xl:w-5/8' : 'w-3/4  md:w-1/3',
                ]"></div>
            </div>
            <div class="flex flex-col items-end">
              <div
                class="w-6 h-6 bg-[var(--skeleton-light)] subtle-pulse dark:bg-[var(--skeleton-dark)] rounded-full ml-1"></div>
            </div>
          </div>
          <div class="mb-2">
            <div
              :class="[
                'h-6 mb-1 rounded bg-[var(--skeleton-light)] subtle-pulse dark:bg-[var(--skeleton-dark)]',
                viewStyle === 'grid'
                  ? 'w-1/2 md:w-2/3 2xl:w-1/3'
                  : 'w-1/2 md:w-1/4',
              ]"></div>
          </div>
          <div>
            <div
              :class="[
                'w-full mb-2 rounded bg-[var(--skeleton-light)] text-tiny subtle-pulse dark:bg-[var(--skeleton-dark)]',
                viewStyle === 'grid'
                  ? 'h-22 sm:h-26 md:h-30 lg:h-34 '
                  : 'h-34 sm:h-22 md:h-20 lg:h-18 2xl:h-15',
              ]"></div>
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

    <transition name="fade" mode="out-in">
      <template v-if="isJobsSkeletonReady">
        <template v-if="viewStyle === 'grid'">
          <div
            class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 margin950and640">
            <JobCard
              v-for="job in visibleJobs"
              :key="job.id"
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
              :key="job.id"
              :job="job"
              :char-limit="330"
              :viewingMode="'browsing'"
              statusIconCustomClass="text-xl ml-1 mt-1" />
          </div>
        </template>
      </template>
    </transition>

    <Divider label="@click toggleLimit" labelPosition="bottom" />
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
