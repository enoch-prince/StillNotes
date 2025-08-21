<script setup lang="ts">
import { useRecentScriptureStore, useSearchedScriptureStore } from '@/stores/counter'
import ScriptureBar from './ScriptureBar.vue'
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Bible, generateId, searchBible } from '@/utils'

const props = defineProps<{ scriptureSearch: string }>()

const router = useRouter()

const recentScriptureStore = useRecentScriptureStore()
const searchedScriptureStore = useSearchedScriptureStore()

const searched = computed(() => {
  return searchBible(Bible, props.scriptureSearch)
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
