<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps({
  error: Object as () => NuxtError,
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <section class="flex flex-col items-center justify-center min-h-screen bg-white">
    <div class="max-w-screen-xl px-4 py-8 mx-auto lg:py-16 lg:px-6">
      <div class="max-w-screen-sm mx-auto text-center text-balance">
        <h1
          class="mb-4 font-extrabold tracking-tight text-7xl lg:text-9xl text-primary-600 d">
          {{ error?.statusCode ? error.statusCode : '404' }}
        </h1>
        <p class="mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
          {{ error?.name ? error.name : "Something's missing." }}
        </p>
        <p class="mb-4 text-lg font-light text-gray-500">
          {{
            error?.message
              ? error.message
              : "Sorry, we can't find that page. You'll find lots to explore on the home page."
          }}
        </p>
        <button
          @click="handleError"
          class="inline-flex text-white bg-primary hover:bg-primary/70 focus:ring-4 focus:outline-none focus:ring-primary/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center my-4">
          Back to Homepage
        </button>
      </div>
    </div>
  </section>
</template>
