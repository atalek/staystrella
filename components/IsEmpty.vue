<script lang="ts" setup>
type IsEmptyProps = {
  title?: string
  subTitle?: string
  showReset?: boolean
  label?: string
}
withDefaults(defineProps<IsEmptyProps>(), {
  title: 'No exact matches',
  subTitle: 'Try changing or removing some of your filters',
  showReset: false,
  label: 'Remove all filters',
})

const router = useRouter()
</script>

<template>
  <div class="h-[60vh] flex flex-col gap-2 justify-center items-center">
    <Heading
      :title
      :subTitle
      center />
    <div
      class="w-48 mt-4"
      v-if="showReset">
      <NuxtLink to="/">
        <Button
          :label
          outline />
      </NuxtLink>
    </div>
  </div>
</template>
