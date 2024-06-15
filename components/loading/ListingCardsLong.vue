<script setup lang="ts">
defineProps({
  heading: { type: Boolean, required: false, default: false },
  cards: { type: Number, required: false, default: 4 },
})
</script>
<template>
  <section>
    <LoadingHeading v-if="heading" />
    <div class="grid grid-cols-1 gap-8 mt-10 2xl:grid-cols-2">
      <LoadingListingCardLongSkeleton
        v-for="(card, index) in cards"
        :key="index" />
    </div>
  </section>
</template>
