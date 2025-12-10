<script setup lang="ts">
import CalendarScroller from '@/components/CalendarScroller.vue'
import Button from '@/components/Button.vue'
import BottomNavBar from '@/components/BottomNavBar.vue'
import HomeReminderSVG from '@/components/svgs/homeReminderSVG.vue'
import ReminderModal from '@/components/Reminder.vue'
import SlideUpPromptModal from '@/components/SlideUpPromptModal.vue'
import RecentNotes from '@/components/RecentNotes.vue'
import BellIconSVG from '@/components/svgs/bellIconSVG.vue'
import { useNavigationStore, useReminderStore, useSavedNotesStore, useNoteDraftStore } from '@/stores/counter'
import { computed, ref, watch, watchEffect } from 'vue'
import { useRouter } from 'vue-router'

const user = 'Kwame'

const noteDraftStore = useNoteDraftStore()
const reminderStore = useReminderStore()
const navStore = useNavigationStore()
const notesAvailable = computed(() => !useSavedNotesStore().isEmpty)
const previousRoute = computed(() => navStore.previousRoute)
const slideModalActive = ref(true)
const modalActive = computed(() => !reminderStore.reminderToWriteNoteEnabled && reminderStore.remindMe && slideModalActive.value)
const showSetReminder = ref(false)
const router = useRouter()

const modalClasses = computed(() => ({
  'is-active': modalActive.value,
}))

const handleNav = (id: string) => {
  console.log('Navigate to:', id)
}

// floating action buttons
const handleFab = () => {
  console.log('FAB pressed: Open new note')
  noteDraftStore.resetDraft()
  router.push('/note')
}

const handleModalYes = () => {
  reminderStore.reminderToWriteNoteEnabled = true
  showSetReminder.value = true
}

const handleModalNo = () => {
  reminderStore.remindMe = false
}

const handleSaveReminder = () => {
  console.log('Reminder saved!')
  showSetReminder.value = false
  slideModalActive.value = false
}

watch(modalActive, (newValue) => {
  reminderStore.remindMe = newValue
})

watchEffect(() => {
  if (previousRoute.value?.name === 'questionaire') {
    slideModalActive.value = true
  } else {
    if (!reminderStore.reminderToWriteNoteEnabled) {
      slideModalActive.value = true
    }
  }
})
</script>

<template>
  <div class="content">
    <div class="px-4">
      <div 
        class="pt-4 pb-2 mb-2"
        :class="{
          'is-flex is-justify-content-space-between is-align-items-center': notesAvailable
        }">
        <span class="is-size-4 has-text-weight-semibold">👋🏽 Hello {{ user }}!</span>
        <BellIconSVG v-if="notesAvailable"/>
      </div>
      <div class="is-size-6 is-family-secondary has-text-grey">
        <span v-if="!notesAvailable">Just breathe and write ✍️</span>
        <span v-else>You haven’t written since Tuesday. No pressure 😊</span>
      </div>
      <CalendarScroller class="mt-5" />
    </div>
    <div v-if="!notesAvailable" class="section is-flex is-flex-direction-column is-align-items-center pt-2">
      <div class="mb-4">
        <p class="has-text-centered is-size-3 has-text-weight-bold">
          Want to begin your first reflection?
        </p>
      </div>
      <div class="mb-4 px-4 has-text-centered is-size-6 has-text-grey">
        <p class="">
          Every big step starts with a small step. <br />
          Note your first Inspiration and start your journey!
        </p>
      </div>
      <div class="has-width-85">
        <Button color="primary" label-color="white" fullWidth @click="handleFab">Write my first note</Button>
      </div>
    </div>

    <div v-else>
      <RecentNotes />
    </div>
    
    <SlideUpPromptModal v-model="modalActive" @no="slideModalActive = false">
      <template #icon>
        <HomeReminderSVG />
      </template>

      <template #title>
        <p class="is-size-4 has-text-centered">
          Would you like gentle reminders to write or reflect?
        </p>
      </template>

      <template #buttons>
        <Button py="2" style="width: 38.1%" @click="handleModalNo">No</Button>
        <Button
          color="primary"
          label-color="light"
          py="2"
          style="width: 38.1%"
          @click="handleModalYes"
        >
          Yes
        </Button>
      </template>
    </SlideUpPromptModal>

    <div>
      <ReminderModal v-model="showSetReminder" @save="handleSaveReminder" />
    </div>

    <!-- Navigation Bar -->
    <div>
      <BottomNavBar @nav="handleNav" @fab="handleFab" />
    </div>
  </div>
</template>

<style scoped>
.content {
  background-color: #f9f8ff;
  height: 100vh;
  overflow-y: hidden;
}
.has-width-85 {
  width: 85%;
}
</style>
