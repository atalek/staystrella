<script setup lang="ts">
import type { AuthUser } from '~/types'

type ListingInfoProps = {
  user?: AuthUser
  description?: string
  roomCount?: number
  guestCount?: number
  bathroomCount?: number
  locationValue: string
  category:
    | {
        icon: string
        label: string
        description: string
      }
    | undefined
}

const { locationValue } = defineProps<ListingInfoProps>()
const { getByValue } = useCountries()
const coordinates = getByValue(locationValue)?.latlng
</script>
<template>
  <div class="col-span-4 flex flex-col gap-8">
    <div class="flex flex-col gap2">
      <UserInfo
        v-if="user"
        :user />

      <div class="flex flex-row items-center gap-4 font-light text-neutral-500">
        <div>{{ guestCount }} guests</div>
        <div>{{ roomCount }} rooms</div>
        <div>{{ bathroomCount }} bathrooms</div>
      </div>
    </div>
    <hr />
    <div v-if="category">
      <ListingCategory
        :icon="category.icon"
        :label="category.label"
        :description="category.description" />
    </div>
    <hr />
    <div class="text-lg font-light text-neutral-500">
      {{ description }}
    </div>
    <hr />
    <ClientOnly>
      <Map :center="coordinates" />
    </ClientOnly>
  </div>
</template>
