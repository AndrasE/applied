<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ msg: string }>()

const count = ref(0)
</script>

<template>
  <div
    class="grid min-h-screen grid-cols-1 md:grid-cols-[auto_auto_1fr_auto_auto] lg:grid-cols-[1fr_auto_minmax(0,theme(maxWidth.7xl))_auto_1fr]">
    <div class="bg-gray-400 hidden lg:block">buffer</div>
    <div class="bg-yellow-100 hidden md:block w-14">pattern</div>
    <main class="bg-red-100 max-w-7xl w-full mx-auto">
      <p>This is the main content area.</p>
      <p>It will be in the middle column on larger screens.</p>
    </main>
    <div class="bg-yellow-100 hidden md:block w-14">pattern</div>
    <div class="bg-gray-400 hidden lg:block">buffer</div>
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
