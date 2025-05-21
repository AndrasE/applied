<script setup lang="ts">
import { ref, computed } from 'vue'
import Container from '@/components/Container.vue'
import JobCard from '@/components/JobCard.vue'
import { Icon } from '@iconify/vue'
import jobsRaw from '@/data/jobs.json'

interface Job {
    id: number
    title: string
    description: string
    company: string
    link: string
}

const jobs = ref<Job[]>(jobsRaw)
const viewStyle = ref<string>('list') // 'list' or 'grid'


const DEFAULT_LIMIT = 8
const limit = ref<number>(DEFAULT_LIMIT)

const visibleJobs = computed(() => jobs.value.slice(0, limit.value))

const toggleLimit = () => {
    limit.value = limit.value === DEFAULT_LIMIT ? jobs.value.length : DEFAULT_LIMIT
}

const changeView = (style: string) => {
    viewStyle.value = style

}
</script>

<template>
    <Container>
        <div class="relative flex flex-col items-center justify-start h-full">
            <h1 class="text-2xl text-center mb-6">Recent applications</h1>

            <!-- toggle between list and grid  -->
            <div class="absolute top-8 right-5 flex-row gap-4 hidden sm:flex">
                <Icon @click="changeView('list')" icon="heroicons-solid:view-list"
                    :class="['text-xl text-hover', { 'dark:text-green-300 text-green-500': viewStyle === 'list' }]" />
                <Icon @click="changeView('grid')" icon="flowbite:grid-outline"
                    :class="['text-xl text-hover', { 'dark:text-green-300 text-green-500': viewStyle === 'grid' }]" />
            </div>

            <!-- divider -->
            <div class="w-full">
                <p class="text-tiny text-center tracking-wider"> {{ viewStyle === 'grid' ? 'grid cols' : 'flex col'
                    }}</p>
                <div class="tiny-border h-px w-full" />
            </div>

            <!-- job listing cards list or grid view -->
            <transition name="fade" mode="out-in">
                <template v-if="viewStyle === 'grid'">
                    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4">
                        <JobCard v-for="job in visibleJobs" :key="job.id" :job="job" :char-limit="200" />
                    </div>
                </template>
                <template v-else>
                    <div class="flex flex-col gap-4 p-4">
                        <JobCard v-for="job in visibleJobs" :key="job.id" :job="job" :char-limit="330" />
                    </div>
                </template>
            </transition>

            <!-- divider -->
            <div class=" w-full">
                <div class="tiny-border h-px w-full" />
                <p class="text-tiny text-center tracking-wider">@click toggleLimit</p>
            </div>

            <!-- increase how many listing shown -->
            <button @click="toggleLimit"
                class="my-3 group inline-flex items-center gap-1 text-sm dark:text-green-300 text-green-500 hover:underline">
                {{ limit === DEFAULT_LIMIT ? 'Browse all' : 'See less' }}
                <Icon :icon="limit === DEFAULT_LIMIT ? 'heroicons-outline:arrow-down' : 'heroicons-outline:arrow-up'"
                    class="transform transition-opacity duration-200 opacity-0 group-hover:opacity-100" />
            </button>
        </div>
    </Container>
</template>
