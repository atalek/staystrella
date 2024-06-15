<script setup lang="ts">
import { useToast } from 'vue-toastification'
import { UpdateUserInfoSchema, UpdatePasswordSchema } from '~/zod-schemas/profile-schema'

const toast = useToast()
const { data, refresh } = await useFetch('/api/v1/profile')

const userInfo = reactive({
  id: data?.value?.id || '',
  name: data?.value?.name || '',
  email: data?.value?.email || '',
  provider: data?.value?.provider || '',
  emailVerified: data?.value?.emailVerified,
})

const errors = reactive<{ [key: string]: string }>({
  name: '',
  email: '',
  profileInfo: '',
  password: '',
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: '',
})

const isLoading = ref(false)

async function updateProfile() {
  Object.keys(errors).forEach(key => (errors[key] = ''))

  const result = UpdateUserInfoSchema.safeParse({
    name: userInfo.name,
    email: userInfo.email,
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
      body: userInfo,
    })
    if (res?.statusCode === 201) {
      toast.success('Profile info updated')
      refresh()
    }
  } catch (err: any) {
    console.error(err.data.message)
    errors.profileInfo = err.data.message
  } finally {
    isLoading.value = false
  }
}

const passwordInfo = reactive({
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: '',
})

async function updatePassword() {
  Object.keys(errors).forEach(key => (errors[key] = ''))

  const result = UpdatePasswordSchema.safeParse({
    currentPassword: passwordInfo.currentPassword,
    newPassword: passwordInfo.newPassword,
    confirmNewPassword: passwordInfo.confirmNewPassword,
  })

  if (!result.success) {
    result.error.errors.forEach(error => {
      errors[error.path[0]] = error.message
    })
    return
  }
  try {
    isLoading.value = true
    const res = await $fetch('/api/v1/profile', { method: 'PUT', body: passwordInfo })
    if (res?.statusCode === 201) {
      toast.success('Password updated')
    }
  } catch (err: any) {
    console.error(err.data.message)
    errors.password = err.data.message
  } finally {
    isLoading.value = false
  }
}

async function deleteAccount() {
  try {
    isLoading.value = true
    const res = $fetch('/api/v1/profile', { method: 'DELETE' })
    if (!!res) {
      window.location.reload()
      await navigateTo('/')
    }
  } catch (err: any) {
    toast.error(err.data.message)
  } finally {
    isLoading.value = false
  }
}

const verificationLinkSent = ref(false)

async function resendVerificationEmail() {
  try {
    isLoading.value = true
    const res = await $fetch('/api/v1/auth/request-verification', { method: 'POST' })
    if (!!res) {
      verificationLinkSent.value = true
    }
  } catch (error: any) {
    toast.error(error.data.message)
    errors.profileInfo = error.data.message
  } finally {
    isLoading.value = false
  }
}

useSeoMeta({
  title: 'Edit Account Info',
})
</script>

<template>
  <EditContainer>
    <EditFormContainer>
      <Heading
        title="Profile Information"
        subTitle=" Update your account's profile information" />
      <section>
        <form
          class="max-w-2xl mt-6 space-y-6"
          @submit.prevent="updateProfile">
          <div>
            <Input
              id="name"
              label="Name"
              type="text"
              class="block w-full mt-1"
              v-model="userInfo.name"
              :disabled="isLoading"
              :error="errors.name" />
          </div>

          <div>
            <Input
              id="email"
              type="Email"
              label="Email"
              class="block w-full mt-1"
              v-model="userInfo.email"
              :disabled="isLoading"
              :error="errors.email || errors.profileInfo" />
          </div>
          <div>
            <Input
              id="provider"
              type="text"
              label="Provider"
              class="block w-full mt-1"
              v-model="userInfo.provider"
              :disabled="true" />
          </div>
          <p v-if="data?.email && data?.emailVerified === null">
            Your email address is unverified.
            <button
              @click="resendVerificationEmail"
              type="button"
              class="font-semibold underline text-slate-600 hover:text-slate-400">
              Click here to re-send the verification email
            </button>
          </p>

          <p
            v-show="verificationLinkSent"
            class="text-sm font-semibold text-green-600">
            A new verification link has been sent to your email address.
          </p>
          <Button
            class="w-full md:max-w-40"
            label="Save"
            type="submit"
            :disabled="isLoading"
            outline />
        </form>
      </section>
    </EditFormContainer>
    <EditFormContainer>
      <Heading
        title="Update Password"
        subTitle="Ensure your account is using a long, random password to stay secure. " />
      <section>
        <form
          class="max-w-2xl mt-6 space-y-6"
          @submit.prevent="updatePassword">
          <div>
            <Input
              id="current-password"
              label="Current
              Password"
              type="password"
              class="block w-full mt-1"
              v-model="passwordInfo.currentPassword"
              :error="errors.currentPassword || errors.password"
              :disabled="isLoading || userInfo.provider !== 'email'" />
          </div>
          <div>
            <Input
              id="new-password"
              type="password"
              label="New Password"
              class="block w-full mt-1"
              v-model="passwordInfo.newPassword"
              :error="errors.newPassword"
              :disabled="isLoading || userInfo.provider !== 'email'" />
          </div>
          <div>
            <Input
              id="confirm-new-password"
              type="password"
              label="Confirm New Password"
              class="block w-full mt-1"
              v-model="passwordInfo.confirmNewPassword"
              :error="errors.confirmNewPassword"
              :disabled="isLoading || userInfo.provider !== 'email'" />
          </div>

          <Button
            class="w-full md:max-w-40"
            label="Save"
            type="submit"
            :disabled="isLoading || userInfo.provider !== 'email'"
            outline />
        </form>
      </section>
    </EditFormContainer>
    <EditFormContainer>
      <div class="mt-6 space-y-6 max-2w-xl">
        <Heading
          danger
          title="Delete Account"
          subTitle="Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting your account, please download any data or information that you wish to retain.  " />

        <ClientOnly>
          <DeleteModal
            title="Are you sure you want to delete your account?"
            subTitle="All your listings, reservations and trips will be deleted permanently! This action is irreversible!"
            buttonLabel="Delete Account"
            @deleteConfirmed="deleteAccount" />
        </ClientOnly>
      </div>
    </EditFormContainer>
  </EditContainer>
</template>
