<script setup lang="ts">
import { TransitionRoot, TransitionChild, Dialog, DialogPanel } from '@headlessui/vue'

type DeleteModalProps = {
  title: string
  subTitle: string
  buttonLabel: string
}

defineProps<DeleteModalProps>()

const isOpen = ref(false)

function closeModal() {
  isOpen.value = false
}
function openModal() {
  isOpen.value = true
}
const emit = defineEmits()

function deleteAccount() {
  emit('deleteConfirmed')
  closeModal()
}
</script>
<template>
  <div class="flex">
    <Button
      danger
      @click="openModal"
      class="md:max-w-40"
      :label="buttonLabel" />
  </div>
  <TransitionRoot
    appear
    :show="isOpen"
    as="template">
    <Dialog
      as="div"
      @close="closeModal"
      class="relative z-10">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex items-center justify-center min-h-full p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95">
            <DialogPanel
              class="w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <Heading
                danger
                class="flex flex-col gap-y-4"
                :title
                :subTitle />

              <div class="flex flex-col gap-4 mt-8 md:flex-row">
                <Button
                  @click="closeModal"
                  label="Cancel"
                  outline />
                <Button
                  danger
                  label="Yes I am sure"
                  @click="deleteAccount" />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
