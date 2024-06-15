<script lang="ts" setup>
import { useToast } from 'vue-toastification'
import { PasswordsSchema } from '~/zod-schemas/auth-schemas'

const toast = useToast()
const password = ref('')
const confirmPassword = ref('')
const errors = reactive<{ [key: string]: string }>({
  password: '',
  confirmPassword: '',
  err: '',
})
const emailSent = ref(false)
const route = useRoute()
const token = route.query.token

const isLoading = ref(false)

async function newPassword() {
  Object.keys(errors).forEach(key => (errors[key] = ''))

  const result = PasswordsSchema.safeParse({
    password: password.value,
    confirmPassword: confirmPassword.value,
  })
  if (!result.success) {
    result.error.errors.forEach(error => {
      errors[error.path[0]] = error.message
    })
    return
  }
  try {
    isLoading.value = true
    const res = await $fetch(`/api/v1/auth/new-password?token=${token}`, {
      method: 'POST',
      body: { password: password.value },
    })
    if (!!res) {
      return navigateTo('/')
    }
  } catch (err: any) {
    toast.error(err.data.message)
    errors.err = err.data.message
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
        class="flex flex-col gap-4 my-4"
        @submit.prevent="newPassword">
        <Input
          id="password"
          type="password"
          label="Password"
          v-model="password"
          :disabled="isLoading"
          :error="errors.password" />
        <Input
          id="confirm-password"
          type="password"
          label="Confirm Password"
          v-model="confirmPassword"
          :disabled="isLoading"
          :error="errors.confirmPassword" />

        <p
          class="text-sm text-rose-500"
          v-if="errors.err">
          {{ errors.err }}
        </p>
        <Button
          label="Create new password"
          type="submit"
          class="mt-4"
          :disabled="isLoading" />
      </form>
    </EditFormContainer>
  </section>
</template>
