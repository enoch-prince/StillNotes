<script setup lang="ts">
import Questionaire from '@/components/Questionaire.vue'
import Button from '@/components/Button.vue'
import { ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuestionaireStore } from '@/stores/counter'

interface QStructure {
  id: string
  label: string
}

const selectedQs: Ref<Array<QStructure>> = ref([])
const router = useRouter()
const questionaire = useQuestionaireStore()

function handleQSelect(data: { label: string; selected: boolean; id: string }) {
  if (data.selected) {
    selectedQs.value?.push({ label: data.label, id: data.id } as QStructure)
    // console.log(`${data.id}: ${data.label}`)
  } else {
    const index = selectedQs.value?.findIndex((item) => item.id === data.id)
    if (index !== -1) {
      selectedQs.value?.splice(index, 1) // Mutates originalArray
    }
  }
  console.log(selectedQs.value)
}

const handleNext = () => {
  console.log("Next Pressed!")
  // save selected options to db
  questionaire.state = true;
  router.push({path: '/'})
}

const handleSkip = () => {
  console.log("Skip Pressed!")
  questionaire.state = false
  router.push({path: '/'})
}

const ListOfQs = [
    { icon: "fa-solid fa-book-bible", label: "Daily Devotion", color: "#d1c7ff" },
    { icon: "fa-regular fa-lightbulb", label: "Processing thoughts", color: "#FFE2E8" }, /**fa-solid fa-book-bible */
    { icon: "fa-solid fa-scroll", label: "Taking note through sermon", color: "#D6F197" }, /**fa-solid fa-scroll fa-regular fa-note-sticky*/
    { icon: "fa-regular fa-comment-dots", label: "Tracking quotes & inspiration", color: "#A5EED6" },
    { icon: "fa-solid fa-people-group", label: "Finding like minded people", color: "#C6EAFF" },
    { icon: "fa-regular fa-compass", label: "Just exploring", color: "#FDEBAB" },
  ]
</script>

<template>
  <main>
    <div class="px-4 pt-8">
      <p class="is-size-4 mb-5 has-text-grey">Almost there!</p>
      <p class="is-size-3 mb-5">What are you using StillNote for?</p>
      <div class="fixed-grid">
        <div class="grid is-gap-2">
          <div class="cell" v-for="item in ListOfQs">
            <Questionaire
              :icon="item.icon"
              :label="item.label"
              :color="item.color"
              @select-q="handleQSelect"
            />
          </div>
        </div>
      </div>
      <div
        class="is-flex is-align-items-flex-start is-justify-content-space-between width-90vw "
      >
        <Button color="transparent" label-color="primary" @click="handleSkip">Skip</Button>
        <Button
          color="primary"
          icon="fas fa-arrow-right"
          icon-position="right"
          icon-size="small"
          icon-color="primary"
          icon-gap="5"
          label-color="primary"
          @click="handleNext"
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

@media screen and (max-width: 375px) {
    .is-size-4 {
        font-size: 1.25rem !important;
    }
    .is-size-3 {
        font-size: 1.5rem !important;
    }
}
</style>
