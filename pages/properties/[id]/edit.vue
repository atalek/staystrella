<script setup lang="ts">
import { useToast } from 'vue-toastification'
import type { CountrySelectValue, Listing } from '~/types'
import { categories } from '~/data/constants'
import { ListingValuesSchema } from '~/zod-schemas/listing-schema'

const route = useRoute('properties-id-edit')
const id = route.params.id
const toast = useToast()
const { getByValue } = useCountries()

const { data: listing } = await useFetch<Listing>(`/api/v1/listings/${id}`)
const isLoading = ref(false)
const errors = reactive<{ [key: string]: string }>({
  title: '',
  description: '',
  price: '',
})

const listingData = reactive({
  title: listing?.value?.title || '',
  description: listing?.value?.description || '',
  imageSrc: listing?.value?.imageSrc || '',
  category: listing?.value?.category || '',
  roomCount: listing?.value?.roomCount || 1,
  bathroomCount: listing?.value?.bathroomCount || 1,
  guestCount: listing?.value?.guestCount || 1,
  locationValue:
    getByValue(listing?.value?.locationValue) || (null as CountrySelectValue | null),
  price: listing?.value?.price || 1,
})

async function updateListing() {
  try {
    Object.keys(errors).forEach(key => (errors[key] = ''))

    const validationResult = ListingValuesSchema.safeParse(listingData)

    if (!validationResult.success) {
      validationResult.error.errors.forEach(error => {
        errors[error.path[0]] = error.message
      })
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    isLoading.value = true
    const res = await $fetch(`/api/v1/listings/${id}`, {
      method: 'PUT',
      body: listingData,
    })
    if (!!res) {
      toast.success('Listing updated ')
      return navigateTo('/properties')
    }
  } catch (err: any) {
    toast.error(err.data.message)
  } finally {
    isLoading.value = false
  }
}

async function deleteListing() {
  try {
    isLoading.value = true
    const res = $fetch(`/api/v1/listings/${id}`, { method: 'DELETE' })
    if (!!res) {
      toast.success('Listing deleted ')
      return navigateTo('/properties')
    }
  } catch (err: any) {
    toast.error(err.data.message)
  } finally {
    isLoading.value = false
  }
}

function add(title: string) {
  if (title === 'Guests') {
    listingData.guestCount++
  } else if (title === 'Rooms') {
    listingData.roomCount++
  } else {
    listingData.bathroomCount++
  }
}
function reduce(title: string) {
  if (title === 'Guests') {
    if (listingData.guestCount === 1) return
    listingData.guestCount--
  } else if (title === 'Rooms') {
    if (listingData.roomCount === 1) return
    listingData.roomCount--
  } else {
    if (listingData.bathroomCount === 1) return
    listingData.bathroomCount--
  }
}

function locationSelected(location: CountrySelectValue) {
  listingData.locationValue = location
}

useSeoMeta({
  title: () => `Edit ${listing?.value?.title}`,
})
</script>
<template>
  <EditContainer href="/properties">
    <EditFormContainer>
      <Heading :title="`Edit ${listingData?.title}`" />
      <section>
        <form
          class="max-w-2xl mt-6 space-y-6"
          @submit.prevent="updateListing">
          <div class="flex flex-col gap-y-6">
            <Input
              id="title"
              label="Listing Title"
              type="text"
              class="block w-full mt-1"
              v-model="listingData.title"
              :disabled="isLoading"
              :error="errors.title" />

            <Select
              :values="categories"
              v-model="listingData.category"
              id="category"
              label="Listing Category" />

            <CountrySelect
              :selectedCountry="listingData?.locationValue"
              @countrySelect="locationSelected" />
            <TextArea
              id="description"
              label="Listing description "
              v-model="listingData.description"
              :disabled="isLoading"
              :error="errors.description" />

            <Input
              id="Price"
              label="Price"
              type="number"
              v-model="listingData.price"
              :disabled="isLoading"
              :error="errors.price"
              formatPrice
              required />

            <hr />

            <div class="flex flex-col gap-8">
              <Heading
                title="Share some basics about your place"
                subTitle="What amenities do you have?" />
              <Counter
                title="Guests"
                subtitle="How many guests do you allow?"
                :value="listingData.guestCount"
                @add="add"
                @reduce="reduce" />
              <hr />
              <Counter
                title="Rooms"
                subtitle="How many rooms do you have?"
                :value="listingData.roomCount"
                @add="add"
                @reduce="reduce" />
              <hr />
              <Counter
                title="Bathrooms"
                subtitle="How many bathrooms do you have?"
                :value="listingData.bathroomCount"
                @add="add"
                @reduce="reduce" />
            </div>
            <hr />
            <ImageUpload v-model="listingData.imageSrc" />
            <hr />
            <Button
              class="w-full md:max-w-40"
              label="Update listing"
              type="submit"
              outline />
          </div>
        </form>
      </section>
    </EditFormContainer>

    <EditFormContainer>
      <div class="mt-6 space-y-6 max-2w-xl">
        <Heading
          danger
          title="Delete Listing"
          subTitle="Once your listing is deleted, all of its resources and data will be permanently deleted. Before deleting your listing, please download any data or information that you wish to retain.  " />

        <ClientOnly>
          <DeleteModal
            title="Are you sure you want to delete this listing?"
            subTitle="Deleting this listing will permanently remove all associated data! This action is irreversible!"
            buttonLabel="Delete Listing"
            @deleteConfirmed="deleteListing" />
        </ClientOnly>
      </div>
    </EditFormContainer>
  </EditContainer>
</template>
