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

// High quality design placeholder data
const dummyFeedNotes: FeedNote[] = [
  {
    id: '1',
    title: '🚶 Walk by faith',
    content: 'Today iam reflectingtrusting in what you cannot see, knowing that each step guided by belief will lead to a purpose far greater than doubt. Embrace the unseen, for it is where true strength and hope reside.',
    scripture: 'Hebrews 1:11',
    color: '#AEA1F9',
    tag: 'Faith',
    user: {
      avatar: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      name: 'UserName'
    },
    stats: {
      likes: '100k',
      comments: '100k'
    }
  },
  {
    id: '2',
    title: '❤️ Boundless love',
    content: 'Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It does not dishonor others, it is not self-seeking.',
    scripture: '1 Corinthians 13:4',
    color: '#FFA09F',
    tag: 'Love',
    user: {
      avatar: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      name: 'UserName'
    },
    stats: {
      likes: '85k',
      comments: '40k'
    }
  },
  {
    id: '3',
    title: '✨ Embrace your purpose',
    content: 'God has carefully placed you exactly where you are today. You are fearfully and wonderfully made for a distinct reason.',
    scripture: 'Psalm 139:14',
    color: '#75C7F8',
    tag: 'Purpose',
    user: {
      avatar: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      name: 'UserName'
    },
    stats: {
      likes: '42k',
      comments: '12k'
    }
  },
  {
    id: '4',
    title: '🙏🏽 Quiet prayer',
    content: 'In the stillness of the morning, I find my peace. Through prayer, we connect intimately with the source of all grace.',
    scripture: 'Philippians 4:6',
    color: '#6BEEC3',
    tag: 'Prayer',
    user: {
      avatar: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      name: 'UserName'
    },
    stats: {
      likes: '12k',
      comments: '1k'
    }
  },
  {
    id: '5',
    title: '🙌 Lift up in Worship',
    content: 'Worship is more than a song; it is the posture of a surrendered heart. Let every breath be a testament to His glory.',
    scripture: 'John 4:24',
    color: '#F8C715',
    tag: 'Worship',
    user: {
      avatar: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      name: 'UserName'
    },
    stats: {
      likes: '50k',
      comments: '18k'
    }
  }
]

const filteredNotes = computed(() => {
    if (!activeTag.value) return dummyFeedNotes
    return dummyFeedNotes.filter(note => note.tag === activeTag.value)
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