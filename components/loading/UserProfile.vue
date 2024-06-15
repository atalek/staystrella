<script setup lang="ts"></script>
<template>
  <section class="flex flex-col md:flex-row animate-pulse">
    <div class="md:max-w-[320px] w-full">
      <div class="md:max-w-sm w-full max-h-[280px] border-2 rounded-xl p-4 shrink-0">
        <div class="flex flex-col items-center justify-center my-4 gap-y-4">
          <span class="rounded-full bg-slate-200 size-36"></span>
          <LoadingHeading />
        </div>
      </div>
    </div>
    <div class="flex-grow p-6 md:p-10">
      <LoadingHeading />
      <div class="md:max-w-[65%] flex flex-col gap-y-2 mb-10">
        <span class="block w-full h-5 bg-slate-200 rounded-xl"></span>
        <span class="block w-full h-5 bg-slate-200 rounded-xl"></span>
        <span class="block w-full h-5 bg-slate-200 rounded-xl"></span>
      </div>
      <hr />
      <LoadingHeading />
      <LoadingListingCards :cards="5" />
    </div>
  </section>
</template>
