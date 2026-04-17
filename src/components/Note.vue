<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router';
import type { INote } from '@/utils/custom_types';

const props = defineProps<{ 
  note?: INote; 
  id_num?: number; // Legacy support
  fullVersion?: boolean 
}>()

const router = useRouter()

const noteTitle = computed(() => props.note?.title || (props.id_num !== undefined ? `Note ${props.id_num}` : 'Untitled Note'))
const noteContent = computed(() => {
  if (props.note?.content) {
    return props.note.content.length > 50 
      ? props.note.content.substring(0, 50) + '...' 
      : props.note.content
  }
  return 'No content summary available...'
})

const viewNote = () => {
  const targetId = props.note?.id || props.id_num?.toString()
  if (targetId) {
    router.push({ name: 'view-note', params: { noteId: targetId }})
  }
}

</script>

<template>
  <div class="box note-card mb-4" :style="{ backgroundColor: note?.color || 'white' }" @click="viewNote">
    <div class="content">
      <h3 class="title is-5 mb-2" :class="{ 'has-text-white': note?.color }">{{ noteTitle }}</h3>
      <p class="is-family-secondary" :class="{ 'has-text-white': note?.color }">
        {{ noteContent }}
      </p>
    </div>
  </div>
</template>

<style lang="css" scoped>
.note-card {
  cursor: pointer;
  border-radius: 1rem;
  transition: transform 0.2s;
}
.note-card:hover {
  transform: translateY(-2px);
}
.has-text-white {
  color: white !important;
}
</style>
