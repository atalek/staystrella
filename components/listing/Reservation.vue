<script setup lang="ts">
type ListingReservationProps = {
  price?: number
  totalPrice?: number
  disabled: boolean
  disabledDates: Date[]
}
const { disabledDates } = defineProps<ListingReservationProps>()

const model = defineModel<Date[]>()
const emit = defineEmits(['createReservation'])

function createReservation() {
  emit('createReservation')
}
</script>

<template>
  <section
    class="flex flex-col overflow-hidden bg-white border-2 rounded-xl border-neutral-200">
    <div class="flex flex-row items-center justify-between gap-1 p-4">
      <span class="text-2xl font-semibold">${{ price }}</span>
      <span class="font-light text-neutral-600">night</span>
    </div>
    <hr />

    <div class="p-4 mx-auto">
      <Calendar
        v-model="model"
        :disabledDates />
    </div>
    <hr />
    <div class="flex flex-row items-center justify-between p-4 text-lg font-semibold">
      <span>Total</span>
      <span>${{ totalPrice }}</span>
    </div>
    <div class="p-4 mt-auto">
      <Button
        :disabled="disabled"
        label="Reserve"
        @click="createReservation" />
    </div>
  </section>
</template>
