<script setup lang="ts">
import { ref } from "vue";
import RouterButton from "./RouterButton.vue";

// NavPopup: Modal popup overlay for navigation or info.
const isOpen = ref(false);

const openPopup = () => {
  console.log("🍭 Navbar popup triggered");
  isOpen.value = true;
};

const closePopup = () => {
  console.log("🍭 Navbar popup closed");
  isOpen.value = false;
};

defineExpose({
  openPopup,
  closePopup,
});
</script>

<template>
  <!--
    NavPopup: Modal popup overlay for navigation or info.-->
  <div
    v-if="isOpen"
    @click="closePopup"
    class="fixed inset-0 bg-[var(--popup-opactiy-bg-light)] dark:bg-[var(--popup-opactiy-bg-dark)] bg-opacity-60 flex items-center justify-center z-[1000] p-2">
    <div
      @click.stop
      class="flex flex-col items-center justify-center max-w-md p-2 rounded border border-color bg-[var(--bg-light)] dark:bg-[var(--bg-dark)]">
      <h2 class="mb-1 text-2xl">Hi there!</h2>

      <div class="p-2 text-sm text-justify">
        <!-- Example popup content paragraphs -->
        <p class="mb-1">
          I really enjoyed building this project with Vue 3, especially using
          the Composition API to keep the code clean and reusable. It`s styled
          with Tailwind CSS v4 and written in TypeScript to make the whole
          application more robust.
        </p>
        <p>
          On the features side, it has full CRUD (Create, Read, Update, Delete)
          operations connected to a Firebase backend, a secure admin login, and
          a dynamic chart that visualise data in real-time. If you would like to
          read more about this project, you can check out the About section by
          the button below. Or you'd like to explore more of my work, please
          feel free to
          <a
            aria-label="Visit my portfolio"
            class="link-underline"
            target="_blank"
            href="https://andrasegyed.netlify.app/"
            >click here</a
          >.
        </p>
      </div>
      <div class="flex justify-center gap-4 mt-1">
        <!-- Close button -->
        <RouterButton
          @click="closePopup"
          label="Close"
          icon="heroicons-solid:x"
          iconPosition="left" />
        <!-- About button (navigates to /about) -->
        <RouterButton
          @click="closePopup"
          :to="`/about`"
          label="About"
          icon="heroicons:bookmark"
          iconPosition="right" />
      </div>
    </div>
  </div>
</template>
