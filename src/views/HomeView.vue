<script setup lang="ts">
import Questionaire from '@/components/Questionaire.vue'
import Button from '@/components/Button.vue'
</script>

<template>
  <main>
    <div class="px-4 pt-8">
      <p class="is-size-4 mb-5 has-text-grey">Almost there!</p>
      <p class="is-size-3 mb-5">What are you using StillNote for?</p>
      <div class="fixed-grid">
        <div class="grid is-gap-2">
          <div class="cell">
            <Questionaire />
          </div>
          <div class="cell">
            <Questionaire />
          </div>
          <div class="cell">
            <Questionaire />
          </div>
          <div class="cell">
            <Questionaire />
          </div>
          <div class="cell">
            <Questionaire />
          </div>
          <div class="cell">
            <Questionaire />
          </div>
        </div>
      </div>
      <div
        class="is-flex is-align-items-flex-start is-justify-content-space-between width-90vw mt-5"
      >
        <Button color="transparent" label-color="primary">Skip</Button>
        <Button
          color="primary"
          icon="fas fa-arrow-right"
          icon-position="right"
          icon-size="small"
          icon-color="primary"
          icon-gap="5"
          label-color="primary"
          @click=""
          outlined
        >
          Next
        </Button>
      </div>
    </div>
  </main>
</template>

<style scoped>
.pt-8 {
  padding-top: 5.125rem !important;
}
.width-90vw {
  width: 90vw;
}
</style>
