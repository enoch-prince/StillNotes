<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import AppBar from '@/components/AppBar.vue';
import ScriptureSearch from '@/components/ScriptureSearch.vue';
import TagSelect from '@/components/TagSelect.vue';
import BottomNavBar from '@/components/BottomNavBar.vue';
import FeedNoteCard, { type FeedNote } from '@/components/FeedNoteCard.vue';
import { useGlobalStatesStore, useNavigationStore } from '@/stores/counter';
import type { PointTo } from '@/utils/custom_types';

const point_to = ref<PointTo>(null);
const navStore = useNavigationStore()
const globalStatesStore = useGlobalStatesStore()
const previousRoute = computed(() => navStore.previousRoute)
const addVerseClicked = computed(() => globalStatesStore.addVerseClicked)
const tagNoteClicked = computed(() => globalStatesStore.tagNoteClicked)

const searchWord = ref('')
const activeTag = ref('')

const tagsList = ['Love', 'Faith', 'Purpose', 'Worship', 'Prayer']

import { useSavedNotesStore } from '@/stores/counter';
import { useUserStore } from '@/stores/user';
import type { INote } from '@/utils/custom_types';

const savedNotesStore = useSavedNotesStore()
const userStore = useUserStore()

const mapToFeedNote = (note: INote): FeedNote => {
  const scriptureText = note.scripture?.length 
    ? `${note.scripture[0].book} ${note.scripture[0].chapter}:${note.scripture[0].verse}`
    : 'No scripture'

  return {
    id: note.id || String(Date.now()),
    title: note.title,
    content: note.content,
    scripture: scriptureText,
    color: note.color || '#AEA1F9',
    tag: note.tags?.length ? note.tags[0] : 'Note',
    user: {
      avatar: userStore.profile.avatar || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      name: userStore.profile.fullName || 'User'
    },
    stats: {
      likes: '0',
      comments: '0'
    }
  }
}

const filteredNotes = computed(() => {
    let result = savedNotesStore.notes

    if (activeTag.value) {
        result = result.filter(note => note.tags?.includes(activeTag.value))
    }

    if (searchWord.value) {
        const query = searchWord.value.toLowerCase()
        result = result.filter(note => 
            note.title.toLowerCase().includes(query) || 
            note.content.toLowerCase().includes(query)
        )
    }

    return result.map(mapToFeedNote)
})

watchEffect(() => {
  if (previousRoute.value?.name === 'add-note' && addVerseClicked.value) {
    point_to.value = 'scripture'
  }
  else if (previousRoute.value?.name === 'add-note' && tagNoteClicked.value) {
    point_to.value = 'tags'
  }
  else {
    point_to.value = 'notes'
  }
})

const router = useRouter()

const goBack = () => {
  globalStatesStore.tagNoteClicked = false
  globalStatesStore.addVerseClicked = false
  if (point_to.value === 'tags') globalStatesStore.showAddNoteSettings = true
  router.back()
}
</script>

<template>
  <div class="search-view-container is-relative">
    <AppBar v-model="searchWord" @back="goBack" class="mb-4"/>

    <ScriptureSearch v-if="point_to === 'scripture'" :scripture-search="searchWord"/>
    <TagSelect v-else-if="point_to === 'tags'" :tag-search="searchWord" />
    
    <div v-else-if="point_to === 'notes'" class="notes-feed">
      <!-- Tag Filters row -->
      <div 
        class="tags-row is-flex px-4 mb-4" 
        style="overflow-x: auto; white-space: nowrap; gap: 0.6rem; -webkit-overflow-scrolling: touch;"
      >
        <div 
          v-for="tag in tagsList" 
          :key="tag"
          class="tag is-rounded is-clickable px-4 py-4 is-family-secondary is-size-6"
          :style="{
             border: activeTag === tag ? '1px solid transparent' : '1px solid #bba3ff',
             backgroundColor: activeTag === tag ? '#AEA1F9' : 'transparent',
             color: activeTag === tag ? 'white' : '#827D89'
          }"
          @click="activeTag = activeTag === tag ? '' : tag"
        >
          {{ tag }}
        </div>
      </div>
      
      <!-- Feed -->
      <div class="px-5 pb-6">
        <template v-if="filteredNotes.length">
            <FeedNoteCard v-for="note in filteredNotes" :key="note.id" :note="note"/>
        </template>
        <template v-else>
            <div class="has-text-centered has-text-grey mt-6 is-family-secondary">
                No public notes found for this category.
            </div>
        </template>
      </div>

      <BottomNavBar class="z-index-2" />
    </div>
  </div>
</template>

<style scoped>
.search-view-container {
    background-color: #fafbfc;
    min-height: 100vh;
    padding-bottom: 90px; /* space for BottomNavBar */
}
.tags-row::-webkit-scrollbar {
    display: none;
}
.tags-row {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
.z-index-2 {
    z-index: 2;
}
</style>