<script setup lang="ts">
import type { Listing } from '~/types'

const {
  data: properties,
  isLoading,
  fetchNextSet,
} = usePagination<Listing>('/api/v1/myproperties')

function navigate(id: string) {
  return navigateTo(`/properties/${id}/edit`)
}

useSeoMeta({
  title: 'Your Properties',
})
</script>
<template>
  <section>
    <Container>
      <div v-if="properties && properties.length > 0">
        <Heading
          title="My properties"
          subTitle="Properties that you have listed" />
        <div
          class="grid grid-cols-1 gap-8 mt-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          <ListingCard
            v-for="listing in properties"
            :key="listing.id"
            :listing
            actionLabel="Edit"
            :actionId="listing.id"
            @action="navigate" />
        </div>
        <Observer @intersect="fetchNextSet" />
      </div>
      <LoadingListingCards
        heading
        v-if="isLoading" />
    </Container>

    <IsEmpty
      v-if="(!isLoading && properties?.length === 0) || (!isLoading && !properties)"
      title="No properties listed"
      subTitle="Looks like you haven't listed any property"
      showReset
      label="Go back home" />
  </section>
</template>
