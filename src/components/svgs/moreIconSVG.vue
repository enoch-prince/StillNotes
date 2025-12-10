<script setup lang="ts">
defineProps({
  size: {
    type: [String, Number],
    default: 24,
  },
  color: {
    type: String,
    default: 'currentColor',
  },
})
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 23 23"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="5.90744" cy="10.5403" r="1.37937" :fill="color" />
    <circle cx="10.9651" cy="10.5403" r="1.37937" :fill="color" />
    <circle cx="16.0228" cy="10.5403" r="1.37937" :fill="color" />
  </svg>
</template>
