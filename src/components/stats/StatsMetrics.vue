<script setup lang="ts">
// --- PROPS DEFINITION ---
// This component receives the metric counts from its parent (StatsView).
// Using defineProps makes the data flow explicit and easy to follow.
defineProps<{
  active: number;
  offer: number;
  rejected: number;
  noResponse: number;
  total: number;
}>();
</script>

<template>
  <div>
    <div class="border rounded border-color">
      <div class="flex flex-row justify-between px-2 py-4 sm:px-6">
        <div class="flex flex-col items-center">
          <p
            class="text-md font-semibold text-[var(--green-accent-light)] dark:text-[var(--green-accent-dark)]">
            {{ active }}
          </p>
          <p class="text-xs">active</p>
        </div>
        <div class="flex flex-col items-center">
          <p
            class="text-md font-semibold text-[var(--green-accent-light)] dark:text-[var(--green-accent-dark)]">
            {{ offer }}
          </p>
          <p class="text-xs">job offer</p>
        </div>
        <div class="flex flex-col items-center">
          <p
            class="text-md font-semibold text-[var(--green-accent-light)] dark:text-[var(--green-accent-dark)]">
            {{ rejected }}
          </p>
          <p class="text-xs">rejected</p>
        </div>
        <div class="flex flex-col items-center">
          <p
            class="text-md font-semibold text-[var(--green-accent-light)] dark:text-[var(--green-accent-dark)]">
            {{ noResponse }}
          </p>
          <p class="text-xs">no response</p>
        </div>
        <div class="flex flex-col items-center">
          <p
            class="text-md font-semibold text-[var(--green-accent-light)] dark:text-[var(--green-accent-dark)]">
            {{ total }}
          </p>
          <p class="text-xs">total</p>
        </div>
      </div>
    </div>
    <p class="mb-8 text-center text-tiny">metrics</p>
  </div>
</template>
