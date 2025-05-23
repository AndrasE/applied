<script setup lang="ts">
defineProps({
    label: {
        type: String,
        required: true
    }
})
</script>

<template>
    <h1 class="text-2xl text-center mb-0 mt-3 sm:mb-5">
        {{ label }}
    </h1>
</template>
