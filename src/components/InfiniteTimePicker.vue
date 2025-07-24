<template>
  <div ref="scrollContainer" class="time-scroll" @scroll="handleScroll">
    <div>
      <div
        v-for="(item, index) in visibleItems"
        :key="index"
        class="time-unit"
        :class="{ 'is-selected': item === modelValue }"
        @click="selectItem(item, $event)"
      >
        {{ padZero ? item.toString().padStart(2, '0') : item }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{
  modelValue: number,
  options: number[],
  padZero?: boolean
}>()
const emit = defineEmits(['update:modelValue'])

const scrollContainer = ref<HTMLElement | null>(null)
const ITEM_HEIGHT = 30
const visibleItems = ref<number[]>([])
const lastScrollTop = ref(0)
let scrollTimeout: ReturnType<typeof setTimeout> | null = null
let isClickScrolling = false


onMounted(() => {
  visibleItems.value = [...props.options, ...props.options, ...props.options]
  scrollToMiddle()
})

function scrollToMiddle() {
  if (scrollContainer.value) {
    const middle = props.options.length * ITEM_HEIGHT
    scrollContainer.value.scrollTop = middle
    lastScrollTop.value = middle
  }
}

function handleScroll() {
  if (!scrollContainer.value) return

  const container = scrollContainer.value
  const total = props.options.length * ITEM_HEIGHT
  const scrollTop = container.scrollTop
  const delta = scrollTop - lastScrollTop.value

  if (delta === 0) return

  if (scrollTop <= ITEM_HEIGHT && delta < 0) {
    container.scrollTop += total
    lastScrollTop.value = container.scrollTop
  } else if (scrollTop >= total * 2 - ITEM_HEIGHT && delta > 0) {
    container.scrollTop -= total
    lastScrollTop.value = container.scrollTop
  } else {
    lastScrollTop.value = scrollTop
  }

  if (scrollTimeout) clearTimeout(scrollTimeout)
  scrollTimeout = setTimeout(autoSnap, 120)
}

function autoSnap() {
  if (!scrollContainer.value || isClickScrolling) return

  const container = scrollContainer.value
  const scrollTop = container.scrollTop
  const containerHeight = container.clientHeight

  // Center Y offset in the scroll container
  const centerOffset = scrollTop + containerHeight / 2
  const centerIndex = Math.round(centerOffset / ITEM_HEIGHT)
  const snappedPosition = centerIndex * ITEM_HEIGHT - containerHeight / 2

  container.scrollTo({ top: snappedPosition, behavior: 'smooth' })

  // Wrap around safely
  const valueIndex = centerIndex % props.options.length
  const selectedValue = props.options[(valueIndex + props.options.length) % props.options.length]

  emit('update:modelValue', selectedValue)
}

function selectItem(item: number, event: MouseEvent) {
  isClickScrolling = true
  emit('update:modelValue', item)

  const el = event.currentTarget as HTMLElement
  el.scrollIntoView({ behavior: 'smooth', block: 'center' })

  // Reset the flag after some time (longer than smooth scroll duration)
  setTimeout(() => {
    isClickScrolling = false
  }, 400)
}

</script>

<style scoped>
.time-scroll {
  max-height: 11rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.time-unit {
  font-size: 1.25rem;
  opacity: 0.5;
  scroll-snap-align: center;
  cursor: pointer;
  transition: transform 0.6s ease, opacity 0.6s ease;
  height: 30px;
  line-height: 30px;
}

.time-unit.is-selected {
  font-size: 1.75rem;
  font-weight: bold;
  opacity: 1;
  color: black;
}
</style>
