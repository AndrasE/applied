<script setup lang="ts">
import { ref } from "vue";

defineProps<{ msg: string }>();

const count = ref(0);
</script>

<template>
  <div
    class="grid min-h-screen grid-cols-1 md:grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_auto_minmax(0,theme(maxWidth.6xl))_auto_1fr]">
    <div class="hidden lg:block"></div>
    <div
      class="border-r border-solid border-color hidden md:block w-14 bg-[image:repeating-linear-gradient(315deg,var(--pattern-color-light)_0,var(--pattern-color-light)_1px,transparent_0,transparent_50%)] dark:bg-[image:repeating-linear-gradient(315deg,var(--pattern-color-dark)_0,var(--pattern-color-dark)_1px,transparent_0,transparent_50%)] bg-[size:10px_10px] bg-fixed">
    </div>
    <main class="bg-black-900 w-full text-green-700 border-y-1 border-solid border-color">
      <h1 class="text-3xl font-bold">Hello world!</h1>
      <p>This is the main content area.</p>
      <p>It will be in the middle column on larger screens.</p>
    </main>
    <div
      class="border-l border-solid border-color hidden  md:block w-14 bg-[image:repeating-linear-gradient(315deg,var(--pattern-color-light)_0,var(--pattern-color-light)_1px,transparent_0,transparent_50%)] dark:bg-[image:repeating-linear-gradient(315deg,var(--pattern-color-dark)_0,var(--pattern-color-dark)_1px,transparent_0,transparent_50%)] bg-[size:10px_10px] bg-fixed">
    </div>
    <div class="hidden lg:block"></div>
  </div>

  <!-- <div
    class=" grid min-h-dvh grid-cols-1 grid-rows-[1fr_1px_auto_1px_auto] justify-center pt-14.25
      [--gutter-width:2.5rem] md:-mx-4
      md:grid-cols-[var(--gutter-width)_minmax(0,var(--breakpoint-2xl))_var(--gutter-width)] lg:mx-0">
      <div
        class="col-start-1 row-span-full row-start-1 hidden bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed [--pattern-fg:var(--color-black)]/5 md:block dark:[--pattern-fg:var(--color-white)]/10 border-3 border-solid border-amber-300/50">
        1</div>
      <div>
        <h1 class=" text-3xl font-bold underline bg-amber-900">Hello world!</h1>
      </div>
    </div> -->
</template>
