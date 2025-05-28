<script setup lang="ts">
import { ref, computed } from "vue";
import Container from "@/components/Container.vue";
import PageHeader from "@/components/PageHeader.vue";
import Divider from "@/components/Divider.vue";
import JobCard from "@/components/JobCard.vue";
import { Icon } from "@iconify/vue";
import jobsRaw from "@/data/jobs.json";
import RouterButton from "@/components/RouterButton.vue";

interface Job {
  id: number;
  title: string;
  description: string;
  company: string;
  link: string;
}

const jobs = ref<Job[]>(jobsRaw);
const viewStyle = ref<string>("list"); // 'list' or 'grid'

const DEFAULT_LIMIT = 8;
const limit = ref<number>(DEFAULT_LIMIT);

const visibleJobs = computed(() => jobs.value.slice(0, limit.value));

const toggleLimit = () => {
  limit.value =
    limit.value === DEFAULT_LIMIT ? jobs.value.length : DEFAULT_LIMIT;
};

const changeView = (style: string) => {
  viewStyle.value = style;
};
</script>

<template>
  <Container>
    <PageHeader label="Recent applications" />

    <!-- toggle between list and grid  -->
    <div class="absolute flex-row hidden gap-3 top-11 right-4 sm:flex">
      <Icon
        type="button"
        aria-label="Toggle view list"
        @click="changeView('list')"
        icon="heroicons-solid:view-list"
        :class="[
          'text-xl text-hover',
          { 'dark:text-green-300 text-green-700': viewStyle === 'list' },
        ]" />
      <Icon
        type="button"
        aria-label="Toggle view grid"
        @click="changeView('grid')"
        icon="flowbite:grid-outline"
        :class="[
          'text-xl text-hover',
          { 'dark:text-green-300 text-green-700': viewStyle === 'grid' },
        ]" />
    </div>

    <Divider
      :label="viewStyle === 'grid' ? 'grid cols' : 'flex col'"
      labelPosition="top" />

    <!-- job listing cards list or grid view -->
    <transition name="fade" mode="out-in">
      <template v-if="viewStyle === 'grid'">
        <div
          class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 margin950">
          <JobCard
            v-for="job in visibleJobs"
            :key="job.id"
            :job="job"
            :char-limit="200"
            :showLinkButton="true"
            :viewingMode="'browsing'" />
        </div>
      </template>
      <template v-else>
        <div class="flex flex-col gap-4 margin950">
          <JobCard
            v-for="job in visibleJobs"
            :key="job.id"
            :job="job"
            :char-limit="330"
            :viewingMode="'browsing'" />
        </div>
      </template>
    </transition>

    <Divider label="@click toggleLimit" labelPosition="bottom" />
    <!-- increase how many listing shown -->
    <RouterButton
      as="button"
      :label="limit === DEFAULT_LIMIT ? 'Browse all' : 'See less'"
      :icon="
        limit === DEFAULT_LIMIT
          ? 'heroicons-solid:arrow-down'
          : 'heroicons-solid:arrow-up'
      "
      :onClick="toggleLimit"
      customClass="relative left-3 pb-9 sm:py-5" />
  </Container>
</template>
