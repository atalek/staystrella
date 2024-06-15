<script setup lang="ts">
import { DatePicker } from 'v-calendar'
import 'v-calendar/style.css'

type CalendarProps = {
  disabledDates?: Date[]
  expanded?: boolean
}
defineProps<CalendarProps>()

const model = defineModel()
</script>
<template>
  <DatePicker
    :expanded
    color="pink"
    :hideTimeHeader="true"
    :disabledDates
    :min-date="new Date()"
    v-model.range="model"
    mode="date" />
</template>
