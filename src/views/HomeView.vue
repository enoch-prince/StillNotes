<script setup lang="ts">
import CalendarScroller from '@/components/CalendarScroller.vue'
import Button from '@/components/Button.vue';
import BottomNavBar from '@/components/BottomNavBar.vue';

const user = 'Kwame'

const handleNav = (id: string) => {
    console.log('Navigate to:', id)
}
 // floating action buttons
const handleFab = () => {
    console.log('FAB pressed: Open new note')
}

</script>

<template>
  <div class="content">
    <div class="section">
      <p class="is-size-4 mb-4 has-text-weight-semibold">👋🏽 Hello {{ user }}!</p>
      <p class="is-size-6 is-family-secondary has-text-grey">Just breathe and write ✍️</p>
      <CalendarScroller class="mt-5"/>
    </div>
    <div class="section is-flex is-flex-direction-column is-align-items-center pt-2">
      <div class="mb-4">
        <p class="has-text-centered is-size-3 has-text-weight-bold">Want to begin your first reflection?</p>
      </div>
      <div class="mb-4 px-4 has-text-centered is-size-6 has-text-grey">
        <p class="">Every big step starts with a small step. <br>
            Note your first Inspiration and start your journey!
        </p>
      </div>
      <div class="has-width-85">
        <Button color="primary" label-color="white" fullWidth>Write my first note</Button>
      </div>
    </div>
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
