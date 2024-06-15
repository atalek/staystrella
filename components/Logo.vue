<script setup lang="ts">
defineProps({
  big: { type: Boolean, required: false, default: false },
})
</script>
<template>
  <NuxtImg
    src="/logo.webp"
    class="block"
    :height="big ? '120' : '60'"
    :width="big ? '120' : '60'"
    alt="company logo" />
</template>
