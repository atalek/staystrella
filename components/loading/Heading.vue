<script setup lang="ts">
defineProps({
  subTitle: { type: Boolean, required: false, default: false },
})
</script>
<template>
  <div class="flex flex-col my-8 gap-y-4">
    <div class="h-6 w-44 bg-slate-300 rounded-xl"></div>
    <div
      class="h-6 w-72 bg-slate-200 rounded-xl"
      v-if="subTitle"></div>
  </div>
</template>
