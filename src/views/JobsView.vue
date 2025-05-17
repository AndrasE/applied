<script setup lang="ts">
import { ref } from 'vue'
import Container from '@/components/Container.vue'
import JobCard from '@/components/JobCard.vue'
import jobsRaw from '@/data/jobs.json'

// Define type
interface Job {
    id: number
    title: string
    description: string
    company: string
    link: string
}

// Make the data reactive and typed
const jobs = ref<Job[]>(jobsRaw)
</script>

<template>
    <Container>
        <h1 class="text-3xl text-center mb-6">Available Jobs</h1>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4">
            <JobCard v-for="job in jobs" :key="job.id" :job="job" />
        </div>
    </Container>
</template>