<script setup lang="ts">
import type { CountrySelectValue } from '~/types'
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  TransitionRoot,
} from '@headlessui/vue'

const { selectedCountry } = defineProps<{
  selectedCountry: CountrySelectValue | null
  disabled?: boolean
}>()

const { getAll } = useCountries()
const countries = getAll()

let selected = ref<CountrySelectValue | null>(selectedCountry || countries[0])

const query = ref('')
const filteredCountries = computed(() =>
  query.value === ''
    ? countries
    : countries.filter(country =>
        country.label
          .toLowerCase()
          .replace(/\s+/g, '')
          .includes(query.value.toLowerCase().replace(/\s+/g, '')),
      ),
)
const emit = defineEmits(['countrySelect'])

function selectCountry(country: CountrySelectValue) {
  emit('countrySelect', country)
}
</script>

<template>
  <div class="z-50 w-full">
    <Combobox
      v-model="selected"
      @update:modelValue="selectCountry">
      <div class="relative mt-1">
        <div
          class="relative w-full overflow-hidden text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-primary sm:text-sm">
          <ComboboxInput
            :disabled
            class="w-full py-5 pl-3 pr-10 text-sm leading-5 text-gray-900 border-none focus:ring-0 disabled:opacity-70 disabled:bg-gray-300 disabled:border-0 disabled:cursor-not-allowed disabled:text-gray-500"
            :displayValue="
              country => `${(country as CountrySelectValue).flag} ${(country as CountrySelectValue).label}, ${(country as CountrySelectValue).region}`
            "
            @change="query = $event.target.value" />
          <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
            <Icon
              name="lucide:chevrons-up-down"
              class="size-5"
              aria-hidden="true" />
          </ComboboxButton>
        </div>
        <TransitionRoot
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          @after-leave="query = ''">
          <ComboboxOptions
            class="absolute mt-1 max-h-80 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-[7000]">
            <div
              v-if="filteredCountries.length === 0 && query !== ''"
              class="relative px-4 py-2 text-gray-700 cursor-default select-none">
              Nothing found.
            </div>

            <ComboboxOption
              v-for="country in filteredCountries"
              as="template"
              :key="country.value"
              :value="country"
              v-slot="{ selected, active }">
              <li
                class="relative z-50 py-2 pl-10 pr-4 cursor-default select-none"
                :class="{
                  'bg-primary text-white': active,
                  'text-gray-900': !active,
                }">
                <span
                  class="block truncate"
                  :class="{ 'font-medium': selected, 'font-normal': !selected }">
                  {{ `${country.flag} ${country.label}, ${country.region}` }}
                </span>
                <span
                  v-if="selected"
                  class="absolute inset-y-0 left-0 flex items-center pl-3"
                  :class="{ 'text-white': active, 'text-emerald-600': !active }">
                  <Icon
                    class="size-5"
                    name="material-symbols:check"
                    aria-hidden="true" />
                </span>
              </li>
            </ComboboxOption>
          </ComboboxOptions>
        </TransitionRoot>
      </div>
    </Combobox>
  </div>
</template>
