<script setup lang="ts">
import { useRoute } from 'vue-router'
import Container from '@/components/Container.vue'
import { Icon } from '@iconify/vue'
import jobs from '@/data/jobs.json'
import Divider from '@/components/Divider.vue'
import PageHeader from '@/components/PageHeader.vue'

const route = useRoute()
const jobId = Number(route.params.id)        // "1", "2", …

const job = jobs.find(j => j.id === jobId)   // look‑up the one listing
</script>

<template>
    <Container v-if="job">
        <div class="flex flex-col sm:items-center h-full">

            <PageHeader label="Job details" />

            <Divider label="flex flex-col" labelPosition="top" />

            <div class="flex flex-col items-center justify-start sm:justify-center h-full">

                <!-- job details -->
                <div class="m-3 p-4 rounded border border-color xs:w-full md:w-3/4 xl:w-1/2 ">
                    <h2 class="text-lg  mb-1">{{ job.title }}</h2>
                    <p class="text-sm mb-2">{{ job.company }}</p>
                    <p class="text-sm mb-3 text-justify word-break: break-all">{{ job.description }}</p>
                </div>
                <Divider label="prev list" labelPosition="bottom" />
                <RouterLink :to="`/jobs`"
                    class="group inline-flex items-center gap-1 mb-8 sm:mb-4 text-sm dark:text-green-300 text-green-500 hover:underline">

                    <Icon icon="heroicons-outline:arrow-left"
                        class="inline-block transform transition-opacity duration-200 opacity-0 group-hover:opacity-100" />
                    Back to all
                </RouterLink>
            </div>

        </div>

    </Container>

    <p v-else class="p-6">Job not found.</p>

</template>