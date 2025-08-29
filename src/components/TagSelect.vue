<script setup lang="ts">
import { useTagWorker } from '@/composables/useTagWorker'
import { useNoteDraftStore, useRecentTagsStore } from '@/stores/counter'
import { generateId } from '@/utils/utils'
import { computed, ref, watch } from 'vue'

const props = defineProps<{ tagSearch: string }>()

const searched = computed(() => props.tagSearch.trim())

/// store selected tag in the store someway
const recentTagsStore = useRecentTagsStore()
const recentTags = computed(() => recentTagsStore.recentTags)
const noteDraftStore = useNoteDraftStore()
const selectedTags = ref<string[]>(noteDraftStore.tags)
const tagAlreadySelected = computed(() => {
  return (tagLabel: string) => {
    const foundIndex = selectedTags.value.find(
      (t) => t.toLocaleLowerCase() === tagLabel.toLocaleLowerCase(),
    )
    if (foundIndex) return true
    return false
  }
})

const { isReady, results, searchSubstring } = useTagWorker()

function doSearch(item: string) {
  searchSubstring(item, 20)
}

function selectTag(tagLabel: string) {
  if (!tagAlreadySelected.value(tagLabel)) selectedTags.value.push(tagLabel)
  recentTagsStore.addToRecent({
    id: generateId(tagLabel),
    label: tagLabel,
    timestamp: new Date().getDate(),
  })
}

function removeTag(label: string) {
  const indexToRemove = selectedTags.value.findIndex((tag) => tag === label)
  if (indexToRemove !== -1) {
    selectedTags.value.splice(indexToRemove, 1)
    console.log('Tag Removed')
  }
}

watch(selectedTags, (newSelected) => {
  noteDraftStore.updateDraft({
    tags: newSelected,
  })
})

watch(searched, (newSearched) => {
  doSearch(newSearched)
})
</script>

<template>
  <div class="px-4">
    <div v-if="!isReady">⏳ Building index...</div>
    <div
      class="pb-3"
      v-if="isReady && tagSearch.length !== 0"
      style="border-bottom: 2px solid rgb(200 197 203 / 17%)"
    >
      <div style="margin-bottom: 0.5rem; margin-top: 1.25rem; width: 100%">
        <p class="is-family-secondary is-size-7" style="color: #c8c5cb">FOUND TAGS</p>
      </div>
      <div class="tags" style="gap: 12px">
        <div
          class="tag is-rounded custom-styled is-clickable"
          v-for="tagLabel in results"
          @click="selectTag(tagLabel)"
        >
          {{ tagLabel }}
        </div>
      </div>
    </div>

    <div v-show="selectedTags.length !== 0">
      <div style="margin-bottom: 0.5rem; margin-top: 1.25rem; width: 100%">
        <p class="is-family-secondary is-size-7" style="color: #c8c5cb">SELECTED TAGS</p>
      </div>
      <div class="tags" style="gap: 12px">
        <div class="tag is-rounded custom-styled" style="gap: 2px" v-for="tag in selectedTags">
          <span>{{ tag }}</span>
          <span class="is-clickable p-1" @click="removeTag(tag)"
            ><font-awesome-icon icon="fas fa-xmark"
          /></span>
        </div>
      </div>
    </div>

    <div v-show="tagSearch.length === 0">
      <div style="margin-bottom: 0.5rem; margin-top: 1.25rem; width: 100%">
        <p class="is-family-secondary is-size-7" style="color: #c8c5cb">RECENT TAGS</p>
      </div>
      <div class="tags" style="gap: 12px">
        <div
          class="tag is-rounded custom-styled is-clickable"
          v-for="tag in recentTags"
          @click="selectTag(tag.label)"
        >
          {{ tag.label }}
        </div>
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
