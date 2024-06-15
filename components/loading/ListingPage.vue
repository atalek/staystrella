<script setup lang="ts"></script>
<template>
  <template>
    <section class="animate-pulse">
      <Container>
        <div class="max-w-screen-lg mx-auto">
          <div class="flex flex-col gap-6">
            <div class="flex flex-col gap-y-3">
              <div class="w-64 h-7 bg-slate-400 rounded-xl"></div>
              <div class="w-48 h-6 bg-slate-400 rounded-xl"></div>
              <div
                class="bg-slate-600 w-full h-[60vh] overflow-hidden rounded-xl relative">
                <div class="absolute top-5 right-5">
                  <Icon
                    name="material-symbols:favorite-outline"
                    class="size-10 text-slate-200 absolute -top-[2px] -right-[2px]" />
                </div>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-4">
              <div class="col-span-4 flex flex-col gap-8">
                <div class="flex flex-col gap2">
                  <div class="flex flex-row items-center gap-4 my-2">
                    <span class="w-20 h-5 bg-slate-400 rounded-xl"></span>
                    <span class="w-20 h-5 bg-slate-400 rounded-xl"></span>
                    <span class="size-10 bg-slate-400 rounded-full"></span>
                  </div>
                  <div class="flex flex-row items-center gap-4">
                    <span class="w-20 h-5 bg-slate-400 rounded-xl"></span>
                    <span class="w-20 h-5 bg-slate-400 rounded-xl"></span>
                    <span class="w-20 h-5 bg-slate-400 rounded-xl"></span>
                  </div>
                </div>

                <hr />

                <div class="flex flex-col gap-6 py-4">
                  <div class="flex flex-row items-center gap-4">
                    <span class="size-12 bg-slate-400 rounded-full"></span>
                    <div class="flex flex-col gap-y-2">
                      <span class="h-6 w-12 bg-slate-400 rounded-xl"></span>
                      <span class="h-6 w-56 bg-slate-400 rounded-xl"></span>
                    </div>
                  </div>
                </div>
                <hr />

                <span class="h-6 w-56 bg-slate-400 rounded-xl"></span>

                <hr />
                <div
                  class="bg-slate-400 w-full h-[40vh] order-first mb-10 md:order-last md:col-span-3"></div>
              </div>
              <div class="order-first mb-10 md:order-last md:col-span-3">
                <section
                  class="bg-white rounded-xl border-2 border-neutral-200 overflow-hidden flex flex-col">
                  <div class="flex flex-row items-center gap-1 p-4 justify-between">
                    <span class="w-24 h-8 bg-slate-400 rounded-xl"></span>
                    <span class="w-12 h-5 bg-slate-400 rounded-xl"></span>
                  </div>
                  <hr />

                  <span class="w-4/6 h-72 bg-slate-400 rounded-xl p-4 mx-auto my-4">
                  </span>

                  <hr />
                  <div class="p-4 flex flex-row items-center justify-between mb-4">
                    <span class="w-14 h-6 bg-slate-400 rounded-xl"></span>
                    <span class="w-14 h-6 bg-slate-400 rounded-xl"></span>
                  </div>
                  <span
                    class="h-12 w-[85%] mx-auto bg-slate-400 rounded-xl mt-auto my-4"></span>
                </section>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  </template>
</template>
