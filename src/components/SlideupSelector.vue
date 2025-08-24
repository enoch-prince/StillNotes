<script setup lang="ts">
import { computed, useSlots } from 'vue'

const props = defineProps<{
  modelValue: boolean
  hasModalBackground?: boolean
  modalBackgroundTransparent?: boolean
}>()

const showBackgroundContent = computed(() => props.hasModalBackground || !!useSlots().extra)

const modalBackgroundClasses = computed(() => {
  if (props.modalBackgroundTransparent) return 'modal-background-transparent'
  else return 'modal-background'
})

const emit = defineEmits(['update:modelValue'])

function close() {
  emit('update:modelValue', false)
}
</script>

<template>
  <Teleport to="body">
    <transition name="slide-up">
      <div v-if="modelValue" class="modal is-active">
        <div v-show="hasModalBackground" :class="modalBackgroundClasses" @click="close">
          <div v-if="showBackgroundContent">
            <slot name="extra"></slot>
          </div>
        </div>
        <!-- <div
          :class="{'modal-content is-flex-direction-column': hasModalBackground}"  
          class="bottom-modal-content is-flex is-justify-content-center is-align-items-center p-5"
        > -->
        <div class="modal-card bottom-modal-content">
          <slot></slot>
        </div>

        <button
          v-if="hasModalBackground"
          class="modal-close is-large"
          aria-label="close"
          @click="close"
        ></button>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.bottom-modal-content {
  z-index: 100;
  position: absolute;
  bottom: 0;
  width: 100%;
  max-width: 100vw;
  min-height: calc(0.3 * 100vh);
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
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

.modal-background-transparent {
  background-color: hsla(220, 14%, 4%, 0.219);
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
}
</style>
