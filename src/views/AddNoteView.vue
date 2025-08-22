<!-- views/AddNote.vue -->
<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useDateStore, useNoteDraftStore, useSavedNotesStore } from '@/stores/counter'
import Button from '@/components/Button.vue'
import type { Scripture } from '@/custom_types'
import AppBar from '@/components/AppBar.vue'
import SlideupSelector from '@/components/SlideupSelector.vue'
import ToggleSlider from '@/components/ToggleSlider.vue'
import { formatDate } from '@/utils'

const router = useRouter()
const noteDraftStore = useNoteDraftStore()
const savedNotesStore = useSavedNotesStore()
const dateStore = useDateStore()

const colors = ['#FFA09F', '#75C7F8', '#A795F8', '#6BEEC3', '#F8C715', '#1F7F40']
const noteTitle = ref(noteDraftStore.title)
const noteContent = ref(noteDraftStore.content)
const selectedColor = ref(noteDraftStore.color || colors[2])
const fontStyle = ref(noteDraftStore.font || 'default')
const noteScripture = ref<Scripture[]>(noteDraftStore.scripture)
const today = formatDate(dateStore.today)

const modalActive = ref(false)
const showReminderModal = ref(false)
const makePublic = ref(false)

function goNext() {
  modalActive.value = true
  // savedNotesStore.addToNotes(noteDraftStore.$state)
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
    <SlideupSelector
      v-model="modalActive"
      :has-modal-background="true"
      :modal-background-transparent="true"
    >
      <div class="p-4">
        <div class="mt-4">
          <div class="px-2 py-4 mb-2">
            <ToggleSlider label="Make Public" v-model="makePublic" />
          </div>
          <div class="px-2 py-4">
            <div class="is-flex is-justify-content-space-between is-family-secondary">
              <div>
                <span> <font-awesome-icon icon="fa-regular fa-clock fa-lg" /> </span>
                <span class="ml-2">Set Reminder</span>
              </div>
              <div class="has-text-grey is-size-7 is-clickable" @click="showReminderModal = true">
                <span>Not Set</span>
                <span class="ml-2"><font-awesome-icon icon="fa-solid fa-chevron-right" /></span>
              </div>
            </div>
          </div>
          <div class="px-2 py-4">
            <div class="is-flex is-justify-content-space-between is-family-secondary">
              <div>
                <span> <font-awesome-icon icon="fa-solid fa-tag fa-lg" /> </span>
                <span class="ml-2">Tag Note</span>
              </div>
              <div class="has-text-grey is-size-7 is-clickable">
                <span>Not Set</span>
                <span class="ml-2"><font-awesome-icon icon="fa-solid fa-chevron-right" /></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SlideupSelector>

    <SlideupSelector v-model="showReminderModal" :has-modal-background="true" :modal-background-transparent="true">
      <div class="px-4 pt-4 pb-5">
        <div class="is-flex is-justify-content-center is-align-items-center"><div class="is-flex drag-bar"></div></div>
        <div class="mt-4">
          <div class="mb-5">
            <div class="py-2 bottom-border">
              <p>{{ today }}</p>
            </div>
            <div class="mt-2 px-4">
              Note Reminder scroller goes here
            </div>
          </div>
          <div class="is-flex is-justify-content-space-between">
            <Button color="primary" label-color="primary" px="5p5" py="2" outlined @click="showReminderModal=false"
              >Cancel</Button
            >
            <Button
              color="primary"
              label-color="light"
              py="2"
              style="padding-left: 2.75rem; padding-right: 2.75rem"
              @click=""
              >Done</Button
            >
          </div>
        </div>
      </div>
    </SlideupSelector>
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

div.bottom-border {
  /* filter: drop-shadow(#efeef0 0 2px 0); */
  border-bottom: 1px solid #efeef0;
}

div.drag-bar {
  /* display: flex;
  justify-content: center;
  align-items: center; */
  width: 30%;
  border-bottom: 3px solid #efeef0
}
</style>
