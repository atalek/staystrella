<script lang="ts" setup>
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="w-full py-4 border-t-2 '">
    <NuxtLink
      href="https://github.com/atalek/staystrella"
      target="_blank"
      class="flex items-center justify-center md:text-lg hover:text-primary"
      >© {{ currentYear }} Staystrella - Made by atalek
      <Icon
        name="fa6-brands:github"
        class="ml-2 size-5" />
    </NuxtLink>
  </footer>
</template>
