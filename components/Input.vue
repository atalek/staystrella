<script setup lang="ts">
type InputProps = {
  id: string
  label: string
  type?: string
  value?: string
  disabled?: boolean
  formatPrice?: boolean
  required?: boolean
  error?: string
}

const { type = 'text' } = defineProps<InputProps>()
const model = defineModel()
</script>

<template>
  <div class="relative w-full">
    <Icon
      name="fa-solid:dollar-sign"
      class="absolute size-6 text-neutral-700 top-5 left-2"
      v-if="formatPrice" />

    <input
      :class="`peer w-full p-4 pt-6 font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70  disabled:bg-gray-300 disabled:border-0 disabled:cursor-not-allowed disabled:text-gray-500 ${
        formatPrice ? 'pl-9 ' : 'pl-4 '
      } ${!!error ? ' border-rose-500 ' : ' focus:border-black '}`"
      :id="id"
      :type
      :disabled
      placeholder=" "
      v-model="model" />
    <label
      :class="`absolute text-md duration-150 transform -translate-y-3 top-5 z-10 origin-[0] ${
        formatPrice ? 'left-9' : 'left-4'
      } peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 ${
        !!error ? 'text-rose-500' : 'text-zinc-400'
      }`"
      >{{ label }}</label
    >
    <p
      class="mt-1 text-sm text-rose-500"
      v-if="error">
      {{ error }}
    </p>
  </div>
</template>
