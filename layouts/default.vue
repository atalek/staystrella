<script lang="ts" setup></script>

<template>
  <div class="flex flex-col min-h-screen">
    <Navbar />
    <main class="flex-1 pt-12 pb-20">
      <slot />
    </main>
    <Footer />
  </div>
</template>
