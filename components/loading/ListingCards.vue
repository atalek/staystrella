<script setup lang="ts">
defineProps({
  heading: { type: Boolean, required: false, default: false },
  cards: { type: Number, required: false, default: 6 },
})
</script>
<template>
  <section>
    <div
      class="flex flex-col gap-y-4"
      v-if="heading">
      <LoadingHeading subTitle />
    </div>
    <div
      class="grid grid-cols-1 gap-8 sm:grid-cols2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      <LoadingListingCardSkeleton
        v-for="(_, index) in cards"
        :key="index" />
    </div>
  </section>
</template>
