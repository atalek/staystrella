<script lang="ts" setup>
import { useToast } from 'vue-toastification'

type HeartButtonProps = {
  listingId: string
}
const { listingId } = defineProps<HeartButtonProps>()

const toast = useToast()

const user = useUser()

const list = ref(user?.value?.favoriteIds || [])
const isFavorite = computed(() => list.value.includes(listingId))

function optimisticUpdate(listingId: string) {
  if (list.value.includes(listingId)) {
    list.value = list.value.filter(id => id !== listingId)
  } else {
    list.value.push(listingId)
  }
}

const emit = defineEmits(['favorited'])

async function toggleFavorite(e: MouseEvent) {
  e.stopPropagation()
  if (!user.value) {
    return navigateTo('/login')
  }

  const currentlyFavorited = isFavorite.value

  optimisticUpdate(listingId)

  try {
    let res
    if (currentlyFavorited) {
      res = await $fetch(`/api/v1/favorites/${listingId}`, { method: 'DELETE' })
      emit('favorited')
    } else {
      res = await $fetch(`/api/v1/favorites/${listingId}`, { method: 'POST' })
      emit('favorited')
    }
  } catch (error: any) {
    console.error(error)
    toast.error(error.data.message)
  }
}
</script>

<template>
  <div
    @click="toggleFavorite"
    class="relative p-4 transition cursor-pointer hover:opacity-70">
    <Icon
      name="material-symbols:favorite"
      v-if="isFavorite"
      class="size-10 text-rose-500 absolute -top-[2px] -right-[2px]" />
    <Icon
      name="material-symbols:favorite-outline"
      v-else
      class="size-10 text-white hover:text-rose-500 transition absolute -top-[2px] -right-[2px]" />
  </div>
</template>
