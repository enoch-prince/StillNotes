<script setup lang="ts">
import { useRecentScriptureStore, useSearchedScriptureStore } from '@/stores/counter'
import ScriptureBar from './ScriptureBar.vue'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Bible, generateId, searchBible } from '@/utils/utils'

const props = defineProps<{ scriptureSearch: string }>()

const router = useRouter()

const recentScriptureStore = useRecentScriptureStore()
const searchedScriptureStore = useSearchedScriptureStore()

// Results found based on current search input
const results = computed(() => {
  return searchBible(Bible, props.scriptureSearch)
})

// Navigation logic: sets the store and adds to recent history
const selectScripture = async (book: any) => {
  // Add to recent searches store
  await recentScriptureStore.addToRecent({
    id: generateId(book.book),
    label: book.book,
    timestamp: new Date().getTime(),
    data: book,
  })

  // Set as current searched book
  searchedScriptureStore.set(book)

  // Navigate to chapter/verse selection
  router.push({ name: 'scripture' })
}
</script>

<template>
  <div class="px-4">
    <!-- Search Results Section -->
    <div v-if="scriptureSearch.trim().length > 0" class="mb-6">
      <div style="margin-bottom: 1rem; width: 100%">
        <p class="is-family-secondary is-size-7" style="color: #c8c5cb">SEARCH RESULTS</p>
      </div>
      <div v-if="results.length > 0" class="is-clickable">
        <ScriptureBar
          v-for="book in results"
          :key="book.book"
          :label="book.book"
          @click="selectScripture(book)"
        >
          <template #icon>
            <font-awesome-icon icon="fa-solid fa-magnifying-glass" class="mr-2 is-size-7" style="color: #c8c5cb" />
          </template>
        </ScriptureBar>
      </div>
      <div v-else class="has-text-grey-light is-size-7 px-2">
        No books found matching "{{ scriptureSearch }}"
      </div>
    </div>

    <!-- Recent Searches Section -->
    <div v-if="recentScriptureStore.getNMostRecent.length > 0">
      <div style="margin-bottom: 1rem; width: 100%">
        <p class="is-family-secondary is-size-7" style="color: #c8c5cb">RECENT SEARCHES</p>
      </div>
      <div class="is-clickable">
        <ScriptureBar
          v-for="recent in recentScriptureStore.getNMostRecent"
          :key="recent.id"
          :label="recent.label"
          @click="selectScripture(recent.data)"
        >
          <template #icon>
            <font-awesome-icon icon="fa-solid fa-clock-rotate-left" class="mr-2 is-size-7" style="color: #c8c5cb" />
          </template>
        </ScriptureBar>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
