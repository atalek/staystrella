<script setup lang="ts">
import { STEPS } from '~/composables/useCreateListing'
import { categories } from '~/data/constants'

const {
  listingValues,
  steps,
  isLoading,
  errors,
  onNext,
  onBack,
  add,
  reduce,
  categorySelected,
  locationSelected,
  createListing,
  imagePublicId,
} = useCreateListing()

useSeoMeta({
  title: 'Create Listing',
})
</script>

<template>
  <section
    class="relative w-full h-full max-w-2xl px-4 mx-auto my-6 mt-16 md:h-auto lg:h-auto md:px-0">
    <div
      class="flex flex-col gap-8"
      v-if="steps === STEPS.CATEGORY">
      <Heading
        title="Which of these best describes your place?"
        subTitle="Pick a category" />
      <div class="grid grid-cols-1 gap-3 overflow-y-auto md:grid-cols-2 lg:grid-cols-3">
        <CategoryInput
          v-for="category in categories"
          :key="category.label"
          :selected="listingValues.category === category.label"
          @categorySelect="categorySelected"
          :label="category.label"
          :icon="category.icon" />
      </div>
      <Button
        label="Next"
        :disabled="!listingValues.category"
        @click="onNext" />
    </div>
    <div
      class="flex flex-col gap-8"
      v-if="steps === STEPS.LOCATION">
      <Heading
        title="Where is your place located?"
        subTitle="Help guests find you!" />
      <ClientOnly>
        <CountrySelect
          :selectedCountry="listingValues?.locationValue"
          @countrySelect="locationSelected" />
        <Map :center="listingValues?.locationValue?.latlng" />
      </ClientOnly>
      <div class="flex flex-col gap-4 md:flex-row">
        <Button
          label="Back"
          outline
          @click="onBack" />
        <Button
          :disabled="!listingValues.locationValue"
          label="Next"
          @click="onNext" />
      </div>
    </div>
    <div
      class="flex flex-col gap-8"
      v-if="steps === STEPS.INFO">
      <Heading
        title="Share some basics about your place"
        subTitle="What amenities do you have?" />
      <Counter
        title="Guests"
        subtitle="How many guests do you allow?"
        :value="listingValues.guestCount"
        @add="add"
        @reduce="reduce" />
      <hr />
      <Counter
        title="Rooms"
        subtitle="How many rooms do you have?"
        :value="listingValues.roomCount"
        @add="add"
        @reduce="reduce" />
      <hr />
      <Counter
        title="Bathrooms"
        subtitle="How many bathrooms do you have?"
        :value="listingValues.bathroomCount"
        @add="add"
        @reduce="reduce" />
      <div class="flex flex-col gap-4 md:flex-row">
        <Button
          label="Back"
          outline
          @click="onBack" />
        <Button
          :disabled="
            !listingValues.guestCount ||
            !listingValues.roomCount ||
            !listingValues.bathroomCount
          "
          label="Next"
          @click="onNext" />
      </div>
    </div>

    <div
      class="flex flex-col gap-8"
      v-if="steps === STEPS.IMAGES">
      <Heading
        title="Add a photo of your place"
        subTitle="Show guests what your place looks like?" />
      <ClientOnly>
        <ImageUpload
          v-model="listingValues.imageSrc"
          @imagePublicId="imagePublicId" />
      </ClientOnly>
      <div class="flex flex-col gap-4 md:flex-row">
        <Button
          label="Back"
          outline
          @click="onBack" />
        <Button
          label="Next"
          :disabled="!listingValues.imageSrc"
          @click="onNext" />
      </div>
    </div>
    <div
      class="flex flex-col gap-8"
      v-if="steps === STEPS.DESCRIPTION">
      <Heading
        title="How would you describe your place?"
        subTitle="Short and sweet works best!" />
      <Input
        id="Title"
        label="Title"
        v-model="listingValues.title"
        :disabled="isLoading"
        :error="errors.title"
        required />
      <hr />
      <Input
        id="Description"
        label="Description"
        v-model="listingValues.description"
        :disabled="isLoading"
        :error="errors.description"
        required />
      <div class="flex flex-col gap-4 md:flex-row">
        <Button
          label="Back"
          outline
          @click="onBack" />
        <Button
          :disabled="!listingValues.description || listingValues.description.length > 400"
          label="Next"
          @click="onNext" />
      </div>
    </div>
    <div
      class="flex flex-col gap-8"
      v-if="steps === STEPS.PRICE">
      <Heading
        title="Now set your price"
        subTitle="How much do you charge per night?" />
      <Input
        id="Price"
        label="Price"
        type="number"
        v-model="listingValues.price"
        :disabled="isLoading"
        :error="errors.price"
        formatPrice
        required />
      <div class="flex flex-col gap-4 md:flex-row">
        <Button
          label="Back"
          outline
          @click="onBack" />
        <Button
          :disabled="!listingValues.price"
          label="Create"
          @click="createListing" />
      </div>
    </div>
  </section>
</template>
