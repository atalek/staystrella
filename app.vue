<script setup lang="ts">
useSeoMeta({
  titleTemplate: titleChunk => {
    return titleChunk
      ? `${titleChunk} | Staystrella`
      : 'Staystrella - Your Ultimate Vacation Rental Experience'
  },
  charset: 'utf-8',
  viewport: 'width=device-width, initial-scale=1.0',
  description:
    'Discover your ultimate vacation rental experience with Staystrella. Find stunning accommodations, seamless user experiences, and high-quality, performance-driven solutions for your next getaway.',
  keywords:
    'vacation rental, accommodation, travel, holiday, getaway, rental property, rental home',
  author: 'Aleksandar Atanasovski',
  ogType: 'website',
  ogSiteName: 'Staystrella',
  ogUrl: 'https://www.staystrella.atalek.com/',
  ogTitle: 'Staystrella - Your Ultimate Vacation Rental Experience',
  ogDescription:
    'Discover your ultimate vacation rental experience with Staystrella. Find stunning accommodations, seamless user experiences, and high-quality, performance-driven solutions for your next getaway.',
  ogImage:
    'https://res.cloudinary.com/dkofkuquf/image/upload/v1696861373/nuxtshop/milpepaqvyylyl9yk9vm.png',
  twitterCard: 'summary_large_image',
  twitterImage:
    'https://res.cloudinary.com/dkofkuquf/image/upload/v1696861373/nuxtshop/milpepaqvyylyl9yk9vm.png',
  twitterTitle: 'Staystrella - Your Ultimate Vacation Rental Experience',
  twitterDescription:
    'Discover your ultimate vacation rental experience with Staystrella. Find stunning accommodations, seamless user experiences, and high-quality, performance-driven solutions for your next getaway.',
})
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtLoadingIndicator />
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
html,
body,
:root {
  font-family: Cereal, sans-serif;
}
</style>
