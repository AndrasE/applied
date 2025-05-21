<script setup lang="ts">
import { useRoute } from 'vue-router'
import Container from '@/components/Container.vue'
import { Icon } from '@iconify/vue'
import jobs from '@/data/jobs.json'

const route = useRoute()
const jobId = Number(route.params.id)        // "1", "2", …

const job = jobs.find(j => j.id === jobId)   // look‑up the one listing
</script>

<template>
    <Container v-if="job">
        <div class="flex flex-col sm:items-center h-full">
            <h1 class="text-2xl text-center mb-6">Job details</h1>

            <!-- divider -->
            <div class="w-full">
                <p class="text-tiny text-center tracking-wider">flex flex-col</p>
                <div class="tiny-border h-px w-full" />
            </div>
            <div class="flex flex-col items-center justify-start sm:justify-center h-full">

                <!-- job details -->
                <div class="m-4 p-4 rounded border border-color xs:w-full md:w-3/4 xl:w-1/2 ">
                    <h2 class="text-lg  mb-1">{{ job.title }}</h2>
                    <p class="text-sm mb-2">{{ job.company }}</p>
                    <p class="text-sm mb-3 text-justify word-break: break-all">{{ job.description }}</p>
                </div>
                <RouterLink :to="`/jobs`"
                    class="group inline-flex items-center gap-1 my-3 text-sm dark:text-green-300 text-green-500 hover:underline">

                    <Icon icon="heroicons-outline:arrow-left"
                        class="inline-block transform transition-opacity duration-200 opacity-0 group-hover:opacity-100" />
                    Back to all
                </RouterLink>
            </div>
        </div>
    </Container>

    <p v-else class="p-6">Job not found.</p>

</template>