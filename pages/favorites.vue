<script setup lang="ts">
import type { Listing } from '~/types'

const {
  data: favorites,
  isLoading,
  fetchNextSet,
} = usePagination<Listing>('/api/v1/listings/favorites')

function favorited(id: string) {
  favorites.value = favorites.value.filter(fav => fav.id !== id)
}

useSeoMeta({
  title: 'Your Favorites',
})
</script>
<template>
  <section>
    <Container>
      <div v-if="favorites.length > 0">
        <Heading
          title="Favorites"
          subTitle="Your favorite locations" />
        <div
          class="grid grid-cols-1 gap-8 mt-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          <ListingCard
            v-for="listing in favorites"
            :key="listing.id"
            :listing
            @favorited="favorited" />
        </div>
        <Observer @intersect="fetchNextSet" />
      </div>
      <LoadingListingCards
        heading
        v-if="isLoading" />
    </Container>

    <IsEmpty
      v-if="(!isLoading && favorites?.length === 0) || (!isLoading && favorites === null)"
      title="No favorited listings found"
      subTitle="Looks like you haven't favorited any listing"
      showReset
      label="Go back home" />
  </section>
</template>
