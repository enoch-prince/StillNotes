<!-- views/AddNote.vue -->
<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useNoteDraftStore, useSavedNotesStore } from '@/stores/counter'
import Button from '@/components/Button.vue'
import type { Scripture } from '@/custom_types'
import AppBar from '@/components/AppBar.vue'

const router = useRouter()
const noteDraftStore = useNoteDraftStore()
const savedNotesStore = useSavedNotesStore()

const colors = ['#FFA09F', '#75C7F8', '#A795F8', '#6BEEC3', '#F8C715', '#1F7F40']
const noteTitle = ref(noteDraftStore.title)
const noteContent = ref(noteDraftStore.content)
const selectedColor = ref(noteDraftStore.color || colors[2])
const fontStyle = ref(noteDraftStore.font || 'default')
const noteScripture = ref<Scripture[]>(noteDraftStore.scripture)

function goNext() {
  savedNotesStore.addToNotes(noteDraftStore.$state)
  //   router.push('/note/preview')
}

function addVerse() {
  console.log('Add verse clicked')
  router.push({ name: 'search' })
}

function setFont(style: string) {
  fontStyle.value = style
}

function removeScripture(id: string) {
  const indexToRemove = noteScripture.value.findIndex((scripture) => scripture.id === id)
  if (indexToRemove !== -1) {
    noteScripture.value.splice(indexToRemove, 1)
    console.log('Scripture Removed')
  }
}

const goBack = () => {
  router.back()
}

watch([noteTitle, noteContent, selectedColor, fontStyle, noteScripture], () => {
  noteDraftStore.updateDraft({
    title: noteTitle.value,
    content: noteContent.value,
    color: selectedColor.value,
    font: fontStyle.value,
    scripture: noteScripture.value,
  })
})
</script>

<template>
  <div class="add-note-page" :style="{ backgroundColor: selectedColor }">
    <!-- Top App Bar -->
    <AppBar title="New Note" @back="goBack">
      <a class="has-text-primary is-size-4 has-text-weight-medium" @click="goNext">Next</a>
    </AppBar>

    <!-- Note Editor -->
    <div class="p-4" style="height: 100%">
      <input
        name="title"
        class="input p-0 is-size-3 is-transparent has-text-white has-text-weight-semibold"
        v-model="noteTitle"
        placeholder="Title"
        style="border: none; background: transparent"
      />

      <textarea
        id="note"
        class="textarea p-0 is-transparent is-family-secondary mt-4"
        v-model="noteContent"
        rows="10"
        placeholder="I'm reflecting on..."
        style="border: none; background: transparent; resize: none; color: white"
      />
      <div class="tags">
        <span
          v-for="scripture in noteScripture"
          class="tag is-rounded has-text-white is-family-secondary py-1"
          style="background-color: rgba(255, 255, 255, 0.2)"
          >{{ scripture.book }} {{ scripture.chapter }}:{{ scripture.verse }}
          <button
            class="delete is-small"
            @click="removeScripture(scripture.id!)"
            aria-label="delete"
            title="delete"
          ></button>
        </span>
      </div>
    </div>

    <div class="px-5 pb-4">
      <Button
        size="small"
        icon="fa fa-plus"
        icon-position="right"
        outlined
        rounded
        @click="addVerse"
        >Add verse</Button
      >
    </div>

    <!-- Footer / Toolbar -->
    <div class="note-toolbar p-4 is-flex is-justify-content-space-between is-align-items-center">
      <div class="icon-text is-flex-direction-row has-text-black-bis">
        <div @click="">
          <span class="icon circle-size has-background-white-alpha-50">
            <font-awesome-icon icon="fa-solid fa-font"></font-awesome-icon>
          </span>
        </div>

        <div @click="">
          <span class="icon circle-size has-background-white-alpha-50">
            <font-awesome-icon icon="fa-solid fa-align-left"></font-awesome-icon>
          </span>
        </div>
      </div>

      <div class="color-picker is-flex is-align-items-center is-flex-wrap-wrap">
        <span
          v-for="color in colors"
          :key="color"
          class="circle-size mx-1"
          :style="{
            backgroundColor: color,
            border: color === selectedColor ? '2px solid white' : 'none',
          }"
          @click="selectedColor = color"
        ></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.add-note-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  color: white;
}

.note-toolbar {
  border-top: 2px solid rgba(255, 255, 255, 1);
  background: rgba(255, 255, 255, 0.05);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  position: sticky;
  bottom: 0;
  border-bottom-left-radius: 1rem;
  border-bottom-right-radius: 1rem;
}

.circle-size {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
}

.has-background-white-alpha-50 {
  background: rgba(255, 255, 255, 0.5);
}

::placeholder {
  color: rgba(255, 255, 255, 0.65);
}
</style>
