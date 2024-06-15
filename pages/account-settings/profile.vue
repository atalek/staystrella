<script setup lang="ts">
import { useToast } from 'vue-toastification'
import { UserProfileInfoSchema } from '~/zod-schemas/profile-schema'

const user = useUser()
const toast = useToast()

const { data, refresh } = await useFetch('/api/v1/profile')
const description = ref(data?.value?.description || '')
const image = ref(data?.value?.image || '')
const imagePublicId = ref('')

const errors = reactive<{ [key: string]: string }>({
  image: '',
  description: '',
})
const isLoading = ref(false)

async function updateProfile() {
  Object.keys(errors).forEach(key => (errors[key] = ''))

  const result = UserProfileInfoSchema.safeParse({
    image: image.value,
    description: description.value,
    imagePublicId: imagePublicId.value,
  })

  if (!result.success) {
    result.error.errors.forEach(error => {
      errors[error.path[0]] = error.message
    })
    return
  }
  try {
    isLoading.value = true
    const res = await $fetch('/api/v1/profile', {
      method: 'PUT',
      body: {
        description: description.value,
        image: image.value,
        imagePublicId: imagePublicId.value,
      },
    })
    if (res) {
      toast.success('Profile info updated')
      refresh()
    }
  } catch (err: any) {
    toast.error(err.data.message)
  } finally {
    isLoading.value = false
  }
}

useSeoMeta({
  title: 'Edit Profile',
})

function handlePublicId(publicId: string) {
  imagePublicId.value = publicId
}
</script>
<template>
  <EditContainer>
    <EditFormContainer>
      <Heading
        title="Personalize Your Space"
        subTitle="Add a fun photo and tell us about yourself! " />
      <section>
        <form
          class="max-w-2xl mt-6 space-y-6"
          @submit.prevent="updateProfile">
          <div class="flex flex-col gap-y-6">
            <ImageUpload
              v-model="image"
              profile
              @imagePublicId="handlePublicId" />

            <p
              class="text-sm text-rose-500"
              v-if="errors.image">
              {{ errors.image }}
            </p>
          </div>

          <div>
            <TextArea
              id="description"
              label="Account description "
              v-model="description"
              :disabled="isLoading"
              :error="errors.description" />
          </div>

          <Button
            class="w-full md:max-w-40"
            label="Save"
            type="submit"
            outline />
        </form>
      </section>
    </EditFormContainer>
  </EditContainer>
</template>
