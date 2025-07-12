<script setup lang="ts">
import Questionaire from '@/components/Questionaire.vue'
</script>

<template>
  <main>
    <div class="px-4 pt-8">
      <p class="is-size-4 mb-5 has-text-grey">Almost there!</p>
      <p class="is-size-3 mb-5">What are you using StillNote for?</p>
      <div class="is-flex columns is-touch is-multiline is-centered">
        <div class="is-flex column">
          <Questionaire />
        </div>
        <div class="is-flex column">
          <Questionaire />
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.pt-8 {
  padding-top: 5.125rem !important;
}
</style>
