import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

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