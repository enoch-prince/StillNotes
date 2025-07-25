<!-- views/AddNote.vue -->
<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useNoteDraftStore } from '@/stores/counter'
import Button from '@/components/Button.vue'
import type { Scripture } from '@/custom_types'

const router = useRouter()
const store = useNoteDraftStore()

const colors = ['#FFA09F', '#75C7F8', '#A795F8', '#6BEEC3', '#F8C715', '#1F7F40']
const noteTitle = ref(store.title)
const noteContent = ref(store.content)
const selectedColor = ref(store.color || colors[2])
const fontStyle = ref(store.font || 'default')
const noteScripture = ref<Scripture[]>([
  { book: 'Hebrews', chapter: 1, verse: 11 },
  { book: 'Matthew', chapter: 5, verse: 8 },
  { book: 'Job', chapter: 9, verse: 4 },
  { book: 'Luke', chapter: 5, verse: 4 },
])

function goBack() {
  router.back()
}

function goNext() {
  store.saveDraft({
    title: noteTitle.value,
    content: noteContent.value,
    color: selectedColor.value,
    font: fontStyle.value,
    scripture: noteScripture.value,
  })
  //   router.push('/note/preview')
}

function addVerse() {
  console.log('Add verse clicked')
}

function setFont(style: string) {
  fontStyle.value = style
}

watch([noteTitle, noteContent, selectedColor, fontStyle, noteScripture], () => {
  store.updateDraft({
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
    <nav class="navbar is-flex is-align-items-center is-transparent py-2 px-4">
      <div class="navbar-brand">
        <a class="navbar-item" @click="goBack">
          <font-awesome-icon icon="fa-solid fa-chevron-left fa-lg" />
        </a>
      </div>
      <div
        class="navbar-item is-expanded has-text-centered has-text-weight-bold is-family-secondary"
      >
        New Note
      </div>
      <div class="navbar-item">
        <a class="has-text-primary is-size-4 has-text-weight-medium" @click="goNext">Next</a>
      </div>
    </nav>

    <!-- Note Editor -->
    <div class="p-4" style="height: 100%">
      <input
        class="input p-0 is-size-3 is-transparent has-text-white has-text-weight-semibold"
        v-model="noteTitle"
        placeholder="Title"
        style="border: none; background: transparent"
      />

      <textarea
        class="textarea p-0 is-transparent is-family-secondary mt-4"
        v-model="noteContent"
        rows="10"
        placeholder="I'm reflecting on..."
        style="border: none; background: transparent; resize: none; color: white"
      />
      <div class="is-flex is-flex-wrap-wrap is-align-items-start" style="gap: 0.5rem;">
        <div v-for="scripture in noteScripture">
          <Button
          size="small"
          label-color="light"
          rounded
          style="background-color: rgba(255, 255, 255, 0.2)"
          >{{ scripture.book }} {{ scripture.chapter }}:{{ scripture.verse }}</Button
        >
        </div>
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
