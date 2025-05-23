<script setup lang="ts">
defineProps({
    label: String,
    labelPosition: {
        type: String,
        default: 'top', // or 'bottom'
        validator: (val: string) => ['top', 'bottom'].includes(val)
    }
})
</script>

<template>
    <!-- divider line and label -->
    <div class="hidden sm:block w-full">
        <template v-if="labelPosition === 'top'">
            <p v-if="label" class="text-tiny text-center tracking-wider">{{ label }}</p>
            <div class="tiny-border h-px w-full" />
        </template>
        <template v-else>
            <div class="tiny-border h-px w-full" />
            <p v-if="label" class="text-tiny text-center tracking-wider">{{ label }}</p>
        </template>
    </div>
</template>
