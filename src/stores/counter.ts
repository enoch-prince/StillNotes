import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})

export const useOnboardingStore = defineStore('onboard', () => {
  const step = ref(0);
  const complete = computed(() => step.value > 3 ? true:false);
  function incrementStep() {
    step.value++;
  }

  return { step, complete, incrementStep };
})
