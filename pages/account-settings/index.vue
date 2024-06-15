<script setup lang="ts">
const user = useUser()

useSeoMeta({
  title: 'Account settings',
})
</script>

<template>
  <section class="h-full max-w-3xl px-4 mx-auto my-6 md:h-auto lg:h-auto md:px-0">
    <Heading
      :title="user?.name!"
      :subTitle="user?.email" />
    <div class="flex flex-col my-8 md:flex-row">
      <NuxtLink
        class="border-2 rounded-xl flex-grow p-4 hover:border-[2px]"
        to="/account-settings/info">
        <Icon
          name="streamline:user-identifier-card-solid"
          class="size-12 text-slate-400" />
        <div class="mt-8 mb-4">
          <Heading
            title="Account Info"
            subTitle="Update your account's information" />
        </div>
      </NuxtLink>
    </div>
    <div class="flex flex-col my-8 md:flex-row">
      <NuxtLink
        class="border-2 rounded-xl flex-grow p-4 hover:border-[2px]"
        to="/account-settings/profile">
        <Icon
          name="mingcute:user-info-fill"
          class="size-12 text-slate-400" />
        <div class="mt-8 mb-4">
          <Heading
            title="Edit Your Profile"
            subTitle="Your Staystrella  profile is an important part of every reservation. Create yours to help other Hosts and guests get to know you" />
        </div>
      </NuxtLink>
    </div>
    <div class="flex flex-col my-8 md:flex-row">
      <NuxtLink
        class="border-2 rounded-xl flex-grow p-4 hover:border-[2px]"
        :to="`/users/${user?.id}`">
        <Icon
          name="material-symbols:account-circle"
          class="size-12 text-slate-400" />
        <div class="mt-8 mb-4">
          <Heading
            title="See Your Profile"
            subTitle="Explore how others view your personal space" />
        </div>
      </NuxtLink>
    </div>
  </section>
</template>
