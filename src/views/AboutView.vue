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
      <div
        aria-label="about card"
        class="w-full p-4 text-justify break-words border rounded border-color">
        <!-- About text content -->
        <p class="p-2 text-sm">
          blabla blabla blabla blablabla blablablablablablablablablab
          lablablablablabl ablabla blabla blabla blabla blabla blablabla
          blablablablablablablablablab lablablablablabl ablabla blabla blabla
          blabla blabla blablabla blablablablablablablablablab lablablablablabl
          ablabla blabla blabla blabla blabla blablabla
          blablablablablablablablablab lablablablablabl ablabla blabla blabla
          blabla blabla blablabla blablablablablablablablablab lablablablablabl
          ablabla blabla blabla blabla blabla blablabla
          blablablablablablablablablab lablablablablabl ablabla blabla
        </p>
      </div>
    </div>

    <Divider label="thanks for reading" labelPosition="bottom" />
  </Container>
</template>
