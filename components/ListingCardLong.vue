<script setup lang="ts">
import { format } from 'date-fns'
import type { AuthUser, Listing, Reservation } from '~/types'

type ListingCardLongProps = {
  listing: Listing
  reservation: Reservation
  user: AuthUser
  disabled?: boolean
  actionLabel?: string
  actionId?: string
}

const { reservation, listing } = defineProps<ListingCardLongProps>()

const { getByValue } = useCountries()
const location = getByValue(listing.locationValue)

const reservationDate = computed(() => {
  if (!reservation) return null

  const start = new Date(reservation?.startDate)
  const end = new Date(reservation?.endDate)

  return `${format(start, 'PP')} - ${format(end, 'PP')}`
})

const emit = defineEmits(['favorited', 'cancelReservation'])

function favorited() {
  emit('favorited')
}

function cancelReservation(id: string) {
  emit('cancelReservation', id)
}
</script>
<template>
  <div class="flex flex-col w-full gap-4 p-4 border-2 md:flex-row rounded-xl">
    <div class="relative my-2 overflow-hidden group rounded-xl shrink-0">
      <NuxtLink :to="`/listings/${listing.id}`">
        <NuxtImg
          provider="cloudinary"
          :src="listing.imageSrc"
          height="360"
          width="360"
          sizes="100vw sm:50vw md:450px"
          :alt="`Image of ${listing.title}`"
          format="webp"
          class="object-cover w-full max-h-[360px] rounded-xl aspect-square group-hover:scale-110 transition" />

        <div
          class="absolute top-3 right-3"
          @click="(e: MouseEvent) => e.preventDefault()">
          <HeartButton
            :listingId="listing.id"
            @favorited="favorited"
            @click="(e: MouseEvent) => e.preventDefault()" />
        </div>
      </NuxtLink>
    </div>
    <div class="flex flex-col flex-grow gap-4">
      <Heading
        :title="listing.title"
        :subTitle="listing.description" />

      <div class="text-lg font-semibold line-clamp-1">
        {{ location?.flag }} {{ location?.label }}, {{ location?.region }}
      </div>
      <div class="font-light text-neutral-500">
        {{ reservationDate || listing.category }}
      </div>
      <div class="flex flex-row items-center gap-1">
        <div class="font-semibold">$ {{ reservation.totalPrice }}</div>
        <div
          v-if="!reservation.totalPrice && !reservation"
          class="font-light">
          night
        </div>
      </div>
      <div class="mt-2">
        <UserInfo :user />
      </div>

      <Button
        class="w-full mt-auto md:max-w-sm"
        @click="cancelReservation(actionId!)"
        small
        v-if="actionLabel"
        :disabled
        :label="actionLabel" />
    </div>
  </div>
</template>
