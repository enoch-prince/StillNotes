<script setup lang="ts">
import NoteView from '@/components/NoteView.vue';
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
  else if (previousRoute.value?.name === 'home') {
    point_to.value = 'notes'
  }
  else {
    point_to.value = 'tags'
  }
})

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
          <NoteView v-for="item in [0, 1, 2, 3, 4]" :id_num="item"/>  
        </div>
        
    </div>
</template>

<style lang="css" scoped>

</style>