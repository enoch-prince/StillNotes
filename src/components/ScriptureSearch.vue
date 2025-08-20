<script setup lang="ts">
import { useRecentScriptureStore, useSearchedScriptureStore } from '@/stores/counter'
import ScriptureBar from './ScriptureBar.vue'
import { computed, ref, watch } from 'vue'
import SlideupSelector from './SlideupSelector.vue'
import { useRouter } from 'vue-router'

const props = defineProps<{ scriptureSearch: string }>()

const router = useRouter()

const recentScriptureStore = useRecentScriptureStore()
const searchedScriptureStore = useSearchedScriptureStore()

const bible = {
  newTestament: [
    {
      book: '1 John',
      chapterData: {
        '1': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        '2': [
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
          26, 27, 28, 29,
        ],
        '3': [
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
        ],
        '4': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
        '5': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
      },
    },
    {
      book: '2 John',
      chapterData: {
        '1': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
      },
    },
    {
      book: '3 John',
      chapterData: {
        '1': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      },
    },
    {
      book: 'Jude',
      chapterData: {
        '1': [
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
        ],
      },
    },
  ],
}

function searchBible(jsonData: { newTestament: any[] }, bookName: string) {
  // 1. Find the book in New Testament
  const book = jsonData.newTestament.find((b) => b.book.toLowerCase() === bookName.toLowerCase())

  if (!book) {
    return { error: 'Book not found' }
  }

  // Return entire book
  return book
}

function generateId(bookName: string, chapterNum = null, verseNum = null) {
  // Convert book name to a standardized ID (e.g., "1 John" → "1jn")
  const bookId = bookName
    .toLowerCase()
    .replace(/\s+/g, '') // Remove spaces ("1john")
    .replace(/^(\d+)([a-z]+)/, '$1$2') // "1john" → "1jn"

  if (chapterNum === null) {
    return bookId // Return book ID (e.g., "1jn")
  } else if (verseNum === null) {
    return `${bookId}-${chapterNum}` // Chapter ID (e.g., "1jn-2")
  } else {
    return `${bookId}-${chapterNum}-${verseNum}` // Verse ID (e.g., "1jn-2-15")
  }
}

const searched = computed(() => {
  return searchBible(bible, props.scriptureSearch)
})

watch(searched, (newSearched) => {
  if (!newSearched.error) {
    console.log(newSearched)
    recentScriptureStore.addToRecent({
      id: generateId(newSearched.book),
      label: newSearched.book,
      timestamp: new Date(),
    })
  }
})

const goToScriptureView = () => {
  searchedScriptureStore.set(searched.value)
  router.push({ name: 'scripture' })
}
</script>

<template>
  <div class="px-4">
    <div style="margin-bottom: 1.25rem; width: 100%">
      <p class="is-family-secondary is-size-7" style="color: #c8c5cb">RECENT SEARCHES</p>
    </div>
    <div class="is-clickable" @click="goToScriptureView">
      <!-- Add a ScriptureBar component -->
      <ScriptureBar
        v-for="scripture in recentScriptureStore.getNMostRecent"
        :key="scripture.id"
        :label="scripture.label"
      />
    </div>
  </div>
</template>

<style scoped></style>
