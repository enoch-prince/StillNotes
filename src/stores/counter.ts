import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { RouteLocationNormalized } from 'vue-router'
import type { INote, Scripture } from '@/custom_types'
import { useLocalStorage } from '@vueuse/core'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})

export const useOnboardingStore = defineStore('onboard', () => {
  const step = ref(0)
  const complete = computed(() => (step.value >= 4 ? true : false))
  function nextStep() {
    if (step.value >= 4) step.value = 4
    else step.value++
  }
  function prevStep() {
    if (step.value <= 0) step.value = 0
    else step.value--
  }

  return { step, complete, nextStep, prevStep }
})

export const useDateStore = defineStore('dateStore', {
  state: () => ({
    today: new Date(),
    selectedDate: new Date(),
  }),
  actions: {
    selectDate(date: Date) {
      this.selectedDate = date
    },
  },
})

export const useReminderStore = defineStore('reminder', () => {
  const remindMe = ref(false)

  const reminderEnabled = computed(() => remindMe.value)

  const unsetReminder = () => {
    remindMe.value = false
  }

  return { remindMe, reminderEnabled, unsetReminder }
})

export const useQuestionaireStore = defineStore('questionaire', () => {
  const state = ref(false)

  const completed = computed(() => state.value)

  return { state, completed }
})

export const useNavigationStore = defineStore('navigation', {
  state: () => ({
    previousRoute: null as RouteLocationNormalized | null,
  }),
  actions: {
    setPrevious(route: RouteLocationNormalized) {
      this.previousRoute = route
    },
  },
})

export const useSetReminderStore = defineStore('set-reminder', () => {
  const selectedHour = ref(8)
  const selectedMinute = ref(30)
  const selectedPeriod = ref('AM')
  const repeatDays = ref<Number[]>([0, 1, 2, 3, 4])
  const vibrate = ref(true)
  const ringtone = ref('Default')

  function toggleDay(day: Number) {
    if (repeatDays.value.includes(day)) {
      repeatDays.value = repeatDays.value.filter((d) => d !== day)
    } else {
      repeatDays.value.push(day)
    }
  }

  function toggleVibrate() {
    vibrate.value = !vibrate.value
  }

  function setRingtone(name: string) {
    ringtone.value = name
  }

  return {
    selectedHour,
    selectedMinute,
    selectedPeriod,
    repeatDays,
    vibrate,
    ringtone,
    toggleDay,
    toggleVibrate,
    setRingtone,
  }
})

export const useNoteDraftStore = defineStore('noteDraft', {
  state: () => ({
    title: '',
    content: '',
    color: '',
    font: 'default',
    scripture: [{}],
  }),
  actions: {
    saveDraft(draft: INote) {
      this.title = draft.title
      this.content = draft.content
      this.color = draft.color
      this.font = draft.font
      this.scripture = draft.scripture
    },
    updateDraft(draft: Partial<INote>) {
      Object.assign(this, draft)
    },
    resetDraft() {
      this.title = ''
      this.content = ''
      this.color = '#d1c7ff'
      this.font = 'default'
    },
  },
})

export const useSavedNotesStore = defineStore('savedNotes', () => {
  const notes = useLocalStorage('notes', [{} as INote], { mergeDefaults: true })

  const addToNotes = (note: INote) => {
    notes.value.push(note)
  }

  const removeFromNotes = (noteId: string) => {
    const indexToRemove = notes.value.findIndex((note) => note.id === noteId)

    if (indexToRemove !== -1) {
      notes.value.splice(indexToRemove, 1)
    }
    notes.value.splice(indexToRemove, 1)
  }

  return { notes, addToNotes, removeFromNotes }
})
