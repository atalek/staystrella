<script setup lang="ts">
import { useToast } from 'vue-toastification'
import type { Listing } from '~/types'

const toast = useToast()

const {
  data: myReservations,
  isLoading,
  fetchNextSet,
} = usePagination<Listing>('/api/v1/myreservations')

async function cancelReservation(id: string) {
  try {
    removeReservation(id)
    const res = await $fetch(`/api/v1/reservations/${id}`, { method: 'DELETE' })
    if (res.statusCode === 204) {
      toast.success('Reservation cancelled')
    }
  } catch (error: any) {
    console.error(error.data.message)
    toast.error(error.data.message)
  }
}

function removeReservation(id: string) {
  myReservations.value.forEach(listing => {
    listing.reservations = listing?.reservations?.filter(
      reservation => reservation.id !== id,
    )
  })
}

useSeoMeta({
  title: 'Your Reservations',
})
</script>
<template>
  <section>
    <Container>
      <div v-if="myReservations.length > 0">
        <Heading
          title="Reservations"
          subTitle="Bookings on your properties" />

        <div
          class="grid grid-cols-1 gap-8 mt-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
          v-if="!!myReservations">
          <template
            v-for="listing in myReservations"
            :key="listing.id">
            <ListingCard
              v-for="reservation in listing.reservations"
              :key="listing?.id"
              :listing
              :reservation
              actionLabel="Cancel guest reservation"
              :actionId="reservation.id"
              @action="cancelReservation" />
          </template>
        </div>
        <Observer @intersect="fetchNextSet" />
      </div>

      <LoadingListingCards
        heading
        v-if="isLoading" />

      <div
        v-if="
          (!isLoading && myReservations.length === 0) || (!isLoading && !myReservations)
        ">
        <IsEmpty
          title="No reservations found"
          subTitle="Looks like you have no reservations on your properties"
          showReset
          label="Go back home" />
      </div>
    </Container>
  </section>
</template>
