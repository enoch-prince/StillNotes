<!-- views/AddNote.vue -->
<script setup lang="ts">
import { computed, ref, watch, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { Markdown } from 'tiptap-markdown'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import {
  useGlobalStatesStore,
  useNoteDraftStore,
  useNoteReminderStore,
  useSavedNotesStore,
} from '@/stores/counter'
import Button from '@/components/Button.vue'
import type { Scripture } from '@/utils/custom_types'
import AppBar from '@/components/AppBar.vue'
import SlideupSelector from '@/components/SlideupSelector.vue'
import ToggleSlider from '@/components/ToggleSlider.vue'
import InfiniteTimePicker from '@/components/InfiniteTimePicker.vue'
import { formatDate, Hours, Minutes } from '@/utils/utils'
import { storeToRefs } from 'pinia'

const router = useRouter()
const noteDraftStore = useNoteDraftStore()
const globalStatesStore = useGlobalStatesStore()
const savedNotesStore = useSavedNotesStore()
const { dateToday, hour, minute, period } = storeToRefs(useNoteReminderStore())
const { togglePeriod, resetNoteReminder } = useNoteReminderStore()

// Use storeToRefs to ensure local refs are live-linked to the store
const { 
  title: noteTitle, 
  content: noteContent, 
  color: selectedColor, 
  font: fontStyle, 
  scripture: noteScripture, 
  tags: tags, 
  isPublic: makePublic 
} = storeToRefs(noteDraftStore)

const colors = ['#FFA09F', '#75C7F8', '#A795F8', '#6BEEC3', '#F8C715', '#1F7F40']
const today = formatDate(dateToday.value)

const editor = useEditor({
  content: noteContent.value,
  extensions: [
    StarterKit,
    Markdown,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    Placeholder.configure({
      placeholder: "I'm reflecting on...",
    }),
  ],
  onUpdate: ({ editor }) => {
    // Update the store-backed noteContent ref directly
    noteContent.value = (editor.storage as any).markdown.getMarkdown();
  },
  editorProps: {
    attributes: {
      class: 'is-transparent is-family-secondary tiptap-custom-styles p-0',
    },
  },
})

// Ensure the editor content stays in sync if noteContent changes externally (e.g., from DB load)
watch(noteContent, (newValue) => {
  if (editor.value && (editor.value.storage as any).markdown.getMarkdown() !== newValue) {
    editor.value.commands.setContent(newValue, { emitUpdate: false });
  }
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})

const toggleBold = () => {
  editor.value?.chain().focus().toggleBold().run()
}

const cycleAlignment = () => {
  if (!editor.value) return;
  if (editor.value.isActive({ textAlign: 'left' }) || !editor.value.isActive({ textAlign: 'center' }) && !editor.value.isActive({ textAlign: 'right' })) {
    editor.value.chain().focus().setTextAlign('center').run();
  } else if (editor.value.isActive({ textAlign: 'center' })) {
    editor.value.chain().focus().setTextAlign('right').run();
  } else {
    editor.value.chain().focus().setTextAlign('left').run();
  }
}

const tagNoteLabel = computed(() => {
  if (tags.value.length === 0) return "Not Set";
  return `${tags.value.length} Set`
})

const modalActive = ref(globalStatesStore.showAddNoteSettings)
const showReminderModal = ref(false)

function goNext() {
  modalActive.value = true
}

async function saveNote() {
  await savedNotesStore.addToNotes(noteDraftStore.$state)
  noteDraftStore.resetDraft()
  router.push({name: 'home'})
}

function addVerse() {
  console.log('Add verse clicked')
  globalStatesStore.addVerseClicked = true
  globalStatesStore.tagNoteClicked = false
  router.push({ name: 'search' })
}

function addTag() {
  globalStatesStore.tagNoteClicked = true
  globalStatesStore.addVerseClicked = false
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

function removeTag(tagName: string) {
  const indexToRemove = tags.value.findIndex((tag) => tag === tagName)
  if (indexToRemove !== -1) {
    tags.value.splice(indexToRemove, 1)
    console.log('Tag Removed')
  }
}

const goBack = () => {
  router.back()
}

const cancelNoteReminder = () => {
  showReminderModal.value = false
  resetNoteReminder()
}

// Persist draft to DB on any change to the store-backed refs
watch([noteTitle, noteContent, selectedColor, fontStyle, noteScripture, tags, makePublic], async () => {
  await noteDraftStore.updateDraft({
    title: noteTitle.value,
    content: noteContent.value,
    color: selectedColor.value,
    font: fontStyle.value,
    scripture: noteScripture.value,
    tags: tags.value,
    public: makePublic.value
  })
}, { deep: true })
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
        style="border: none; background: transparent; box-shadow: none"
      />

      <editor-content :editor="editor" class="mt-4 p-0 content-editor" />
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
        <div @click="toggleBold">
          <span class="icon circle-size" :class="editor?.isActive('bold') ? 'has-background-white' : 'has-background-white-alpha-50'">
            <font-awesome-icon icon="fa-solid fa-font" :class="editor?.isActive('bold') ? 'has-text-grey-dark' : ''"></font-awesome-icon>
          </span>
        </div>

        <div @click="cycleAlignment">
          <span class="icon circle-size" :class="(editor?.isActive({ textAlign: 'center' }) || editor?.isActive({ textAlign: 'right' })) ? 'has-background-white' : 'has-background-white-alpha-50'">
            <font-awesome-icon 
              :icon="editor?.isActive({ textAlign: 'center' }) ? 'fa-solid fa-align-center' : editor?.isActive({ textAlign: 'right' }) ? 'fa-solid fa-align-right' : 'fa-solid fa-align-left'" 
              :class="(editor?.isActive({ textAlign: 'center' }) || editor?.isActive({ textAlign: 'right' })) ? 'has-text-grey-dark' : ''"
            ></font-awesome-icon>
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
      <template #extra>
        <div class="px-4" style="position: absolute; bottom: 37%; width: 100%; left: 0">
          <div style="border-top: 2px solid #fff"></div>
          <div class="pt-4 is-family-secondary">
            <div class="tags">
              <div
                v-for="tag in tags"
                class="tag is-rounded"
                style="background-color: rgba(255, 255, 255, 0.8); gap: 6px"
              >
                {{ tag }}
                <span class="icon has-text-grey is-clickable" @click="removeTag(tag)">
                  <font-awesome-icon icon="fas fa-x" />
                </span>
              </div>
            </div>
            <p class="mt-4 has-text-light">
              Reminder set on {{ dateToday.getDate() }}/{{ dateToday.getMonth() }}/{{
                dateToday.getFullYear()
              }}, {{ hour }}:{{ minute.toString().padStart(2, '0') }} {{ period }}
            </p>
          </div>
        </div>
      </template>
      <div class="p-4">
        <div class="is-flex is-justify-content-center is-align-items-center">
          <div class="is-flex drag-bar"></div>
        </div>
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
                <span>Change</span>
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
              <div class="has-text-grey is-size-7 is-clickable" @click="addTag">
                <span>{{ tagNoteLabel }}</span>
                <span class="ml-2"><font-awesome-icon icon="fa-solid fa-chevron-right" /></span>
              </div>
            </div>
          </div>
          <div class="px-2 py-4 is-flex is-flex-direction-row-reverse">
            <Button size="small"  color="primary" outlined rounded @click="saveNote">Save</Button>
          </div>
        </div>
      </div>
    </SlideupSelector>

    <SlideupSelector
      v-model="showReminderModal"
      :has-modal-background="true"
      :modal-background-transparent="true"
    >
      <div class="px-4 pt-4 pb-5">
        <div class="is-flex is-justify-content-center is-align-items-center">
          <div class="is-flex drag-bar"></div>
        </div>
        <div class="mt-4">
          <div class="mb-5">
            <div class="py-2 bottom-border has-text-weight-medium">
              <p style="color: #827d89">{{ today }}</p>
            </div>
            <div class="mt-2 px-4">
              <div
                class="columns is-mobile is-centered has-text-centered"
                style="position: relative"
              >
                <div class="column is-narrow">
                  <InfiniteTimePicker v-model="hour" :options="Hours" />
                </div>
                <div class="column is-narrow">
                  <InfiniteTimePicker v-model="minute" :options="Minutes" padZero />
                </div>
                <div class="column is-narrow">
                  <Button
                    class="am-pm-toggle has-text-weight-semibold"
                    color="transparent"
                    style="color: #827d89"
                    @click="togglePeriod"
                    >{{ period }}</Button
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="is-flex is-justify-content-space-between">
            <Button
              color="primary"
              label-color="primary"
              py="2"
              style="padding-left: 2.345rem; padding-right: 2.345rem"
              outlined
              @click="cancelNoteReminder"
              >Cancel</Button
            >
            <Button
              color="primary"
              label-color="light"
              py="2"
              style="padding-left: 2.7rem; padding-right: 2.7rem"
              @click="showReminderModal = false"
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
  border-bottom: 3px solid #efeef0;
}

:deep(.tiptap) {
  display: flex;
  flex-direction: column;
  border: none;
  background: transparent;
  resize: none;
  color: white;
  box-shadow: none;
  min-height: 120px;
  outline: none;
}

:deep(.tiptap p.is-editor-empty:first-child::before) {
  color: rgba(255, 255, 255, 0.65);
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}
</style>
