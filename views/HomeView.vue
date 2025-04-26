<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ msg: string }>()

const count = ref(0)
</script>

<template>
  <h1 class="text-3xl font-bold">{{ msg }}</h1>
  <div class="mt-4 bg-gray-100 p-4">
    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="count++">
      count is: {{ count }}
    </button>
  </div>
</template>
