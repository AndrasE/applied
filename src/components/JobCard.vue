<script setup lang="ts">
import { defineProps } from 'vue'

interface Job {
    id: number
    title: string
    description: string
    company: string
    link: string
}

defineProps<{ job: Job }>()
</script>

<template>
    <div class="p-4 rounded-lg shadow hover:shadow-lg transition bg-white dark:bg-gray-900">
        <h2 class="text-xl font-bold mb-1">{{ job.title }}</h2>
        <p class="text-sm mb-2">{{ job.company }}</p>
        <p class="text-sm mb-3">{{ job.description }}</p>
        <a :href="job.link" target="_blank" class="inline-block text-blue-600 hover:underline text-sm font-medium">
            View Job →
        </a>
    </div>
</template>