<script setup lang="ts">
import { useToast } from 'vue-toastification'
import { RegisterSchema } from '~/zod-schemas/auth-schemas'

const isLoading = ref(false)
const errors = reactive<{ [key: string]: string }>({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const toast = useToast()

const registerData = reactive({
  name: '',
  email: '',
  password: '',
  err: '',
})

const confirmPassword = ref('')

async function register() {
  Object.keys(errors).forEach(key => (errors[key] = ''))

  const result = RegisterSchema.safeParse({
    ...registerData,
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
    const res = await $fetch('/api/v1/auth/register', {
      method: 'POST',
      body: registerData,
    })
    if (res) {
      toast.success('Registered')
      await navigateTo('/')
    }
  } catch (error: any) {
    console.error(error.data.message)
    errors.err = error.data.message
  } finally {
    isLoading.value = false
  }
}

useSeoMeta({
  title: 'Register',
})
</script>

<template>
  <div
    class="relative w-full h-full max-w-2xl px-4 mx-auto my-6 mt-16 md:h-auto lg:h-auto md:px-0">
    <div class="flex flex-col gap-4">
      <Logo
        class="mx-auto"
        big />

      <Heading
        title="Welcome to Staystrella "
        subTitle="Create an account" />
      <form
        @submit.prevent="register"
        class="flex flex-col gap-4">
        <Input
          v-model="registerData.name"
          id="name"
          label="Name"
          :disabled="isLoading"
          required
          :error="errors.name" />
        <Input
          v-model="registerData.email"
          id="email"
          label="Email"
          type="email"
          :disabled="isLoading"
          required
          :error="errors.email" />
        <Input
          v-model="registerData.password"
          id="password"
          label="Password"
          type="password"
          :disabled="isLoading"
          required
          :error="errors.password" />
        <Input
          v-model="confirmPassword"
          id="confirm password"
          label="Confirm password"
          type="password"
          :disabled="isLoading"
          required
          :error="errors.confirmPassword" />

        <p
          class="text-sm text-rose-500"
          v-if="errors.err">
          {{ errors.err }}
        </p>

        <Button
          type="submit"
          label="Register">
        </Button>
      </form>
    </div>

    <div class="flex flex-col gap-4 mt-3">
      <hr />
      <a href="login/google">
        <Button
          outline
          label="Continue with Google">
          <Icon
            name="logos:google-icon"
            class="mr-1 size-5" />
        </Button>
      </a>
      <a href="login/github">
        <Button
          outline
          label="Continue with Github">
          <Icon
            name="logos:github-icon"
            class="mr-1 size-5" />
        </Button>
      </a>
    </div>

    <div class="flex flex-row justify-center gap-2 mt-4 items-centre">
      <div>Already have an account?</div>
      <NuxtLink
        to="/login"
        class="cursor-pointer text-neutral-800 hover:underline">
        Log in
      </NuxtLink>
    </div>
  </div>
</template>
