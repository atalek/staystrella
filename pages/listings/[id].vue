<script setup lang="ts">
import { differenceInCalendarDays, eachDayOfInterval, format, parseISO } from 'date-fns'
import { useToast } from 'vue-toastification'
import { categories } from '~/data/constants'
import type { Listing } from '~/types'

const route = useRoute('listings-id')
const id = route.params.id

const toast = useToast()
const user = useUser()

const {
  data: listing,
  error,
  status,
} = await useFetch<Listing>(`/api/v1/listings/${id}`, { lazy: true })

const category = computed(() =>
  categories.find(c => c.label === listing?.value?.category),
)

const dateRange = ref<{ start: Date | null; end: Date | null }>({
  start: null,
  end: null,
})
const isLoading = ref(false)

async function createReservation() {
  if (!user.value) {
    return navigateTo('/login')
  } else {
    try {
      isLoading.value = true

      if (dateRange.value.start === null || dateRange.value.end === null) {
        toast.error('Start date and end date are required!')
        return
      }

      const startDate = format(new Date(dateRange.value.start), 'yyyy-MM-dd')
      const endDate = format(new Date(dateRange.value.end), 'yyyy-MM-dd')
      const body = {
        startDate,
        endDate,
        listingId: listing?.value?.id,
      }
      const res = await $fetch('/api/v1/reservations', {
        method: 'POST',
        body,
      })
      if (res.statusCode === 201) {
        toast.success('Reservation created!')
        await navigateTo('/trips')
      }
    } catch (error: any) {
      console.error(error)
      toast.error(error.data.message)
    } finally {
      isLoading.value = false
    }
  }
}

const totalPrice = computed(() => {
  let dayCount
  let price
  if (dateRange.value.start && dateRange.value.end) {
    dayCount = differenceInCalendarDays(dateRange.value.end, dateRange.value.start)
  }
  if (dayCount && listing?.value?.price) {
    price = dayCount * listing?.value?.price
  } else {
    price = listing?.value?.price
  }
  return price
})

const disabledDates = computed(() => {
  let dates: Date[] = []

  listing?.value?.reservations?.forEach(reservation => {
    const range = eachDayOfInterval({
      start: parseISO(reservation.startDate),
      end: parseISO(reservation.endDate),
    })

    dates = dates.concat(range)
  })

  dates = Array.from(new Set(dates))

  return dates
})

const config = useRuntimeConfig().public

useSeoMeta({
  title: () => listing?.value?.title as string,
  description: () => listing?.value?.description,
  ogTitle: () => listing?.value?.title,
  ogDescription: () => listing?.value?.description,
  ogImage: () => config.imageUrl + listing?.value?.imageSrc,
  twitterImage: () => config.imageUrl + listing?.value?.imageSrc,
  twitterDescription: () => listing?.value?.description,
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <section>
    <Container>
      <div
        class="max-w-screen-lg mx-auto"
        v-if="!!listing && !error && status === 'success'">
        <div class="flex flex-col gap-6">
          <ListingHead
            :title="listing.title"
            :imageSrc="listing.imageSrc"
            :locationValue="listing.locationValue"
            :id="listing.id" />
          <div class="grid grid-cols-1 mt-6 md:grid-cols-7 md:gap-10">
            <ListingInfo
              :user="listing.auth_user"
              :category="category"
              :description="listing?.description"
              :roomCount="listing?.roomCount"
              :guestCount="listing?.guestCount"
              :bathroomCount="listing?.bathroomCount"
              :locationValue="listing.locationValue" />

            <div class="order-first mb-10 md:order-last md:col-span-3">
              <ListingReservation
                @createReservation="createReservation"
                :price="listing?.price"
                :totalPrice="totalPrice"
                :disabledDates
                :disabled="isLoading"
                v-model="dateRange" />
            </div>
          </div>
        </div>
      </div>
    </Container>

    <div v-if="error">
      <IsEmpty
        :subTitle="error.data.message"
        showReset
        label="Go back home" />
    </div>
  </section>
</template>
