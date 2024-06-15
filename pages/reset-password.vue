<script lang="ts" setup>
import { EmailSchema } from '~/zod-schemas/auth-schemas'

const email = ref('')
const error = ref('')
const emailSent = ref()
const isLoading = ref(false)

async function passwordReset() {
  error.value = ''
  const result = EmailSchema.safeParse(email.value)
  if (!result.success) {
    error.value = result.error.errors[0].message
    return
  }
  try {
    isLoading.value = true
    const res = await $fetch('/api/v1/auth/reset-password', {
      method: 'POST',
      body: { email: email.value },
    })
    if (!!res) {
      emailSent.value = true
    }
  } catch (err: any) {
    console.error(err.data.message)
    error.value = err.data.message
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <section class="flex flex-col items-center max-w-xl mx-auto mt-16">
    <Logo
      class="mb-6"
      big />
    <EditFormContainer>
      <Heading
        title="Forgot your password?"
        subTitle="No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one. " />

      <p
        v-if="emailSent"
        class="mt-4 font-semibold text-emerald-500">
        We have emailed your password reset link.
      </p>
      <form
        class="my-4"
        @submit.prevent="passwordReset">
        <Input
          id="email"
          type="email"
          label="Email"
          v-model="email"
          :error
          :disabled="isLoading" />
        <Button
          label="Email password reset link"
          type="submit"
          class="mt-4"
          :disabled="isLoading" />
      </form>
    </EditFormContainer>
  </section>
</template>
