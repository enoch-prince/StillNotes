<script setup lang="ts">
defineProps<{modelValue: boolean, label: string}>()
const emit = defineEmits(['update:modelValue'])

function updateValue(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.checked)
}
</script>

<template>
  <div class="is-flex is-justify-content-space-between">
    <span class="is-family-secondary has-text-weight-medium">{{ label }}</span>
    <label class="switch toggle">
      <input 
        type="checkbox" 
        :checked="modelValue" 
        @change="updateValue" 
      />
      <span class="slider round"></span>
    </label>
  </div>
</template>

<style scoped>
/* Toggle slider override */
.switch.toggle {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 22px;
}

.switch.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider.round {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* background-color: #ccc; */
  background-color: #EFEEF0;
  transition: 0.9s;
  border-radius: 34px;
}

.slider.round::before {
  position: absolute;
  content: '';
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 3px;
  /* background-color: white; */
  background-color: #C8C5CB;
  transition: 0.9s;
  border-radius: 50%;
}

input:checked + .slider.round {
  /* background-color: #bcaaff; */
  background-color: #F5EDFF;
}

input:checked + .slider.round::before {
  transform: translateX(18px);
  background-color: var(--bulma-primary);
}
</style>
