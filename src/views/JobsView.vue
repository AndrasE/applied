<script setup lang="ts">
import { ref, computed } from "vue";
import Container from "@/components/Container.vue";
import PageHeader from "@/components/PageHeader.vue";
import Divider from "@/components/Divider.vue";
import JobCard from "@/components/JobCard.vue";
import { Icon } from "@iconify/vue";
import jobsRaw from "@/data/jobs.json";

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
    <div class="relative flex flex-col items-center justify-start h-full">
      <PageHeader label="Recent applications" />

      <!-- toggle between list and grid  -->
      <div class="absolute flex-row hidden gap-4 top-12 right-5 sm:flex">
        <Icon
          @click="changeView('list')"
          icon="heroicons-solid:view-list"
          :class="[
            'text-xl text-hover',
            { 'dark:text-green-300 text-green-500': viewStyle === 'list' },
          ]" />
        <Icon
          @click="changeView('grid')"
          icon="flowbite:grid-outline"
          :class="[
            'text-xl text-hover',
            { 'dark:text-green-300 text-green-500': viewStyle === 'grid' },
          ]" />
      </div>

      <Divider
        :label="viewStyle === 'grid' ? 'grid cols' : 'flex col'"
        labelPosition="top" />

      <!-- job listing cards list or grid view -->
      <transition name="fade" mode="out-in">
        <template v-if="viewStyle === 'grid'">
          <div
            class="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 min949:p-6">
            <JobCard
              v-for="job in visibleJobs"
              :key="job.id"
              :job="job"
              :char-limit="200" />
          </div>
        </template>
        <template v-else>
          <div class="flex flex-col gap-4 custom-padding">
            <JobCard
              v-for="job in visibleJobs"
              :key="job.id"
              :job="job"
              :char-limit="330" />
          </div>
        </template>
      </transition>

      <Divider label="@click toggleLimit" labelPosition="bottom" />

      <!-- increase how many listing shown -->
      <button
        @click="toggleLimit"
        class="inline-flex items-center gap-1 mt-3 mb-6 text-sm text-green-500 group sm:my-3 dark:text-green-300 hover:underline">
        {{ limit === DEFAULT_LIMIT ? "Browse all" : "See less" }}
        <Icon
          :icon="
            limit === DEFAULT_LIMIT
              ? 'heroicons-outline:arrow-down'
              : 'heroicons-outline:arrow-up'
          "
          class="transition-opacity duration-200 transform opacity-0 group-hover:opacity-100" />
      </button>
    </div>
  </Container>
</template>
