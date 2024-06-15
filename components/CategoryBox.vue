<script lang="ts" setup>
type CategoryProps = {
  label: string
  icon: string
  selected?: boolean
}
const { label } = defineProps<CategoryProps>()

const route = useRoute()
const router = useRouter()

function handleClick() {
  const updatedQuery = { ...router.currentRoute.value.query }

  if (updatedQuery.category === label) {
    delete updatedQuery.category
  } else {
    updatedQuery.category = label
    updatedQuery.page = '1'
  }

  router.replace({ path: '/', query: updatedQuery })
}
</script>

<template>
  <div
    @click="handleClick"
    :class="`  flex flex-col items-center justify-center gap-2 p-3 border-b-2 hover:text-neutral-800 transition cursor-pointer ${
      selected
        ? 'border-b-neutral-800 text-neutral-800 '
        : 'border-transparent text-neutral-500 '
    }`">
    <Icon
      :name="icon"
      class="size-8" />
    <div class="font-semibold">{{ label }}</div>
  </div>
</template>
