import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { RouteLocationNormalized } from 'vue-router'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++;
  }

  return { count, doubleCount, increment }
})

export const useOnboardingStore = defineStore('onboard', () => {
  const step = ref(0)
  const complete = computed(() => (step.value >= 4 ? true : false))
  function nextStep() {
    if (step.value >= 4) step.value = 4
    else step.value++;
  }
  function prevStep() {
    if (step.value <= 0) step.value = 0
    else step.value--;
  }

  return { step, complete, nextStep, prevStep }
})


export const useDateStore = defineStore('dateStore', {
  state: () => ({
    today: new Date(),
    selectedDate: new Date()
  }),
  actions: {
    selectDate(date: Date) {
      this.selectedDate = date
    }
  }
})

export const useReminderStore = defineStore('reminder', () => {
  const remindMe = ref(false)

  const reminderEnabled = computed(() => remindMe.value)

  const unsetReminder = () => {
    remindMe.value = false
  }

  return {remindMe, reminderEnabled, unsetReminder}
})

export const useQuestionaireStore = defineStore('questionaire', () => {
  const state = ref(false)

  const completed = computed(() => state.value)


  return {state, completed}
})


export const useNavigationStore = defineStore('navigation', {
  state: () => ({
    previousRoute: null as RouteLocationNormalized | null
  }),
  actions: {
    setPrevious(route: RouteLocationNormalized) {
      this.previousRoute = route
    }
  }
})