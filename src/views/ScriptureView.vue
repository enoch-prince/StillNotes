<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import AppBar from '@/components/AppBar.vue'
import type { Scripture } from '@/utils/custom_types'
import { useNoteDraftStore, useSearchedScriptureStore } from '@/stores/counter'
import { useRouter } from 'vue-router'
import { generateId } from '@/utils/utils'

const showChapterModal = ref(true)
const appTitle = computed(() => (showChapterModal.value ? 'Chapter' : 'Verse'))

const searchedScriptureStore = useSearchedScriptureStore()
const selected = ref<Scripture>({
  book: searchedScriptureStore.bibleBook.book!,
  chapter: 0,
  verse: 0,
})
const chapters = computed(() => Object.keys(searchedScriptureStore.bibleBook.chapterData!))
const verses = computed(
  () => searchedScriptureStore.bibleBook.chapterData![String(selected.value.chapter)],
)
const scriptureId = computed(() =>
  generateId(selected.value.book, selected.value.chapter, selected.value.verse),
)

const router = useRouter()
const noteDraft = useNoteDraftStore()

const getSelectedChapter = (param: string) => {
  selected.value.chapter = Number(param)
  showChapterModal.value = false
}
const getSelectedVerse = (param: number) => {
  selected.value.verse = param
  selected.value.id = scriptureId.value
  noteDraft.scripture.push(selected.value)
  // navigate to add-note views
  router.push({ name: 'add-note' })
}
</script>

<template>
  <div>
    <AppBar :title="appTitle" hasBackIconLabel iconColor="primary" @back="router.back()"></AppBar>
    <div
      v-if="showChapterModal"
      class="is-flex is-flex-wrap-wrap is-align-items-center px-3 justify-center-4-small-screens"
      style="gap: 20px"
    >
      <div
        v-for="num in chapters"
        class="num-slot is-size-4 is-flex is-align-items-center is-clickable"
        @click="getSelectedChapter(num)"
      >
        <div class="slot-styled">
          <span>{{ num }}</span>
        </div>
      </div>
    </div>

    <div
      v-else
      class="is-flex is-flex-wrap-wrap is-align-items-center px-3 justify-center-4-small-screens"
      style="gap: 20px"
    >
      <div
        v-for="num in verses"
        class="num-slot is-size-4 is-flex is-align-items-center is-clickable"
        @click="getSelectedVerse(num)"
      >
        <div class="slot-styled">
          <span>{{ num }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.num-slot {
  border-radius: 8px;
  background-color: #f0f3fd;
  padding: 8px;
}

.slot-styled {
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
}

@media only screen and (max-width: 395px) {
  /* CSS styles for screen widths 395px and below */
  .justify-center-4-small-screens {
    justify-content: center;
  }
}
</style>
