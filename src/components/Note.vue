<script setup lang="ts">
import { useNoteDraftStore } from '@/stores/counter'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router';

defineProps<{ id_num?: number; fullVersion?: boolean }>()

// const emit = defineEmits(['viewNoteEvent'])

const notesStore = useNoteDraftStore()
const noteTitle = ref(notesStore.title)
const noteContent = ref(notesStore.content)
const selectedColor = ref(notesStore.color)
const fontStyle = ref(notesStore.font)
const scripture = ref(notesStore.scripture)


const router = useRouter()
const route = useRoute()

const viewNote = (id: number) => {
  if (route.name === 'search') {
    console.log("OnClick viewNote: id = ", id)
    // emit('viewNoteEvent', { id: id })
    router.push({ name: 'view-note', params: { noteId: id }})
  }
}

</script>

<template>
  <div class="box" @click="viewNote(id_num!)">
    <p class="has-text-centered">
      This is a recent <strong>note {{ id_num }}</strong> !!!
    </p>
  </div>
</template>

<style lang="css" scoped></style>
