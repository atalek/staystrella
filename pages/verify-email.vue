<script lang="ts" setup>
import { useToast } from 'vue-toastification'

const toast = useToast()
const route = useRoute()
const token = route.query.token

async function verifyEmail() {
  try {
    const res = await $fetch(`/api/v1/auth/verify-email?token=${token}`, {
      method: 'POST',
    })
    if (!!res) {
      return navigateTo('/?email=verified')
    }
  } catch (error: any) {
    console.error(error.data.message)
    toast.error(error.data.message)
  }
}

onMounted(async () => await verifyEmail())
</script>

<template>
  <section class="flex flex-col items-center max-w-xl mx-auto mt-32">
    <Logo
      class="mb-6"
      big />
    <EditFormContainer>
      <Heading
        title="Verifying email"
        subTitle="Please wait we are verifying your email" />

      <div class="flex items-center justify-center gap-2 mt-6">
        <div class="rounded-full size-6 animate-pulse bg-primary"></div>
        <div class="rounded-full size-6 animate-pulse bg-primary"></div>
        <div class="rounded-full size-6 animate-pulse bg-primary"></div>
      </div>
    </EditFormContainer>
  </section>
</template>
