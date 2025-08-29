<script setup lang="ts">
import AppBar from '@/components/AppBar.vue';
import Note from '@/components/Note.vue';
import ScriptureSearch from '@/components/ScriptureSearch.vue';
import TagSelect from '@/components/TagSelect.vue';
import { useGlobalStatesStore, useNavigationStore } from '@/stores/counter';
import { computed, ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';

type PointTo = 'notes' | 'scripture' | 'tags' | null
const point_to = ref<PointTo>(null);
const navStore = useNavigationStore()
const globalStatesStore = useGlobalStatesStore()
const previousRoute = computed(() => navStore.previousRoute)
const addVerseClicked = computed(() => globalStatesStore.addVerseClicked)
const tagNoteClicked = computed(() => globalStatesStore.tagNoteClicked)

const searchWord = ref('')

watchEffect(() => {
  if (previousRoute.value?.name === 'add-note' && globalStatesStore.addVerseClicked) {
    point_to.value = 'scripture'
  }
  else if (previousRoute.value?.name === 'add-note' && globalStatesStore.tagNoteClicked) {
    point_to.value = 'tags'
  }
  else if (previousRoute.value?.name === 'home' || previousRoute.value?.name === 'view-note' ) {
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
    <div>
        <AppBar v-model="searchWord" @back="goBack"/> <!-- By default AppBar without 'title' prop comes with a search input -->
        <ScriptureSearch v-if="point_to === 'scripture'" :scripture-search="searchWord"/>
        <TagSelect v-if="point_to === 'tags'" :tag-search="searchWord" />
        <div v-if="point_to === 'notes'">
          <Note v-for="item in [0, 1, 2, 3, 4]" :key="item" :id_num="item"/>  
        </div>
        
    </div>
</template>

<style lang="css" scoped>

</style>