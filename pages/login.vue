<script setup lang="ts">
import { useToast } from 'vue-toastification'
import { LoginSchema } from '~/zod-schemas/auth-schemas'

const isLoading = ref(false)
const errors = reactive<{ [key: string]: string }>({ email: '', password: '', err: '' })

const toast = useToast()

const loginData = reactive({
  email: '',
  password: '',
})

async function login() {
  Object.keys(errors).forEach(key => (errors[key] = ''))

  const result = LoginSchema.safeParse(loginData)
  if (!result.success) {
    result.error.errors.forEach(error => {
      errors[error.path[0]] = error.message
    })
    return
  }
  isLoading.value = true

  try {
    const res = await $fetch('/api/v1/auth/login', {
      method: 'POST',
      body: loginData,
    })
    if (res) {
      toast.success('Logged in')
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
  title: 'Login',
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
        subTitle="Log in to your account" />

      <form
        @submit.prevent="login"
        class="flex flex-col gap-4">
        <Input
          v-model="loginData.email"
          id="email"
          label="Email"
          type="email"
          :disabled="isLoading"
          required
          :error="errors.email" />
        <Input
          v-model="loginData.password"
          id="password"
          label="Password"
          type="password"
          :disabled="isLoading"
          required
          :error="errors.password" />
        <p
          class="text-sm text-rose-500"
          v-if="errors.err">
          {{ errors.err }}
        </p>
        <NuxtLink
          to="/reset-password"
          class="ml-auto font-semibold text-slate-600 hover:text-slate-400"
          >Forgot password?</NuxtLink
        >
        <Button
          type="submit"
          label="Log in ">
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
      <div>Don't have an account?</div>
      <NuxtLink
        to="/register"
        class="cursor-pointer text-neutral-800 hover:underline">
        Register
      </NuxtLink>
    </div>
  </div>
</template>
