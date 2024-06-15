<script lang="ts" setup>
import { TransitionRoot, TransitionChild, Dialog, DialogPanel } from '@headlessui/vue'
import { differenceInDays, formatISO } from 'date-fns'
import type { CountrySelectValue } from '~/types'
import { useRouteQuery } from '@vueuse/router'

enum STEPS {
  LOCATION = 0,
  DATE = 1,
  INFO = 2,
}

const isOpen = ref(false)

function closeModal() {
  isOpen.value = false
}
function openModal() {
  isOpen.value = true
}

const route = useRoute()
const router = useRouter()
const query = route.query

const step = ref(STEPS.LOCATION)
const location = ref<CountrySelectValue | null>(null)
const guestCount = ref(1)
const roomCount = ref(1)
const bathroomCount = ref(1)

const { getByValue } = useCountries()
let locationValue = useRouteQuery<string>('locationValue')
let startDate = useRouteQuery('startDate')
let endDate = useRouteQuery('endDate')
let guestsNum = useRouteQuery('guestCount')

const locationLabel = computed(() => {
  if (locationValue.value) {
    return getByValue(locationValue.value)?.label as string
  }
  return 'Anywhere'
})

const durationLabel = computed(() => {
  if (startDate.value && endDate.value) {
    const start = new Date(startDate.value as string)
    const end = new Date(endDate.value as string)

    let dif = differenceInDays(end, start)

    if (dif === 0) dif = 1

    return `${dif} Days`
  }
  return 'Any week'
})

const guestLabel = computed(() => {
  if (guestsNum.value) {
    return `${guestsNum.value} Guests`
  }
  return 'Add guests'
})

type DateRange = {
  start: Date | null
  end: Date | null
}

const dateRange = ref<DateRange>({
  start: null,
  end: null,
})

function onBack() {
  step.value--
}
function onNext() {
  step.value++
}

async function onSubmit() {
  if (step.value !== STEPS.INFO) return

  let currentQuery = {}

  if (query) {
    currentQuery = query
  }

  const updatedQuery: any = {
    ...currentQuery,
    locationValue: location?.value?.value,
    guestCount: guestCount.value,
    roomCount: roomCount.value,
    bathroomCount: bathroomCount.value,
  }

  if (dateRange.value.start) {
    updatedQuery.startDate = formatISO(dateRange.value.start)
  }
  if (dateRange.value.end) {
    updatedQuery.endDate = formatISO(dateRange.value.end)
  }

  step.value = STEPS.LOCATION
  isOpen.value = false

  Object.keys(updatedQuery).forEach(
    key => updatedQuery[key] == null && delete updatedQuery[key],
  )

  const queryString = new URLSearchParams(updatedQuery).toString()

  const url = '/' + '?' + queryString

  router.push(url)
}

function countrySelect(country: CountrySelectValue) {
  location.value = country
}

function add(title: string) {
  if (title === 'Guests') {
    guestCount.value++
  } else if (title === 'Rooms') {
    roomCount.value++
  } else {
    bathroomCount.value++
  }
}
function reduce(title: string) {
  if (title === 'Guests') {
    if (guestCount.value === 1) return
    guestCount.value--
  } else if (title === 'Rooms') {
    if (roomCount.value === 1) return
    roomCount.value--
  } else {
    if (bathroomCount.value === 1) return
    bathroomCount.value--
  }
}
</script>

<template>
  <div
    class="w-full max-w-sm py-2 transition border-2 rounded-full shadow-sm cursor-pointer hover:shadow-md text-nowrap"
    @click="openModal">
    <div class="flex flex-row items-center justify-between">
      <div class="px-6 text-sm font-semibold">{{ locationLabel }}</div>
      <div
        class="flex-1 hidden px-6 text-sm font-semibold text-center border-l border-r sm:block">
        {{ durationLabel }}
      </div>
      <div class="flex flex-row items-center gap-3 pl-5 pr-2 text-sm text-gray-600">
        <div class="hidden sm:block">{{ guestLabel }}</div>
        <div class="p-2 text-white rounded-full bg-primary">
          <Icon
            name="heroicons-solid:magnifying-glass"
            class="size-5" />
        </div>
      </div>
    </div>
  </div>

  <ClientOnly>
    <TransitionRoot
      appear
      :show="isOpen"
      as="template">
      <Dialog
        as="div"
        @close="closeModal"
        class="relative z-10">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0">
          <div class="fixed inset-0 bg-black/25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex items-center justify-center min-h-full p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95">
              <DialogPanel
                class="w-full max-w-3xl p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <div
                  class="flex items-center justify-center py-4 rounded-t relative border-b-[1px]">
                  <h3 class="text-3xl font-bold">Filters</h3>
                  <button
                    @click="closeModal"
                    class="absolute p-1 transition border-0 hover:opacity-70 right-2">
                    <Icon
                      name="heroicons-solid:x"
                      class="size-4" />
                  </button>
                </div>

                <div v-if="step === STEPS.LOCATION">
                  <div class="flex flex-col gap-8 mt-2 z-[10000]">
                    <Heading
                      title="Where do you wanna go?"
                      subTitle="Pick a country" />
                    <div class="py-2">
                      <CountrySelect
                        :selectedCountry="location"
                        @countrySelect="countrySelect" />
                    </div>
                    <Map :center="location?.latlng" />

                    <div class="flex flex-col gap-4 md:flex-row">
                      <Button
                        label="Close"
                        outline
                        @click="isOpen = false" />
                      <Button
                        @click="onNext"
                        label="Next" />
                    </div>
                  </div>
                </div>
                <div v-if="step === STEPS.DATE">
                  <div class="flex flex-col gap-8 mt-2">
                    <Heading
                      title="When do you plan to go?"
                      subTitle="Make sure everyone is free" />
                    <Calendar
                      v-model="dateRange"
                      expanded />
                    <div class="flex flex-col gap-4 md:flex-row">
                      <Button
                        label="Back"
                        outline
                        @click="onBack" />
                      <Button
                        @click="onNext"
                        label="Next" />
                    </div>
                  </div>
                </div>

                <div v-if="step === STEPS.INFO">
                  <div class="flex flex-col gap-8 mt-2">
                    <Heading
                      title="More information?"
                      subTitle="Find your perfect place?" />
                    <Counter
                      title="Guests"
                      subtitle="How many guests are coming ?"
                      :value="guestCount"
                      @add="add"
                      @reduce="reduce" />
                    <hr />
                    <Counter
                      title="Rooms"
                      subtitle="How many room are coming ?"
                      :value="roomCount"
                      @add="add"
                      @reduce="reduce" />
                    <hr />

                    <Counter
                      title="Bathrooms"
                      subtitle="How many bathrooms are coming ?"
                      :value="bathroomCount"
                      @add="add"
                      @reduce="reduce" />
                    <hr />

                    <div class="flex flex-col gap-4 md:flex-row">
                      <Button
                        label="Back"
                        outline
                        @click="onBack" />
                      <Button
                        @click="onSubmit"
                        label="Submit" />
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </ClientOnly>
</template>
