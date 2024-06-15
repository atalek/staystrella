<script setup lang="ts"></script>
<template>
  <div
    class="flex flex-col w-full gap-4 p-4 border-2 md:flex-row rounded-xl animate-pulse">
    <LoadingImage />
    <div class="flex flex-col flex-grow gap-4">
      <LoadingHeading subTitle />

      <span class="h-5 max-w-48 bg-slate-300 rounded-xl"></span>
      <span class="h-5 max-w-32 bg-slate-300 rounded-xl"></span>
      <span class="h-5 max-w-20 bg-slate-300 rounded-xl"></span>

      <span class="w-full h-8 mt-auto bg-slate-400 rounded-xl md:max-w-sm"></span>
    </div>
  </div>
</template>
