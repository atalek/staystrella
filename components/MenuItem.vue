<script setup lang="ts">
type MenuItemProps = {
  label: string
  href?: string
  icon?: string
  big?: boolean
}
defineProps<MenuItemProps>()
</script>
<template>
  <div>
    <NuxtLink
      :to="href"
      :class="[
        'flex items-center w-full text-sm text-gray-900 rounded-md hover:bg-primary hover:text-white group',
        big ? 'px-3 py-4' : 'px-2 py-2',
      ]">
      <Icon
        :name="icon"
        class="mr-2 size-5 group-hover:text-gray-900 text-primary"
        aria-hidden="true" />
      {{ label }}
    </NuxtLink>
  </div>
</template>
