<script setup lang="ts"></script>
<template>
  <div class="col-span-1 cursor-pointer group animate-pulse">
    <div class="flex flex-col gap-2 w-full">
      <div class="aspect-square w-full relative overflow-hidden rounded-xl bg-slate-300">
        <div class="absolute top-3 right-3">
          <Icon
            name="material-symbols:favorite-outline"
            class="size-10 text-slate-200 absolute -top-[2px] -right-[2px]" />
        </div>
      </div>
      <span class="h-6 max-w-48 bg-slate-300 rounded-xl"></span>
      <span class="h-5 max-w-16 bg-slate-300 rounded-xl"></span>
      <span class="h-6 max-w-32 bg-slate-300 rounded-xl"></span>
    </div>
  </div>
</template>
