<script lang="ts" setup>
import { routes } from '~/data/constants'

const isOpen = ref(false)

const user = useUser()

function logout() {
  $fetch('/api/v1/auth/logout', { method: 'POST' })
    .then(() => reloadNuxtApp())
    .catch(error => console.error(error))
}

function handleClickOutside(event: Event) {
  const menu = document.querySelector('.menu-dropdown')
  if (menu && !menu.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="block ml-auto">
    <div class="relative flex flex-row items-center justify-end gap-3">
      <NuxtLink
        to="/create-listing"
        class="hidden px-4 py-3 text-sm font-semibold transition rounded-full cursor-pointer lg:inline-block hover:bg-neutral-100">
        Host with Staystrella
      </NuxtLink>

      <div class="relative inline-block text-left shrink-0 menu-dropdown">
        <div>
          <button
            @click="isOpen = !isOpen"
            aria-label="mobile hamburger menu"
            class="flex flex-row items-center gap-3 p-4 transition border-2 rounded-full cursor-pointer md:py-1 md:px-2 border-neutral-200 hover:shadow-md">
            <Icon
              name="heroicons-solid:menu"
              class="size-5" />
            <div class="hidden md:block">
              <Avatar :src="user?.image" />
            </div>
          </button>
        </div>

        <transition
          enter-active-class="transition duration-100 ease-out"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition duration-75 ease-in"
          leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0">
          <div
            v-if="isOpen"
            @click="isOpen = false"
            class="absolute right-0 z-50 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black/5 focus:outline-none">
            <div class="px-1 py-1">
              <div v-if="!user">
                <MenuItem
                  label="Login"
                  icon="material-symbols-light:login-sharp"
                  href="/login" />
                <MenuItem
                  label="Sign Up"
                  icon="material-symbols-light:app-registration-outline-sharp"
                  href="/register" />
              </div>

              <div v-if="!!user">
                <div>
                  <NuxtLink
                    :to="`/users/${user.id}`"
                    class="flex items-center w-full px-3 py-4 overflow-hidden text-sm text-gray-900 rounded-md hover:bg-primary hover:text-white group">
                    <div>
                      {{ user.name }} <br />
                      View your profile
                    </div>
                  </NuxtLink>
                </div>
                <hr />
                <MenuItem
                  v-for="route in routes"
                  :key="route.label"
                  :href="route.href"
                  :icon="route.icon"
                  :label="route.label" />

                <hr />
                <MenuItem
                  class="cursor-pointer"
                  @click="logout"
                  big
                  icon="material-symbols-light:logout-sharp"
                  label="Logout" />
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>
