<script setup lang="ts">
import Note from '@/components/Note.vue';
import ScriptureSelect from '@/components/ScriptureSelect.vue';
import TagSelect from '@/components/TagSelect.vue';
import { useNavigationStore } from '@/stores/counter';
import { computed, ref, watchEffect } from 'vue';

type PointTo = 'notes' | 'scripture' | 'tags' | null
const point_to = ref<PointTo>(null);
const navStore = useNavigationStore()
const previousRoute = computed(() => navStore.previousRoute)

watchEffect(() => {
  if (previousRoute.value?.name === 'add-note') {
    point_to.value = 'scripture'
  }
  else if (previousRoute.value?.name === 'home' || previousRoute.value?.name === 'view-note' ) {
    point_to.value = 'notes'
  }
  else {
    point_to.value = 'tags'
  }
})

const handleViewNoteEvent = (payload: any) => {
    console.log("Received payload: ", payload)
}

</script>

<template>
    <div>
        <div class="box">
            <p class="has-text-centered">
            Search Input
            </p>
        </div>
        <ScriptureSelect v-if="point_to === 'scripture'" />
        <TagSelect v-if="point_to === 'tags'" />
        <div v-if="point_to === 'notes'">
          <Note v-for="item in [0, 1, 2, 3, 4]" :id_num="item"/>  
        </div>
        
    </div>
</template>

<style lang="css" scoped>

</style>