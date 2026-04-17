<script setup lang="ts">
import AppBar from '@/components/AppBar.vue';
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useSavedNotesStore, useNoteDraftStore } from '@/stores/counter';
import type { INote } from '@/utils/custom_types';

const props = defineProps<{noteId: string}>()

const router = useRouter()
const savedNotesStore = useSavedNotesStore()
const noteDraftStore = useNoteDraftStore()

const note = computed(() => savedNotesStore.notes.find(n => n.id === props.noteId))

const goBack = () => {
  router.push({ name: 'home' })
}

const editNote = async () => {
  if (note.value) {
    // Populate draft store with existing note data
    await noteDraftStore.saveDraft(note.value)
    router.push({ name: 'add-note' })
  }
}

onMounted(async () => {
    if (savedNotesStore.isEmpty) {
        await savedNotesStore.loadNotes();
    }
})

</script>

<template>
  <div v-if="note" class="single-note-page" :style="{ backgroundColor: note.color }">
    <AppBar :title="note.title || 'Note'" @back="goBack">
      <a class="navbar-item has-text-white" @click="editNote">
        <span class="icon"> <font-awesome-icon icon="fa-solid fa-pen-to-square" /> </span>
        <span class="ml-1 has-text-weight-bold">Edit</span>
      </a>
    </AppBar>

    <div class="p-5">
      <div class="content has-text-white">
        <h1 class="title is-2 has-text-white mb-6">{{ note.title }}</h1>
        
        <div class="tags mb-4">
          <span v-for="scrip in note.scripture" :key="scrip.id" class="tag is-rounded is-white-alpha">
            {{ scrip.book }} {{ scrip.chapter }}:{{ scrip.verse }}
          </span>
        </div>

        <div class="note-body is-family-secondary is-size-5" style="white-space: pre-wrap;">
          {{ note.content }}
        </div>

        <div class="mt-6 pt-6" v-if="note.tags && note.tags.length > 0">
          <p class="is-size-7 mb-2 opacity-70">TAGS</p>
          <div class="tags">
            <span v-for="tag in note.tags" :key="tag" class="tag is-rounded is-white-alpha">
              #{{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="section has-text-centered p-6">
    <p>Note not found or loading...</p>
    <button class="button is-text mt-4" @click="goBack">Go Back Home</button>
  </div>
</template>

<style scoped>
.single-note-page {
  min-height: 100vh;
  color: white;
}
.is-white-alpha {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
}
.opacity-70 {
  opacity: 0.7;
}
.note-body {
  line-height: 1.6;
}
</style>
