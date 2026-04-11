<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useDatabaseStore } from '@/stores/db'

const dbStore = useDatabaseStore()

onMounted(() => {
  dbStore.init()
})
</script>

<template>
  <!-- <header>
    <div class="">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/onboard">Onboarding</RouterLink>
      </nav>
    </div>
  </header> -->

  <div v-if="!dbStore.isReady" class="loading-container">
    <div class="loader"></div>
    <p>Initializing Database...</p>
  </div>
  <RouterView v-else />
</template>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: white;
}
.loader {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 4px solid white;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
