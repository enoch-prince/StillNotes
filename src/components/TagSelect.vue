<script setup lang="ts">
import { useTagWorker } from '@/composables/useTagWorker';
import { useNoteDraftStore, useRecentTagsStore } from '@/stores/counter';
import { computed, ref, watch } from 'vue';

const props = defineProps<{ tagSearch: string }>()

const searched = computed(() => props.tagSearch.trim())

/// store selected tag in the store someway
const recentTagsStore = useRecentTagsStore()
const recentTags = computed(() => recentTagsStore.recentTags)
const noteDraftStore = useNoteDraftStore()
const selectedTags = ref<string[]>(noteDraftStore.tags)

const { isReady, results, searchSubstring } = useTagWorker();

function doSearch(item: string) {
    searchSubstring(item, 20);
}

watch(selectedTags, (newSelected) => {
    noteDraftStore.updateDraft({
        tags: newSelected
    })
})

watch(searched, (newSearched) => {
    doSearch(newSearched)
})

</script>

<template>
  <div class="px-4">
    <div v-if="!isReady">⏳ Building index...</div>
    <div v-else>Results: {{ results }}</div>
    <div style="margin-bottom: 1.25rem; width: 100%">
      <p class="is-family-secondary is-size-7" style="color: #c8c5cb">RECENT TAGS</p>
    </div>
    <div class="tags" style="gap: 12px">
      <div
        class="tag is-rounded custom-styled is-clickable"
        v-for="tag in recentTags"
        @click="selectedTags.push(tag.label)"
      >
        {{ tag }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-styled {
  background-color: transparent;
  border: 1px solid #8080805e;
  color: grey;
}
</style>
