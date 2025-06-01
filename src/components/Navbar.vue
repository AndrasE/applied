<script setup lang="ts">
import { RouterLink, useRoute } from "vue-router";
import { Icon, addCollection } from "@iconify/vue";
import clarityIcons from "@iconify-json/clarity/icons.json";

import ThemeToggle from "./ThemeToggle.vue";

// Register icon collection
addCollection(clarityIcons);

const route = useRoute();
</script>

<template>
  <!-- Header landmark with aria-label for screen reader context -->
  <header
    aria-label="Main site header"
    class="fixed top-0 left-0 z-50 w-full sm:hidden">
    <div
      class="flex items-center justify-between gap-2 h-auto w-full p-2 border-color border-b-1 bg-[var(--bg-light)] dark:bg-[var(--bg-dark)]">
      <!-- Left section: Logo label + icon -->
      <div class="flex items-center gap-2">
        <p class="text-center text-tiny text-orientation">logo</p>
        <div
          role="presentation"
          aria-hidden="true"
          class="w-px h-12 tiny-border"></div>

        <!-- Logo icon -->
        <RouterLink aria-label="Go to homepage" to="/" class="text-hover">
          <Icon
            icon="material-symbols-light:font-download-outline-rounded"
            class="text-5xl"
            role="img"
            aria-hidden="true" />
        </RouterLink>
      </div>

      <!-- Right section: Theme toggle -->
      <div class="flex items-center">
        <ThemeToggle class="pl-1 py-2" />
        <div class="flex flex-row items-center pl-2">
          <div
            role="presentation"
            aria-hidden="true"
            class="w-px h-12 tiny-border"></div>
          <p class="text-center text-tiny text-orientation">theme</p>
        </div>
      </div>
    </div>
  </header>

  <!-- Navigation landmark with aria-label -->
  <nav
    aria-label="Primary navigation"
    class="fixed bottom-0 w-full z-50 h-auto border-color border-t-1 sm:border-t-0 sm:top-0 sm:left-0 sm:h-full sm:w-auto sm:border-r-1 p-2 bg-[var(--bg-light)] dark:bg-[var(--bg-dark)]">
    <div
      class="flex flex-row gap-2 flex-center sm:flex-col sm:justify-between sm:items-center sm:h-full sm:w-auto">
      <div class="hidden sm:flex sm:flex-col sm:items-center">
        <RouterLink
          to="/"
          class="hidden sm:w-full sm:flex sm:flex-col"
          aria-label="Go to homepage">
          <Icon
            icon="material-symbols-light:font-download-outline-rounded"
            class="text-6xl text-hover" />
        </RouterLink>

        <div aria-hidden="true" class="block w-full mb-2">
          <div role="presentation" class="h-px tiny-border"></div>
          <p class="text-center text-tiny">logo</p>
        </div>
      </div>

      <div class="flex flex-row flex-grow flex-center sm:w-full sm:flex-col">
        <div
          aria-hidden="true"
          role="presentation"
          class="flex flex-row items-center sm:block sm:w-full">
          <p class="text-center text-tiny text-orientation">nav</p>
          <div class="w-px h-12 tiny-border sm:w-full sm:h-px"></div>
        </div>

        <RouterLink
          aria-label="Go to homepage"
          to="/"
          class="nav-link text-hover">
          <Icon
            role="presentation"
            icon="ci:house-01"
            class="text-2xl sm:text-3xl" />Home
        </RouterLink>

        <RouterLink
          aria-label="Go to jobs page"
          to="/jobs"
          class="nav-link text-hover">
          <Icon
            role="presentation"
            icon="ci:handbag"
            class="text-2xl sm:text-3xl" />Jobs
        </RouterLink>

        <RouterLink
          aria-label="Go to add job page"
          to="/add"
          class="nav-link text-hover">
          <Icon
            role="presentation"
            icon="ci:file-add"
            class="text-2xl sm:text-3xl" />Add
        </RouterLink>

        <RouterLink
          aria-label="Go to about page"
          to="/about"
          class="nav-link text-hover">
          <Icon
            role="presentation"
            icon="ci:text-align-left"
            class="text-2xl sm:text-3xl" />About
        </RouterLink>

        <div
          aria-hidden="true"
          role="presentation"
          class="flex flex-row items-center sm:block sm:w-full">
          <div class="w-px h-12 tiny-border sm:w-full sm:h-px"></div>
          <p class="text-center text-tiny text-orientation">link</p>
        </div>
      </div>

      <div class="hidden sm:w-full sm:flex sm:flex-col sm:items-center">
        <div class="block w-full mb-2">
          <p class="text-center text-tiny">theme</p>
          <div
            aria-hidden="true"
            role="presentation"
            class="h-px tiny-border"></div>
        </div>
        <ThemeToggle />
      </div>
    </div>
  </nav>
</template>
