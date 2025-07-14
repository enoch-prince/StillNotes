<script setup lang="ts">
import { ref, useId } from 'vue';

const emits = defineEmits(['selectQ'])
const id = useId();

const selected = ref(false);
const props = defineProps<{
    icon: string
    label: string
    color: string
}>()

function toggleSelection() {
  selected.value = !selected.value
  emits('selectQ', { label: props.label, selected: selected.value, id:id })
}

</script>

<template>
  <div class="flex-card is-clickable" @click="toggleSelection">
    <div class="is-flex is-flex-direction-row is-justify-content-space-between has-width-100">
      <span class="icon icon-layout">
        <font-awesome-icon :icon="props.icon"></font-awesome-icon>
      </span>
       <span
        class="icon is-small is-rounded-background-success transition-opacity"
        :class="{ 'opacity-0': !selected }"
      >
        <font-awesome-icon icon="fa-regular fa-circle-check" class="has-text-light"></font-awesome-icon>
      </span>
    </div>
    <div>
      <p class="is-family-secondary is-size-6-touch has-text-weight-semibold has-text-centered">
        {{ props.label }}
      </p>
    </div>
  </div>
</template>


<style scoped>

.flex-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem 0.5rem;
  gap: 0.875rem;
  width: auto;
  height: 8.5rem;/*136px;*/

  background: v-bind('props.color');
  border-radius: 0.5rem;
}


.icon-layout {
  display: flex;
  padding: 0.75rem;
  margin: 0 auto; /* top-bottom left-right  */
  width: 2.875rem;
  height: 2.875rem;
  background: #ffffff;
  border-radius: 100%;
  transform: translateX(0.5rem); /* ⬅ shift to the right */
}

.is-rounded-background-success {
    border-radius: 100%;
    background-color: var(--bulma-success);
}

.has-width-100 {
    width: 100%;
}

.transition-opacity {
  transition: opacity 0.3s ease;
}

.opacity-0 {
  opacity: 0;
}

</style>