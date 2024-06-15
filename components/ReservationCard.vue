<script setup lang="ts">
import { format } from 'date-fns'
import type { Listing } from '~/types'

const { listing } = defineProps({
  listing: { type: Object as PropType<Listing>, required: true },
})

// const reservationDate = computed(() => {
//   if (!reservation) return null

//   const start = new Date(reservation?.startDate)
//   const end = new Date(reservation?.endDate)

//   return `${format(start, 'PP')} - ${format(end, 'PP')}`
// })

function formatDate(startDate: string, endDate: string) {
  const start = new Date(startDate)
  const end = new Date(endDate)

  return `${format(start, 'PP')} - ${format(end, 'PP')}`
}
</script>
<template>
  <div class="flex flex-col md:flex-row w-full gap-8 border-2 p-4 rounded-xl mt-8">
    <div class="max-w-sm flex-shrink-0 flex flex-col md:mx-0 mx-auto gap-4">
      <Heading
        :title="listing.title"
        center />
      <NuxtImg
        provider="cloudinary"
        :src="listing.imageSrc"
        :alt="`Image of ${listing.title}`"
        format="webp"
        class="object-cover h-full w-full transition rounded-xl" />
    </div>
    <div class="">
      {{ listing?.reservations?.length }} Reservation
      <div v-for="reservation in listing.reservations">
        {{ formatDate(reservation.startDate, reservation.endDate) }}
      </div>
    </div>
  </div>
</template>
