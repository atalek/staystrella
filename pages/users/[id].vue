<script setup lang="ts">
import type { AuthUser, Listing } from '~/types'

const route = useRoute('users-id')
const id = route.params.id

const { data: user, status } = await useFetch<AuthUser>(`/api/v1/users/user/${id}`, {
  lazy: true,
})
const loggedInUser = useUser()

const {
  data: listings,
  isLoading,
  fetchNextSet,
} = usePagination<Listing>(`/api/v1/users/listings/${id}`)

const config = useRuntimeConfig().public

useSeoMeta({
  title: () => user?.value?.name as string,
  description: () => user?.value?.description,
  ogTitle: () => user?.value?.name,
  ogDescription: () => user?.value?.description,
  ogImage: () => config.imageUrl + user?.value?.image,
  twitterImage: () => config.imageUrl + user?.value?.image,
  twitterDescription: () => user?.value?.description,
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <Container>
    <LoadingUserProfile v-if="status === 'pending'" />
    <section
      class="flex flex-col md:flex-row"
      v-if="status === 'success' && user">
      <div class="md:max-w-[320px] w-full">
        <div
          class="flex items-center justify-center md:max-w-xs w-full max-h-[280px] border-2 rounded-xl p-4 shrink-0">
          <div class="flex flex-col items-center justify-center my-4 gap-y-4">
            <Avatar
              big
              :src="user?.image" />
            <Heading
              :title="`${user?.name}`"
              center />
          </div>
        </div>
        <NuxtLink
          to="/account-settings"
          v-if="user?.id === loggedInUser?.id"
          class="flex"
          ><Button
            label="Edit"
            class="mt-2"
        /></NuxtLink>
      </div>
      <div class="flex-grow p-6 md:p-10">
        <div class="md:max-w-[65%] text-balance my-2">
          <Heading :title="`About ${user?.name}`" />
          <p
            class="py-8"
            v-if="user?.description">
            {{ user?.description }}
          </p>
        </div>
        <hr />
        <div
          class="my-8"
          v-if="user && listings.length > 0">
          <Heading :title="`${user?.name}'s listings`" />
          <div
            class="grid grid-cols-1 gap-8 mt-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            <template
              v-for="listing in listings"
              :key="listing?.id">
              <template v-if="listing !== null">
                <ListingCard :listing="listing" />
              </template>
            </template>
          </div>
          <Observer @intersect="fetchNextSet" />
        </div>
        <div
          class="mt-8"
          v-if="user && listings.length === 0 && !isLoading">
          <Heading :title="`${user?.name} hasn't posted any listings yet`" />
        </div>
        <div
          class="mt-16"
          v-if="isLoading">
          <LoadingListingCards :cards="5" />
        </div>
      </div>
    </section>
    <IsEmpty
      v-else
      title="User not found"
      subTitle="Looks like user you are looking for does not exist"
      showReset
      label="Go back home" />
  </Container>
</template>
