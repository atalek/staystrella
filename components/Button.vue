<script lang="ts" setup>
type ButtonProps = {
  label: string
  disabled?: boolean
  outline?: boolean
  small?: boolean
  type?: 'button' | 'submit' | 'reset'
  href?: string
  danger?: boolean
}

const { label, outline, small, disabled, type, danger } = defineProps<ButtonProps>()

const buttonClasses = computed(
  () =>
    `text-center relative disabled:opacity-60 disabled:cursor-not-allowed rounded-lg hover:opacity-70 transition w-full ${
      outline
        ? ' bg-white border-black text-black  disabled:bg-slate-400'
        : ' bg-primary border-2 primary text-white'
    } ${
      small
        ? ' py-1.5 text-sm font-light border-2 w-1/2'
        : ' py-3  text-md font-semibold border-2'
    } ${danger ? ' bg-rose-600 disabled:bg-rose-400 border-rose-600' : ''}`,
)
</script>

<template>
  <button
    :disabled="disabled"
    :type="type || 'button'"
    :class="buttonClasses">
    <slot />
    {{ label }}
  </button>
</template>
