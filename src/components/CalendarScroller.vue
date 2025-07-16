<!-- <script setup lang="ts">
import { ref } from 'vue'
import { useDateStore } from '@/stores/counter'
import dayjs from 'dayjs'

const dateStore = useDateStore()

// Generate a list of days for the current month
const daysInMonth = ref(() => {
  const date = dateStore.today
  const year = date.getFullYear()
  const month = date.getMonth()
  const days = new Date(year, month + 1, 0).getDate()
  return Array.from({ length: days }, (_, i) => new Date(year, month, i + 1))
})

// Format helpers
const isSelected = (date: Date) =>
  dayjs(date).isSame(dateStore.selectedDate, 'day')

const isToday = (date: Date) =>
  dayjs(date).isSame(dateStore.today, 'day')

const selectDate = (date: Date) => {
  dateStore.selectDate(date)
}
</script>

<template>
  <div class="box has-background-white-ter py-2 px-3 is-flex is-justify-content-center is-rounded mb-4" style="overflow-x: auto; border: 2px solid #e0d1ff;">
    <div class="is-flex is-align-items-center" style="gap: 1rem;">
      <div
        v-for="date in daysInMonth()"
        :key="date.toISOString()"
        class="has-text-weight-medium is-size-6 has-text-dark"
        :class="{
          'tag is-primary is-rounded': isSelected(date),
          'has-text-grey': !isSelected(date),
        }"
        style="cursor: pointer; padding: 0.5rem 0.75rem;"
        @click="selectDate(date)"
      >
        {{ dayjs(date).date() }}
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Smooth scroll for horizontal */
div[style*='overflow-x: auto'] {
  scroll-behavior: smooth;
  white-space: nowrap;
  border-radius: 1.25rem;
}
</style> -->

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import type { VNodeRef } from 'vue'
import { useDateStore } from '@/stores/counter'
import dayjs from 'dayjs'

const dateStore = useDateStore()
const scrollRef = ref<HTMLElement | null>(null)
const selectedRef = ref<HTMLElement | null>(null)

const range = 15 // ±15 days from today
const today = dayjs(dateStore.today)

// Generate days from (today - 15) to (today + 15)
const daysInRange = computed(() => {
  const start = today.subtract(range, 'day')
  return Array.from({ length: range * 2 + 1 }, (_, i) => start.add(i, 'day').toDate())
})

const isSelected = (date: Date) => dayjs(date).isSame(dateStore.selectedDate, 'day')

const isToday = (date: Date) => dayjs(date).isSame(dateStore.today, 'day')

function selectDate(date: Date) {
  dateStore.selectDate(date)
  nextTick(() => scrollToSelected())
}

function scrollToSelected() {
  const container = scrollRef.value
  const selected = selectedRef.value

  if (container && selected) {
    const offset = selected.offsetLeft - container.offsetWidth / 2 + selected.offsetWidth / 2
    container.scrollTo({ left: offset, behavior: 'smooth' })
  }
}


function scrollBy(offset: number) {
  scrollRef.value?.scrollBy({ left: offset, behavior: 'smooth' })
}

onMounted(() => {
  scrollToSelected()
})
</script>

<template>
  <!-- <div
    class="box has-background-white-ter py-2 px-3 is-flex is-align-items-center is-justify-content-center is-rounded mb-4"
    style="border: 2px solid #e0d1ff"
  > -->
  <div
    class="box py-2 px-3 is-flex is-align-items-center is-justify-content-center is-rounded mb-4"
  >
    <!-- Left Arrow -->
    <!-- <button class="button is-white is-small" @click="scrollBy(-100)">
      <font-awesome-icon icon="fa-solid fa-chevron-left" />
    </button> -->

    <!-- Scrollable Day List -->
    <div ref="scrollRef" class="mx-2 is-flex is-align-items-center scroll-container">
      <div
        v-for="date in daysInRange"
        :key="date.toISOString()"
        :ref="
          ((el: HTMLElement | null) => {
            if (isSelected(date)) selectedRef = el
          }) as VNodeRef
        "
        class="has-text-weight-bold is-size-6 has-text-dark is-family-secondary"
        :class="{
          'tag is-primary is-rounded': isSelected(date),
          'has-text-grey': !isSelected(date),
        }"
        style="cursor: pointer; padding: 0.5rem 0.75rem; margin: 0 0.25rem"
        @click="selectDate(date)"
      >
        {{ dayjs(date).date() }}
      </div>
    </div>

    <!-- Right Arrow -->
    <!-- <button class="button is-white is-small" @click="scrollBy(100)">
      <font-awesome-icon icon="fa-solid fa-chevron-right" />
    </button> -->
  </div>
</template>

<style scoped>
.scroll-container {
  overflow-x: auto;
  white-space: nowrap;
  scroll-behavior: smooth;
  flex: 1;
  min-width: 0;
}
</style>
