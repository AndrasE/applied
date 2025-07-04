<script setup lang="ts">
// --- UI and utility imports ---
import Container from "@/components/ui/Container.vue";
import { onMounted } from "vue";
import { Icon } from "@iconify/vue";
import PageHeader from "@/components/ui/PageHeader.vue";
import Divider from "@/components/ui/Divider.vue";

// --- Scroll to top on mount for better UX ---
onMounted(() => {
  window.scrollTo(0, 0); // Scroll to the top overwriting any previous scroll
});
</script>

<template>
  <Container>
    <PageHeader label="About" />
    <Divider label="hi there" labelPosition="top" />
    <div class="flex flex-col items-center justify-between margin950and640">
      <h2 class="mb-1 text-2xl">Hi there!</h2>
      <div
        aria-label="about card"
        class="w-full p-4 text-justify break-words border rounded border-color">
        <!-- About text content -->
        <p class="mb-1 text-sm">
          After applying to over 100 jobs, I realized that keeping track of
          applications was a hassle. I wanted a simple way to manage my job
          search and monitor everything in one place. So, I built this app to
          track and visualise my progress. The timing felt perfect—I had just
          completed a TypeScript course on Udemy and a crash course on Vue 3 via
          YouTube. For the styling, I also wanted to try out Tailwind CSS, which
          I`d been hearing a lot about. And with that, the idea was born.
        </p>
        <p class="text-sm"></p>
      </div>
    </div>

    <Divider label="thanks for reading" labelPosition="bottom" />
  </Container>
</template>
