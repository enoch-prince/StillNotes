<script setup lang="ts">
import { ref, computed } from 'vue'
import filterIconSVG from '@/components/svgs/filterIconSVG.vue'
import Note from '@/components/Note.vue'
import { useSavedNotesStore } from '@/stores/counter'

const searchString = ref('')
const savedNotesStore = useSavedNotesStore()
const recentNotes = computed(() => savedNotesStore.notes)

const filteredNotes = computed(() => {
  return recentNotes.value.filter((note) =>
    note.title.toLowerCase().includes(searchString.value.toLowerCase()),
  )
})
</script>

<template>
  <div class="px-4 mb-2 is-flex is-justify-content-space-between is-align-items-center">
    <span class="is-family-secondary is-size-5">Recent Notes</span>
    <filterIconSVG @click="console.log('filter clicked')" />
  </div>
  <div class="px-4 py-2 mb-2">
    <div class="control">
      <input
        class="input is-family-secondary"
        type="text"
        placeholder="Search..."
        style="background-color: #f2f0fd"
        v-model="searchString"
      />
    </div>
  </div>
  <div
    class="is-flex is-flex-direction-column px-4 pb-6"
    style="gap: 12px; max-height: 60vh; overflow-y: auto;"
  >
    <Note
      v-for="note in filteredNotes"
      :key="note.id"
      :note="note"
    />
  </div>
</template>

<style scoped></style>
