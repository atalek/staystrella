<script lang="ts" setup>
import type { AuthUser } from '~/types'

type UserInfoProps = {
  user: AuthUser
}

defineProps<UserInfoProps>()
</script>

<template>
  <NuxtLink
    :to="`/users/${user?.id}`"
    class="text-xl font-semibold flex flex-row items-center gap-2">
    Hosted by {{ user?.name }}
    <Avatar :src="user?.image" />
  </NuxtLink>
</template>
