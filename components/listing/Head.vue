<script setup lang="ts">
import { useImage } from '@vueuse/core'

type ListingHeadProps = {
  id: string
  title: string
  imageSrc: string
  locationValue: string
}
const { locationValue, imageSrc } = defineProps<ListingHeadProps>()
const { getByValue } = useCountries()
const location = getByValue(locationValue)

const { isLoading } = useImage({ src: imageSrc })
</script>

<template>
  <div>
    <Heading
      :title="title"
      :subTitle="`${location?.flag} ${location?.label}, ${location?.region} `" />

    <div
      v-if="isLoading"
      class="bg-slate-200 w-full h-[60vh] overflow-hidden rounded-xl relative animate-pulse my-2">
      <div class="absolute top-5 right-5">
        <Icon
          name="material-symbols:favorite-outline"
          class="size-10 text-slate-200 absolute -top-[2px] -right-[2px]" />
      </div>
    </div>

    <div
      class="w-full h-[60vh] overflow-hidden rounded-xl relative my-2"
      v-else>
      <NuxtImg
        loading="eager"
        provider="cloudinary"
        format="webp"
        :src="imageSrc"
        :alt="`Image of ${location?.label}`"
        class="object-fill object-center h-full w-full rounded-xl" />
      <div class="absolute top-5 right-5">
        <HeartButton :listingId="id" />
      </div>
    </div>
  </div>
</template>
