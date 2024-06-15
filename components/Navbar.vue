<script lang="ts" setup></script>

<template>
  <section class="z-10 w-full bg-white shadow-sm">
    <div class="p-4 border-b-2">
      <Container>
        <nav class="flex items-center justify-between flex-grow gap-3 md:gap-0">
          <NavLogo />
          <NavSearch />
          <NavUserMenu />
        </nav>
      </Container>
    </div>
    <Categories />
  </section>
</template>
