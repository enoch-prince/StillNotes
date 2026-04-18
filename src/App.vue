<script setup lang="ts">
import { onMounted, watch, ref } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { useDatabaseStore } from '@/stores/db'
import { useAuthStore, useOnboardingStore, useQuestionaireStore } from '@/stores/counter'

const dbStore = useDatabaseStore()
const authStore = useAuthStore()
const questionaireStore = useQuestionaireStore()
const router = useRouter()

const showSplash = ref(true)

onMounted(async () => {
  await dbStore.init()
  
  // Guarantee splash screen shows for at least 1.5 seconds visually
  setTimeout(() => {
    showSplash.value = false
    checkRouting()
  }, 1500)
})

const checkRouting = () => {
    if (!dbStore.isReady || !authStore.isReady) {
        const unwatch = watch([() => dbStore.isReady, () => authStore.isReady], ([dbReady, authReady]) => {
            if (dbReady && authReady) {
                unwatch()
                performRouting()
            }
        })
    } else {
        performRouting()
    }
}

const performRouting = () => {
    if (!authStore.isAuthenticated) {
        // Ensure unauthenticated users are at onboarding / login routes
        const path = router.currentRoute.value.path
        if (!['/login', '/register', '/onboard', '/otp', '/forgot-password', '/new-password'].includes(path)) {
            router.push('/onboard')
        }
    } else {
        // Authenticated: Check onboarding logic so we don't nag too much
        const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000
        const daysSinceSkipped = Date.now() - (questionaireStore.lastSkippedAt || 0)
        
        const path = router.currentRoute.value.path
        
        if (!questionaireStore.completed && daysSinceSkipped > SEVEN_DAYS && path !== '/questionaire') {
           router.push('/questionaire')
        } else if (['/login', '/register', '/onboard', '/otp', '/forgot-password', '/new-password'].includes(path)) {
           router.push('/')
        }
    }
}
</script>

<template>
  <div v-if="showSplash" class="splash-container custom-background">
      <p class="is-size-2 is-family-secondary has-text-primary-100 splash-text">
        StillNotes
      </p>
  </div>
  <RouterView v-else />
</template>

<style scoped>
.splash-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
}
.custom-background {
  background: linear-gradient(-180deg, rgba(205, 194, 255, 1) 0%, rgba(167, 149, 248, 1) 100%);
}
.splash-text {
  animation: fadeIn 1.2s ease-in-out;
}
@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
</style>
