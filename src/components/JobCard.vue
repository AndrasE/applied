<script setup lang="ts">
import { Icon } from '@iconify/vue'
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
    <div class="p-4 rounded shadow border border-color">
        <h2 class="text-lg  mb-1">{{ job.title }}</h2>
        <p class="text-sm mb-2">{{ job.company }}</p>
        <p class="text-sm mb-3 text-justify word-break: break-all">{{ job.description }}</p>
        <a :href="job.link" target="_blank"
            class="group inline-flex items-center gap-1 text-sm dark:text-green-300 text-green-500 hover:underline">
            Read more
            <Icon icon="heroicons-outline:arrow-right"
                class="inline-block transform transition-opacity duration-200 opacity-0 group-hover:opacity-100" />
        </a>
    </div>
</template>