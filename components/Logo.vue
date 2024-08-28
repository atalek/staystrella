<script setup lang="ts">
defineProps({
  big: { type: Boolean, required: false, default: false },
})
</script>
<template>
  <NuxtImg
    provider="cloudinary"
    src="blbylsveezcwkzojlulk.png"
    loading="eager"
    fetchpriority="high"
    format="webp"
    class="block"
    :height="big ? '120' : '60'"
    :width="big ? '120' : '60'"
    alt="logo"
    aria-label="logo" />
</template>
