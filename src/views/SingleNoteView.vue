<script setup lang="ts">
import AppBar from '@/components/AppBar.vue';
import Note from '@/components/Note.vue';
import { onMounted, ref, watchEffect } from 'vue';

// const handleViewNoteEvent = (payload: any) => {
//     console.log("Received payload: ", payload)
// }

const props = defineProps<{noteId: string}>()

onMounted(() => {
    console.log("Passed Id as route param: ", props.noteId)
})

</script>

<template>
  <div>
    <AppBar title="New Note">
      <a class="navbar-item" @click="">
        <span> <font-awesome-icon icon="fa-solid fa-ellipsis fa-lg" /> </span>
      </a>
    </AppBar>
    <!-- <Note full-version @viewNoteEvent="handleViewNoteEvent"/> -->
    <Note full-version/>
  </div>
</template>

<style scoped></style>
