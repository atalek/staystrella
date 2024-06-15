<script setup lang="ts">
type EditContainerProps = {
  href?: string
}
defineProps<EditContainerProps>()
</script>
<template>
  <Container>
    <section class="mx-auto space-y-6 max-w-7xl sm:px-6 lg:px-8">
      <NuxtLink :to="href || '/account-settings'">
        <Button
          class="max-w-32"
          outline
          label="Back" />
      </NuxtLink>
      <slot />
    </section>
  </Container>
</template>
