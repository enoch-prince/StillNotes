<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const emit = defineEmits<{
  (e: 'fab'): void,
  // (e: 'navi'): (id: string) => void
}>()

const router = useRouter()
const route = useRoute()

// Define navigation tabs and their paths
const navItems = [
  { id: 'home', icon: ['fas', 'home'], path: '/' },
  { id: 'flame', icon: ['fas', 'fire'], path: '/trending' },
  { id: 'search', icon: ['fas', 'search'], path: '/search' },
  { id: 'settings', icon: ['fas', 'gear'], path: '/settings' }
]

function goTo(path: string) {
  // emit('navi')
  router.push(path)
}
</script>

<template>
  <nav class="bottom-nav has-background-white px-4 py-2">
    <div class="is-flex is-justify-content-space-between is-align-items-center is-relative">
      <!-- Left two icons -->
      <div class="is-flex is-align-items-center" style="gap: 2rem;">
        <span
          v-for="item in navItems.slice(0, 2)"
          :key="item.id"
          class="icon is-medium is-clickable"
          :class="{
            'has-text-primary': route.path === item.path,
            'has-text-grey-dark': route.path !== item.path
          }"
          @click="goTo(item.path)"
        >
          <font-awesome-icon :icon="item.icon" class="fas fa-lg"/>
        </span>
      </div>

      <!-- Floating FAB -->
      <div class="fab" @click="emit('fab')">
        <span class="icon is-medium has-text-white">
          <font-awesome-icon icon="fas fa-plus" class="fas fa-lg"/>
        </span>
      </div>

      <!-- Right two icons -->
      <div class="is-flex is-align-items-center" style="gap: 2rem;">
        <span
          v-for="item in navItems.slice(2)"
          :key="item.id"
          class="icon is-medium is-clickable"
          :class="{
            'has-text-primary': route.path === item.path,
            'has-text-grey-dark': route.path !== item.path
          }"
          @click="goTo(item.path)"
        >
          <font-awesome-icon :icon="item.icon" class="fas fa-lg"/>
        </span>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  /* border-top: 2px solid #cfc0ff; */
  /* border-radius: 1.25rem 1.25rem 0 0; */
  z-index: auto;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.fab {
  position: absolute;
  top: -1.75rem;
  left: 50%;
  transform: translateX(-50%);
  background-color: #bcaaff;
  border-radius: 50%;
  width: 3.5rem;
  height: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid white;
  /* box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15); */
  cursor: pointer;
}
</style>
