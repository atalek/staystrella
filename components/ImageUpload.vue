<script lang="ts" setup>
type ImageUploadProps = {
  profile?: boolean
}
defineProps<ImageUploadProps>()

const config = useRuntimeConfig().public
const emit = defineEmits(['imagePublicId'])

declare global {
  interface Window {
    cloudinary: any
  }
}

const model = defineModel<string>()

const oAuthImageSrc = computed(() => /^(https:\/\/avatars|https:\/\/lh3)/.test(model))

let widget: any

if (import.meta.client) {
  widget = window.cloudinary.createUploadWidget(
    {
      cloud_name: config.cloudinaryName,
      upload_preset: config.cloudinaryFolder,
      multiple: false,
      maxFiles: 1,
      clientAllowedFormats: ['png', 'jpg', 'jpeg', 'webp'],
    },
    (error: any, result: { event: string; info: { path: string } }) => {
      if (!error && result && result.event === 'success') {
        const path = result.info.path
        const filename = path.split('/').pop()
        const imagePublicId = result.info.public_id

        emit('imagePublicId', imagePublicId)
        if (filename) {
          model.value = filename
        }
      }
    },
  )
}

function openUploadWidget() {
  widget.open()
}
</script>

<template>
  <div
    class="flex flex-col items-center justify-center gap-4 p-20 transition border-2 border-dashed cursor-pointer hover:opacity-70 border-neutral-300 text-neutral-600"
    @click="openUploadWidget"
    v-if="!profile">
    <Icon
      name="material-symbols:add-photo-alternate-outline-rounded"
      class="size-12" />
    <div class="text-lg font-semibold">Click to upload</div>
  </div>
  <div v-else>
    <Button
      @click="openUploadWidget"
      outline
      label="Click to upload"
      class="md:w-40">
      <Icon
        name="material-symbols:add-photo-alternate-outline-rounded"
        class="size-6" />
    </Button>
  </div>
  <div v-if="model">
    <NuxtImg
      v-if="oAuthImageSrc"
      alt="upload"
      class="object-cover object-center w-full h-full bg-center bg-cover"
      :src="model" />
    <NuxtImg
      v-else
      provider="cloudinary"
      alt="upload"
      class="object-cover object-center w-full h-full bg-center bg-cover"
      :src="model" />
  </div>
</template>
