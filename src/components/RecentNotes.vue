<script setup lang="ts">
import { ref, computed } from 'vue'
import filterIconSVG from '@/components/svgs/filterIconSVG.vue'
import moreIconSVG from '@/components/svgs/moreIconSVG.vue'
import { useSavedNotesStore } from '@/stores/counter'
import { getContrastColor } from '@/utils/utils'

const searchString = ref('')
const recentNotes = ref(useSavedNotesStore().notes)

const filteredNotes = computed(() => {
  return recentNotes.value.filter((note) =>
    note.title.toLowerCase().includes(searchString.value.toLowerCase()),
  )
})
</script>

<template>
  <div class="px-4 mb-2 is-flex is-justify-content-space-between is-align-items-center">
    <span class="is-family-secondary is-size-5">Recent Notes</span>
    <filterIconSVG />
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
    class="is-flex is-flex-direction-column"
    style="gap: 5px; padding: 0 0.406rem; max-height: 60vh; overflow-y: auto; padding-bottom: 6rem"
  >
    <div
      class="pb-5"
      :style="{
        gap: '8px',
        backgroundColor: note.color,
        borderRadius: '16px',
        color: getContrastColor(note.color),
      }"
      v-for="note in recentNotes"
      :key="note.id"
    >
      <div class="px-4 py-2 is-flex is-justify-content-space-between is-align-items-center">
        <span class="is-family-secondary is-size-7">2 days ago</span>
        <moreIconSVG :color="getContrastColor(note.color)" />
      </div>
      <div class="px-5">
        <div class="is-size-4 mb-2">{{ note.title }}</div>
        <div class="is-family-secondary">{{ note.content }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
