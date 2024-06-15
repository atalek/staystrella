<script setup lang="ts">
import { useToast } from 'vue-toastification'
import type { MyTripsType } from '~/types'

const toast = useToast()
const {
  data: myTrips,
  isLoading,
  fetchNextSet,
} = usePagination<MyTripsType>('/api/v1/mytrips')

async function cancelReservation(id: string) {
  try {
    removeReservation(id)
    const res = await $fetch(`/api/v1/reservations/${id}`, { method: 'DELETE' })
    if (!!res) {
      toast.success('Reservation cancelled')
    }
  } catch (error: any) {
    console.error(error.data.message)
    toast.error(error.data.message)
  }
}

function removeReservation(id: string) {
  myTrips.value = myTrips.value.filter(trip => trip.reservation.id !== id)
}

useSeoMeta({
  title: 'Your Trips',
})
</script>

<template>
  <section>
    <Container>
      <IsEmpty
        v-if="(!isLoading && myTrips.length === 0) || (!isLoading && !myTrips)"
        title="No trips found"
        subTitle="Looks like you haven't reserved any trips"
        showReset
        label="Go back home" />
      <div v-if="myTrips.length > 0">
        <Heading
          title="Trips"
          subTitle="Where you've been and where you're going" />

        <div
          class="grid grid-cols-1 gap-8 mt-10 2xl:grid-cols-2"
          v-if="myTrips.length > 0">
          <ListingCardLong
            v-for="item in myTrips"
            :key="item.reservation.id"
            :reservation="item.reservation"
            :listing="item.listing"
            :user="item.user"
            actionLabel="Cancel reservation"
            :actionId="item.reservation.id"
            @cancelReservation="cancelReservation" />
        </div>
        <Observer @intersect="fetchNextSet" />
      </div>
      <LoadingListingCardsLong
        heading
        v-if="isLoading" />
    </Container>
  </section>
</template>
