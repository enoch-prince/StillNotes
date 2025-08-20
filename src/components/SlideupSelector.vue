<script setup lang="ts">
import AppBar from './AppBar.vue';

defineProps<{
  hasModalBackground?: boolean
}>()

const emit = defineEmits(['update:modelValue', 'no'])

function close() {
  emit('update:modelValue', false)
}

function handleNo() {
  emit('no')
  close()
}
</script>

<template>
  <!-- <Teleport to="body">
    <transition name="slide-up"> -->
      <div>
        <div v-if="hasModalBackground" class="" @click="handleNo"></div>
        <AppBar v-else title="Chapter" @back="handleNo"/>
        <div
          :class="{'modal-content is-flex-direction-column': hasModalBackground}"  
          class="bottom-modal-content is-flex is-justify-content-center is-align-items-center p-5"
        >
          <div class="mb-5">
            <slot name="content" />
          </div>
          <div class="is-flex is-justify-content-space-between" style="width: 100%">
            <slot name="buttons" />
          </div>
        </div>

        <button v-if="hasModalBackground" class="modal-close is-large" aria-label="close" @click="handleNo"></button>
      </div>
    <!-- </transition>
  </Teleport> -->
</template>

<style scoped>
.bottom-modal-content {
  /* position: fixed; */
  /* bottom: 0; */
  /* left: 0; */
  /* border-top-left-radius: 1rem; */
  /* border-top-right-radius: 1rem; */
  max-width: 100vw;
  height: 100%;
  /* padding: 1.5rem; */
  /* width: 85%; */
  /* border-radius: 1rem; */
  background: white;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  animation: float-up 0.3s ease-out;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.slide-up-enter-to,
.slide-up-leave-from {
  transform: translateY(0%);
  opacity: 1;
}
</style>
