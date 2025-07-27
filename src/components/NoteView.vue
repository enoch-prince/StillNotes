<script setup lang="ts">
import { useNoteDraftStore } from '@/stores/counter';
import { ref } from 'vue';

defineProps<{id_num?:number, fullVersion?: boolean}>()

const notesStore = useNoteDraftStore()
const noteTitle = ref(notesStore.title)
const noteContent = ref(notesStore.content)
const selectedColor = ref(notesStore.color)
const fontStyle = ref(notesStore.font)
const scripture = ref(notesStore.scripture)

</script>

<template>
    <div class="box">
        <p class="has-text-centered">This is a recent <strong>note {{ id_num }}</strong> !!! </p>
    </div>
</template>

<style lang="css" scoped>

</style>