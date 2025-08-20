<script setup lang="ts">
import AppBar from '@/components/AppBar.vue';
import Note from '@/components/Note.vue';
import { onMounted, ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps<{noteId: string}>()

const router = useRouter()

const goBack = () => {
  router.back()
}


onMounted(() => {
    console.log("Passed Id as route param: ", props.noteId)
})

</script>

<template>
  <div>
    <AppBar title="New Note" @back="goBack">
      <a class="navbar-item" @click="">
        <span> <font-awesome-icon icon="fa-solid fa-ellipsis fa-lg" /> </span>
      </a>
    </AppBar>
    <Note :id_num="Number(noteId)" full-version/>
  </div>
</template>

<style scoped></style>
