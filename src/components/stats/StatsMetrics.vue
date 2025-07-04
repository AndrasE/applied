<script setup lang="ts">
// --- PROPS DEFINITION ---
// This component receives the metric counts from its parent (StatsView).
// Using defineProps makes the data flow explicit and easy to follow.
defineProps<{
  active: number; // Number of active applications
  offer: number; // Number of job offers received
  rejected: number; // Number of rejected applications
  noResponse: number; // Number of applications with no response
  total: number; // Total number of applications
}>();
</script>

<template>
  <!-- Metrics container -->
  <div>
    <div class="border rounded border-color">
      <div class="flex flex-row justify-between px-2 py-4 sm:px-6">
        <!-- Active applications metric -->
        <div class="flex flex-col items-center">
          <p
            class="text-md font-semibold text-[var(--green-accent-light)] dark:text-[var(--green-accent-dark)]">
            {{ active }}
          </p>
          <p class="text-xs">active</p>
        </div>
        <!-- Job offer metric -->
        <div class="flex flex-col items-center">
          <p
            class="text-md font-semibold text-[var(--green-accent-light)] dark:text-[var(--green-accent-dark)]">
            {{ offer }}
          </p>
          <p class="text-xs">job offer</p>
        </div>
        <!-- Rejected applications metric -->
        <div class="flex flex-col items-center">
          <p
            class="text-md font-semibold text-[var(--green-accent-light)] dark:text-[var(--green-accent-dark)]">
            {{ rejected }}
          </p>
          <p class="text-xs">rejected</p>
        </div>
        <!-- No response metric -->
        <div class="flex flex-col items-center">
          <p
            class="text-md font-semibold text-[var(--green-accent-light)] dark:text-[var(--green-accent-dark)]">
            {{ noResponse }}
          </p>
          <p class="text-xs">no response</p>
        </div>
        <!-- Total applications metric -->
        <div class="flex flex-col items-center">
          <p
            class="text-md font-semibold text-[var(--green-accent-light)] dark:text-[var(--green-accent-dark)]">
            {{ total }}
          </p>
          <p class="text-xs">total</p>
        </div>
      </div>
    </div>
    <!-- Metrics label -->
    <p
      class="mb-8 text-center text-[0.6rem] leading-[0.5rem] font-mono dark:text-green-300 text-green-700 tracking-wider">
      metrics
    </p>
  </div>
</template>
