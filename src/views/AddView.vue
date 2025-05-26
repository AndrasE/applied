<script setup lang="ts">
import ActionButton from "@/components/ActionButton.vue";
import Container from "@/components/Container.vue";
import RouterButton from "@/components/RouterButton.vue";

const toggleLimit = () => {
  // Logic to toggle limit can be added here
  console.log("Toggle Limit button clicked");
};
</script>

<template>
  <Container>
    <main
      class="w-full text-green-700 border-solid bg-black-900 border-y-1 border-color">
      <h1 class="text-3xl font-bold">Add</h1>
      <RouterButton
        to="/jobs"
        label="To Job"
        icon="heroicons-solid:arrow-right"
        iconPosition="right"
        customClass="my-10" />

      <ActionButton
        label="Toggle Limit"
        icon="heroicons-solid:arrow-down"
        @click="toggleLimit"
        customClass="my-10" />

      <ActionButton
        outlineBtn
        label="Update"
        @="toggleLimit"
        icon="material-symbols:update"
        customClass="my-10" />
      <ActionButton
        outlineBtn
        deleteBtn
        label="Delete"
        @="toggleLimit"
        icon="material-symbols:update" />
    </main>
  </Container>
</template>
