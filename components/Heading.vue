<script setup lang="ts">
type HeadingProps = {
  title: string
  subTitle?: string
  center?: boolean
  danger?: boolean
}

const { danger } = defineProps<HeadingProps>()

const subtitleClasses = computed(
  () => `mt-2 ${danger ? 'text-red-600 font-semibold ' : 'font-light text-neutral-500'}`,
)
</script>

<template>
  <div :class="` ${center ? ' text-center ' : ' text-start '}  text-balance`">
    <div class="text-2xl font-bold">
      {{ title }}
    </div>
    <div
      :class="subtitleClasses"
      v-if="subTitle">
      {{ subTitle }}
    </div>
  </div>
</template>
