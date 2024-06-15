<script setup lang="ts">
import type { CategoryValue } from '~/types'

type SelectProps = {
  id: string
  label: string
  value?: string
  disabled?: boolean
  required?: boolean
  error?: string
  values: CategoryValue[]
}
defineProps<SelectProps>()

const model = defineModel()
</script>

<template>
  <div class="w-full relative">
    <select
      :class="`peer w-full p-4 pt-6 font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70  disabled:bg-gray-300 disabled:border-0 disabled:cursor-not-allowed disabled:text-gray-500  ${
        !!error ? ' border-rose-500 ' : ' focus:border-black '
      }`"
      :id="id"
      :disabled
      placeholder=" "
      v-model="model">
      <option
        v-for="value in values"
        :value="value.label">
        {{ value.label }}
      </option>
    </select>
    <p
      class="text-rose-500 text-sm"
      v-if="error">
      {{ error }}
    </p>
  </div>
</template>
