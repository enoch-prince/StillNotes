import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { RouteLocationNormalized } from 'vue-router'
import type { BibleBook, INote, IRecent, Scripture } from '@/custom_types'
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
  state: () =>
    useLocalStorage<INote>(
      'note-draft',
      {
        title: '',
        content: '',
        color: '',
        font: 'default',
        scripture: [],
      },
      { mergeDefaults: true },
    ),
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
  const notes = useLocalStorage<INote[]>('notes', [], { mergeDefaults: true })

  const addToNotes = (note: INote) => {
    notes.value.push(note)
  }

  const removeFromNotes = (noteId: string) => {
    const indexToRemove = notes.value.findIndex((note) => note.id === noteId)

    if (indexToRemove !== -1) {
      notes.value.splice(indexToRemove, 1)
    }
  }

  return { notes, addToNotes, removeFromNotes }
})

export const useRecentScriptureStore = defineStore('recentScripture', () => {
  const numOfItemsToReturn = 6
  const numOfDays = 15
  const recentScripture = ref<IRecent[]>([])

  const addToRecent = (recent: IRecent) => {
    const indexToRemove = recentScripture.value.findIndex((scripture) => scripture.id === recent.id)

    if (indexToRemove === -1) {
      recentScripture.value.unshift(recent)
    } else {
      console.log(`${recent.label} already added to recent`)
    }
    // recentScripture.value.unshift(recent)
  }

  const dateThreshold = computed(() => {
    const threshold = new Date()
    const today = new Date()

    return threshold.setDate(today.getDate() - numOfDays)
  })

  const removeOldItems = () => {
    recentScripture.value = recentScripture.value.filter((item) => item.timestamp < dateThreshold)
  }

  const getNMostRecent = computed(() => {
    if (recentScripture.value.length > numOfItemsToReturn) {
      return recentScripture.value.slice(numOfItemsToReturn)
    } else {
      return recentScripture.value
    }
  })

  return { recentScripture, getNMostRecent, addToRecent, removeOldItems }
})

export const useSearchedScriptureStore = defineStore('searchedScripture', () => {
  const bibleBook = ref<BibleBook>({ book: null, chapterData: null })

  const set = (searched: BibleBook) => {
    bibleBook.value.book = searched.book
    bibleBook.value.chapterData = searched.chapterData
  }

  return { bibleBook, set }
})


export const useNoteReminderStore = defineStore('noteReminder', () => {
  const dateToday = ref<Date>(new Date())
  const hour = ref<number>(4)
  const minute = ref<number>(5)
  const period = ref<string>('PM')

  const togglePeriod = () => {
    period.value = period.value === 'AM' ? 'PM':'AM'
  }

  const resetNoteReminder = () => {
    hour.value = 0;
    minute.value = 0;
    period.value = 'PM'
  }

  return { dateToday, hour, minute, period, togglePeriod, resetNoteReminder }
})