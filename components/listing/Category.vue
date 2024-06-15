<script setup lang="ts">
type ListingCategoryProps = {
  icon: string
  description: string
  label: string
}

defineProps<ListingCategoryProps>()
</script>
<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-row items-center gap-4">
      <Icon
        :name="icon"
        class="size-8 text-neutral-600" />
      <div class="flex flex-col">
        <div class="text-lg font-semibold">
          {{ label }}
        </div>
        <div class="text-neutral-500 font-light">
          {{ description }}
        </div>
      </div>
    </div>
  </div>
</template>
