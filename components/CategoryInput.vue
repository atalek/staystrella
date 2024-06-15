<script lang="ts" setup>
type CategoryInputProps = {
  label: string
  icon: string
  selected?: boolean
}
defineProps<CategoryInputProps>()

const emit = defineEmits(['categorySelect'])

function selectCategory(category: string) {
  emit('categorySelect', category)
}
</script>

<template>
  <div
    @click="selectCategory(label)"
    :class="`  rounded-xl border-2 p-4 flex flex-col gap-3 hover:border-black transition cursor-pointer ${
      selected ? 'border-black ' : 'border-neutral-200 '
    }`">
    <Icon
      :name="icon"
      class="size-6" />
    <div class="text-sm font-md">{{ label }}</div>
  </div>
</template>
