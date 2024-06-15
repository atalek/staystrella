<script lang="ts" setup>
type AvatarProps = {
  big?: boolean
  src?: string
}

defineProps<AvatarProps>()
</script>

<template>
  <NuxtImg
    format="webp"
    loading="eager"
    class="rounded-full"
    :src="src || 'bdzdebalgjgnbsgevvkd.webp'"
    :height="big ? '140' : '30'"
    :width="big ? '140' : '30'"
    :alt="'avatar'"
    provider="cloudinary" />
</template>
