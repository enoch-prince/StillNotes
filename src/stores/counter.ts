import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import type { RouteLocationNormalized } from 'vue-router'
import type { BibleBook, INote, IRecent, Scripture } from '@/utils/custom_types'
import { generateId } from '@/utils/utils'
import { useDatabaseStore } from './db'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const isReady = ref(false)
  const dbStore = useDatabaseStore()

  const loadAuth = async () => {
    if (!dbStore.isReady) return
    const authData = await dbStore.execute((db) => db.find('auth'))
    if (authData.length > 0) {
      // @ts-ignore
      isAuthenticated.value = !!authData[0].isAuthenticated
    }
    isReady.value = true
  }

  const setAuthenticated = async (value: boolean) => {
    isAuthenticated.value = value
    await dbStore.execute((db) => db.update('auth', 'session', { _id: 'session', isAuthenticated: value }).catch(() => db.insert('auth', { _id: 'session', isAuthenticated: value })))
  }

  watch(() => dbStore.isReady, (ready) => {
    if (ready) loadAuth()
  }, { immediate: true })

  return { isAuthenticated, setAuthenticated, loadAuth, isReady }
})

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
  const remindMe = ref(true) // remind me to set a reminderToWriteNote

  const reminderToWriteNoteEnabled = ref(false)

  const unsetReminder = () => {
    reminderToWriteNoteEnabled.value = false
  }

  return { remindMe, reminderToWriteNoteEnabled, unsetReminder }
})

export const useQuestionaireStore = defineStore('questionaire', () => {
  const state = ref(false)
  const lastSkippedAt = ref(0)
  const dbStore = useDatabaseStore()

  const loadState = async () => {
    if (!dbStore.isReady) return
    const data = await dbStore.execute((db) => db.find('questionaire'))
    if (data.length > 0) {
      // @ts-ignore
      state.value = !!data[0].completed
      // @ts-ignore
      lastSkippedAt.value = data[0].lastSkippedAt || 0
    }
  }

  watch(() => dbStore.isReady, (ready) => {
    if (ready) loadState()
  }, { immediate: true })

  const setCompleted = async (value: boolean) => {
    state.value = value
    await dbStore.execute((db) => db.update('questionaire', 'status', { _id: 'status', completed: value, lastSkippedAt: lastSkippedAt.value }).catch(() => db.insert('questionaire', { _id: 'status', completed: value, lastSkippedAt: lastSkippedAt.value })))
  }

  const setSkipped = async () => {
    const timestamp = Date.now()
    lastSkippedAt.value = timestamp
    await dbStore.execute((db) => db.update('questionaire', 'status', { _id: 'status', completed: state.value, lastSkippedAt: timestamp }).catch(() => db.insert('questionaire', { _id: 'status', completed: state.value, lastSkippedAt: timestamp })))
  }

  const completed = computed(() => state.value)

  return { state, completed, lastSkippedAt, setCompleted, setSkipped }
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

export const useNoteDraftStore = defineStore('noteDraft', () => {
  const dbStore = useDatabaseStore()

  // Track the current active draft
  const id = ref(`draft-${Date.now()}`)
  const title = ref('')
  const content = ref('')
  const color = ref('#d1c7ff')
  const font = ref('default')
  const scripture = ref<Scripture[]>([])
  const tags = ref<string[]>([])
  const isPublic = ref(false) // Note: renamed 'public' avoids reserved keyword issues internally
  const timestamp = ref(Date.now())

  // Keep a catalog of all drafts
  const allDrafts = ref<INote[]>([])

  const loadDrafts = async () => {
    if (!dbStore.isReady) return;
    const dbDrafts = await dbStore.execute((db) => db.find('drafts'))
    allDrafts.value = (dbDrafts as unknown as INote[]).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
  }

  watch(() => dbStore.isReady, (ready) => {
    if (ready && dbStore.db) {
      loadDrafts();
      dbStore.db.onChange((op) => {
        if (op.collection === 'drafts') {
          loadDrafts();
        }
      });
    }
  }, { immediate: true })

  // Construct a single Draft payload
  const currentDraftPayload = computed<INote>(() => ({
    id: id.value,
    title: title.value,
    content: content.value,
    color: color.value,
    font: font.value,
    scripture: scripture.value,
    tags: tags.value,
    public: isPublic.value,
    timestamp: timestamp.value,
  }))

  const saveDraft = async (draft: INote) => {
    id.value = draft.id || `draft-${Date.now()}`
    title.value = draft.title
    content.value = draft.content
    color.value = draft.color
    font.value = draft.font
    scripture.value = draft.scripture
    tags.value = draft.tags
    isPublic.value = draft.public || false
    timestamp.value = draft.timestamp || Date.now()

    await dbStore.execute((db) => db.insert('drafts', { ...draft, _id: draft.id }))
  }

  const updateDraft = async (updates: Partial<INote>) => {
    timestamp.value = Date.now()
    if (updates.title !== undefined) title.value = updates.title
    if (updates.content !== undefined) content.value = updates.content
    if (updates.color !== undefined) color.value = updates.color
    if (updates.font !== undefined) font.value = updates.font
    if (updates.scripture !== undefined) scripture.value = updates.scripture
    if (updates.tags !== undefined) tags.value = updates.tags
    if (updates.public !== undefined) isPublic.value = updates.public

    const payload = { ...currentDraftPayload.value, _id: id.value }

    // We can use insert for overriding drafts since wa-sqlite handles generic upserts gracefully.
    await dbStore.execute((db) => db.update('drafts', id.value, payload).catch(() => db.insert('drafts', payload)))
  }

  const resetDraft = () => {
    id.value = `draft-${Date.now()}` // Generate new ID for next draft
    title.value = ''
    content.value = ''
    color.value = '#d1c7ff'
    font.value = 'default'
    scripture.value = []
    tags.value = []
    timestamp.value = Date.now()
    isPublic.value = false
  }

  // To preserve backwards-compatibility with views accessing `noteDraftStore.$state` directly
  // we expose `$state` returning the current active draft payload
  const $state = currentDraftPayload

  return {
    id, title, content, color, font, scripture, tags, isPublic, timestamp,
    allDrafts, loadDrafts, saveDraft, updateDraft, resetDraft, $state
  }
})

export const useSavedNotesStore = defineStore('savedNotes', () => {
  const notes = ref<INote[]>([])
  const dbStore = useDatabaseStore()

  const isEmpty = computed(() => notes.value.length === 0)

  // Load notes initially and subscribe to updates
  const loadNotes = async () => {
    if (!dbStore.isReady) return;
    const dbNotes = await dbStore.execute((db) => db.find('notes'))
    
    // Map LocalFirstDB document shape to INote if needed, though they should match if inserted identically
    notes.value = dbNotes as unknown as INote[]
  }

  // Set up subscription once the database is ready
  watch(() => dbStore.isReady, (ready) => {
    if (ready && dbStore.db) {
      loadNotes();
      dbStore.db.onChange((op) => {
        if (op.collection === 'notes') {
          loadNotes();
        }
      });
    }
  }, { immediate: true })

  // FixBug: Runtime error when no scripture is selected for a note
  const addToNotes = async (note: INote) => {
    if (!note.id || note.id.startsWith('draft-')) {
        note.id = generateId(
          `${note.title} ${note.scripture[0]?.book || 'NoBook'}`,
          note.scripture[0]?.chapter || 0,
          note.scripture[0]?.verse || 0,
        )
    }
    
    const payload = { ...note, _id: note.id }
    // Upsert logic
    await dbStore.execute((db) => db.update('notes', note.id!, payload).catch(() => db.insert('notes', payload)))
    
    // Refresh local state if not already caught by subscription
    await loadNotes()
  }

  const removeFromNotes = async (noteId: string) => {
    const indexToRemove = notes.value.findIndex((note) => note.id === noteId)

    if (indexToRemove !== -1) {
      notes.value.splice(indexToRemove, 1) // Optimistic remove
      await dbStore.execute((db) => db.delete('notes', noteId))
    }
  }

  return { notes, isEmpty, addToNotes, removeFromNotes, loadNotes }
})

export const useRecentScriptureStore = defineStore('recentScripture', () => {
  const numOfItemsToReturn = 6
  const numOfDays = 15
  const recentScripture = ref<IRecent[]>([])
  const dbStore = useDatabaseStore()

  const loadScripture = async () => {
    if (!dbStore.isReady) return;
    const dbItems = await dbStore.execute((db) => db.find('recent_scriptures'))
    recentScripture.value = (dbItems as unknown as IRecent[]).sort((a, b) => b.timestamp - a.timestamp)
  }

  watch(() => dbStore.isReady, (ready) => {
    if (ready && dbStore.db) {
      loadScripture();
      dbStore.db.onChange((op) => {
        if (op.collection === 'recent_scriptures') {
          loadScripture();
        }
      });
    }
  }, { immediate: true })

  const addToRecent = async (recent: IRecent) => {
    const indexToRemove = recentScripture.value.findIndex((scripture) => scripture.id === recent.id)

    if (indexToRemove === -1) {
      recentScripture.value.unshift(recent) // Optimistic
      await dbStore.execute((db) => db.insert('recent_scriptures', { ...recent, _id: recent.id }))
      await removeOldItems()
    } else {
      console.log(`${recent.label} already added to recent`)
    }
  }

  const dateThreshold = computed(() => {
    const threshold = new Date()
    const today = new Date()

    return threshold.setDate(today.getDate() - numOfDays)
  })

  const removeOldItems = async () => {
    const oldItems = recentScripture.value.filter(
      (item) => item.timestamp < dateThreshold.value,
    )
    
    // Remove local
    recentScripture.value = recentScripture.value.filter(
      (item) => item.timestamp >= dateThreshold.value,
    )

    // Remove from DB
    if (oldItems.length > 0) {
      await dbStore.execute(async (db) => {
        for (const item of oldItems) {
          if (item.id) await db.delete('recent_scriptures', item.id)
        }
      })
    }
  }

  const getNMostRecent = computed(() => {
    if (recentScripture.value.length > numOfItemsToReturn) {
      return recentScripture.value.slice(0, numOfItemsToReturn)
    } else {
      return recentScripture.value
    }
  })

  return { recentScripture, getNMostRecent, addToRecent, removeOldItems, loadScripture }
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
    period.value = period.value === 'AM' ? 'PM' : 'AM'
  }

  const resetNoteReminder = () => {
    hour.value = 0
    minute.value = 0
    period.value = 'PM'
  }

  return { dateToday, hour, minute, period, togglePeriod, resetNoteReminder }
})

export const useGlobalStatesStore = defineStore('globalStates', () => {
  const addVerseClicked = ref(false)
  const tagNoteClicked = ref(false)
  const showAddNoteSettings = ref(false)

  return { addVerseClicked, tagNoteClicked, showAddNoteSettings }
})

export const useRecentTagsStore = defineStore('recentTags', () => {
  const numOfItemsToReturn = 15
  const numOfDays = 15
  const recentTags = ref<IRecent[]>([])
  const dbStore = useDatabaseStore()

  const loadTags = async () => {
    if (!dbStore.isReady) return;
    const dbItems = await dbStore.execute((db) => db.find('recent_tags'))
    recentTags.value = (dbItems as unknown as IRecent[]).sort((a, b) => b.timestamp - a.timestamp)
  }

  watch(() => dbStore.isReady, (ready) => {
    if (ready && dbStore.db) {
      loadTags();
      dbStore.db.onChange((op) => {
        if (op.collection === 'recent_tags') {
          loadTags();
        }
      });
    }
  }, { immediate: true })

  const addToRecent = async (recent: IRecent) => {
    const indexToRemove = recentTags.value.findIndex((tag) => tag.id === recent.id)

    if (indexToRemove === -1) {
      recentTags.value.unshift(recent)
      await dbStore.execute((db) => db.insert('recent_tags', { ...recent, _id: recent.id }))
      await removeOldItems()
    } else {
      console.log(`${recent.label} already added to recent`)
    }
  }

  const dateThreshold = computed(() => {
    const threshold = new Date()
    const today = new Date()

    return threshold.setDate(today.getDate() - numOfDays)
  })

  const removeOldItems = async () => {
    const oldItems = recentTags.value.filter((item) => item.timestamp < dateThreshold.value)
    recentTags.value = recentTags.value.filter((item) => item.timestamp >= dateThreshold.value)

    if (oldItems.length > 0) {
      await dbStore.execute(async (db) => {
        for (const item of oldItems) {
          if (item.id) await db.delete('recent_tags', item.id)
        }
      })
    }
  }

  const getNMostRecent = computed(() => {
    if (recentTags.value.length > numOfItemsToReturn) {
      return recentTags.value.slice(0, numOfItemsToReturn)
    } else {
      return recentTags.value
    }
  })

  return { recentTags, getNMostRecent, addToRecent, removeOldItems, loadTags }
})
