<script lang="ts" setup>
import type { Listing, Reservation } from '~/types'
import { format } from 'date-fns'

type ListingCardProps = {
  listing: Listing
  reservation?: Reservation
  disabled?: boolean
  actionLabel?: string
  actionId?: string
  totalPrice?: number
}

const { listing, reservation } = defineProps<ListingCardProps>()

const { getByValue } = useCountries()
const location = getByValue(listing.locationValue)

const price = computed(() => (reservation ? reservation.totalPrice : listing.price))

const reservationDate = computed(() => {
  if (!reservation) return null

  const start = new Date(reservation?.startDate)
  const end = new Date(reservation?.endDate)

  return `${format(start, 'PP')} - ${format(end, 'PP')}`
})

const emit = defineEmits(['action', 'favorited'])

function action(id: string) {
  emit('action', id)
}

function favorited(id: string) {
  emit('favorited', id)
}
</script>

<template>
  <NuxtLink
    class="col-span-1 group"
    :to="`/listings/${listing.id}`">
    <div class="flex flex-col w-full gap-2">
      <div class="relative w-full overflow-hidden aspect-square rounded-xl">
        <NuxtImg
          fetchpriority="high"
          loading="eager"
          provider="cloudinary"
          sizes="100vw sm:80vw md:350px"
          :src="listing.imageSrc"
          :alt="`Image of ${listing.title}`"
          format="webp"
          class="object-cover w-full h-full transition group-hover:scale-110" />
        <div
          class="absolute top-3 right-3"
          @click="(e: MouseEvent) => e.preventDefault()">
          <HeartButton
            :listingId="listing.id"
            @click="(e: MouseEvent) => e.preventDefault()"
            @favorited="favorited(listing.id)" />
        </div>
      </div>
      <div class="text-lg font-semibold line-clamp-1">
        {{ location?.flag }} {{ location?.label }}, {{ location?.region }}
      </div>
      <div class="font-light text-neutral-500">
        {{ reservationDate || listing.category }}
      </div>
      <div class="flex flex-row items-center gap-1">
        <div class="font-semibold">$ {{ totalPrice || price }}</div>
        <div
          v-if="!totalPrice && !reservation"
          class="font-light">
          per night
        </div>
      </div>
      <div @click="e => e.preventDefault()">
        <Button
          @click="action(actionId!)"
          small
          v-if="actionLabel"
          :disabled
          :label="actionLabel" />
      </div>
    </div>
  </NuxtLink>
</template>
