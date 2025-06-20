<script setup lang="ts">
import { ref } from "vue";
import RouterButton from "./RouterButton.vue";

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
  <div
    v-if="isOpen"
    @click="closePopup"
    class="fixed inset-0 bg-[var(--popup-opactiy-bg-light)] dark:bg-[var(--popup-opactiy-bg-dark)] bg-opacity-60 flex items-center justify-center z-[1000] p-2">
    <div
      @click.stop
      class="flex flex-col items-center justify-center max-w-sm p-2 rounded border border-color bg-[var(--bg-light)] dark:bg-[var(--bg-dark)]">
      <h2 class="text-2xl mb-4">Hi there!</h2>
      <div class="text-justify p-2 text-sm">
        <p class="mb-1">
          This is the content of mysdfwf42 23This i23s the content of my This is
          the content of my This is the conte232nt of my popup!
        </p>
        <p class="mb-1">This is the co23ntent of my popup!</p>
        <p class="mb-1">This is the T323his is the content of my my popup!</p>
        <p>
          This is the cThis is the23 content of my This is the content of my
          This3232 is the content of my ontent of my popup!
        </p>
      </div>
      <RouterButton
        @click="closePopup"
        label="Close"
        icon="heroicons-solid:x"
        iconPosition="right"
        customClass="mt-4 xl:pt-0 ml-3" />
    </div>
  </div>
</template>
