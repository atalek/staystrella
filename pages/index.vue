<script lang="ts" setup>
import { useToast } from 'vue-toastification'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const { allListings, isLoading, fetchNextSet } = useFilteredPagination()

if (import.meta.client) {
  if (route.fullPath.includes('?email=verified')) {
    toast.success('Email verified')

    const url = new URL(route.fullPath, window.location.origin)

    url.searchParams.delete('email')

    router.replace(url.pathname + url.search)
  } else if (route.fullPath.includes('?error')) {
    toast.error('Invalid or missing token')

    const url = new URL(route.fullPath, window.location.origin)

    url.searchParams.delete('error')

    router.replace(url.pathname + url.search)
  }
}
</script>

<template>
  <section>
    <Container>
      <IsEmpty
        v-if="!isLoading && allListings?.length === 0"
        :showReset="true" />
      <div
        class="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
        v-if="!!allListings">
        <ListingCard
          v-for="listing in allListings"
          :listing
          :key="listing.id" />
      </div>
      <Observer @intersect="fetchNextSet" />
      <LoadingListingCards
        :cards="12"
        v-if="isLoading" />
    </Container>
  </section>
</template>
