<script lang="ts" setup>
type CounterProps = {
  title: string
  subtitle: string
  value: number
}

const { title } = defineProps<CounterProps>()

const emit = defineEmits(['add', 'reduce'])

function onAdd() {
  emit('add', title)
}
function onReduce() {
  emit('reduce', title)
}
</script>

<template>
  <div class="flex flex-row items-center justify-between">
    <div class="flex flex-col">
      <div class="text-medium">{{ title }}</div>
      <div class="font-light text-gray-600">{{ subtitle }}</div>
    </div>
    <div class="flex flex-row items-center gap-4">
      <div
        :class="`${
          value === 1 ? 'cursor-not-allowed' : ''
        } w-10 h-10 rounded-full border-2 border-neutral-400 flex items-center justify-center text-neutral-600 cursor-pointer hover:opacity-80 transition`"
        @click="onReduce">
        <Icon
          name="fa6-solid:minus"
          class="size-4" />
      </div>
      <div class="text-xl font-light text-neutral-600">{{ value }}</div>
      <div
        class="flex items-center justify-center w-10 h-10 transition border-2 rounded-full cursor-pointer border-neutral-400 text-neutral-600 hover:opacity-80"
        @click="onAdd">
        <Icon
          name="fa6-solid:plus"
          class="size-4" />
      </div>
    </div>
  </div>
</template>
