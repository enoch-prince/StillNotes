<script setup lang="ts">
import CalendarScroller from '@/components/CalendarScroller.vue'
import Button from '@/components/Button.vue'
import BottomNavBar from '@/components/BottomNavBar.vue'
import HomeReminderSVG from '@/components/svgs/homeReminderSVG.vue'
import { useNavigationStore, useReminderStore } from '@/stores/counter'
import { computed, ref, watchEffect } from 'vue'

const user = 'Kwame'

const reminder = useReminderStore()
const navStore = useNavigationStore()
const previousRoute = computed(() => navStore.previousRoute)
const modalActive = ref(false)

const modalClasses = computed(() => ({
  'is-active': modalActive.value,
}))

const handleNav = (id: string) => {
  console.log('Navigate to:', id)
}

// floating action buttons
const handleFab = () => {
  console.log('FAB pressed: Open new note')
}

const handleModalYes = () => {
  reminder.remindMe = true
  modalActive.value = false
}

watchEffect(() => {
  if (previousRoute.value?.name === 'questionaire') {
    modalActive.value = true
  } else {
    if (!reminder.remindMe) {
      modalActive.value = true
    }
  }
})
</script>

<template>
  <div class="content">
    <div class="section">
      <p class="is-size-4 mb-4 has-text-weight-semibold">👋🏽 Hello {{ user }}!</p>
      <p class="is-size-6 is-family-secondary has-text-grey">Just breathe and write ✍️</p>
      <CalendarScroller class="mt-5" />
    </div>
    <div class="section is-flex is-flex-direction-column is-align-items-center pt-2">
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
        <Button color="primary" label-color="white" fullWidth>Write my first note</Button>
      </div>
    </div>

    <!-- Modal -->
    <div class="modal" :class="modalClasses">
      <div class="modal-background"></div>
      <div
        class="modal-content is-flex is-flex-direction-column is-justify-content-center is-align-items-center p-5 has-width-85"
        style="border-radius: 1rem; background-color: #fff"
      >
        <div class="mb-5">
          <HomeReminderSVG />
        </div>
        <div class="mb-5">
          <p class="is-size-4 has-text-centered">
            Would you like gentle reminders to write or reflect?
          </p>
        </div>
        <div class="is-flex is-justify-content-space-between" style="width: 100%">
          <Button py="2" style="width: 38.1%" @click="modalActive = false">No</Button>
          <Button py="2" style="width: 38.1%" @click="handleModalYes">Yes</Button>
        </div>
      </div>
      <button class="modal-close is-large" aria-label="close" @click="modalActive = false"></button>
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
  /* background-color: #f4f2ff; */
  height: 100vh;
}
.has-width-85 {
  width: 85%;
}
</style>
