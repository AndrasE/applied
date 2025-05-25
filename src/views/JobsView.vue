<script setup lang="ts">
import { ref, computed } from "vue";
import Container from "@/components/Container.vue";
import PageHeader from "@/components/PageHeader.vue";
import Divider from "@/components/Divider.vue";
import JobCard from "@/components/JobCard.vue";
import { Icon } from "@iconify/vue";
import jobsRaw from "@/data/jobs.json";
import ButtonLinkWithIcon from "@/components/ButtonLinkWithIcon.vue";

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
      <div class="absolute flex-row hidden gap-3 top-12 right-4 sm:flex">
        <Icon
          type="button"
          aria-label="Toggle view list"
          @click="changeView('list')"
          icon="heroicons-solid:view-list"
          :class="[
            'text-xl text-hover',
            { 'dark:text-green-300 text-green-600': viewStyle === 'list' },
          ]" />
        <Icon
          type="button"
          aria-label="Toggle view grid"
          @click="changeView('grid')"
          icon="flowbite:grid-outline"
          :class="[
            'text-xl text-hover',
            { 'dark:text-green-300 text-green-600': viewStyle === 'grid' },
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
              :showLinkButton="true" />
          </div>
        </template>
        <template v-else>
          <div class="flex flex-col gap-4 margin950">
            <JobCard
              v-for="job in visibleJobs"
              :key="job.id"
              :job="job"
              :char-limit="330"
              :showLinkButton="true" />
          </div>
        </template>
      </transition>

      <Divider label="@click toggleLimit" labelPosition="bottom" />

      <!-- increase how many listing shown -->
      <ButtonLinkWithIcon
        as="button"
        :label="limit === DEFAULT_LIMIT ? 'Browse all' : 'See less'"
        :icon="
          limit === DEFAULT_LIMIT
            ? 'heroicons-outline:arrow-down'
            : 'heroicons-outline:arrow-up'
        "
        :onClick="toggleLimit"
        customClass="mb-9 relative left-2 sm:my-5" />
    </div>
  </Container>
</template>
