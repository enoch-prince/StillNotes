<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppBar from '@/components/AppBar.vue'
import BottomNavBar from '@/components/BottomNavBar.vue'
import SlideUpPromptModal from '@/components/SlideUpPromptModal.vue'
import SlideupSelector from '@/components/SlideupSelector.vue'
import ToggleSlider from '@/components/ToggleSlider.vue'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

const router = useRouter()
const userStore = useUserStore()
const { profile } = storeToRefs(userStore)

const showLogoutModal = ref(false)
const showNotificationsModal = ref(false)

const handleBack = () => {
  router.back()
}

const goToEditProfile = () => {
  router.push('/edit-profile')
}

const goToChangePassword = () => {
  router.push('/change-password')
}

const handleLogout = () => {
  // Add logout logic here later
  showLogoutModal.value = false
  router.push('/login')
}

onMounted(async () => {
  await userStore.loadProfile()
})
</script>

<template>
  <div class="settings-page pb-6 mb-6">
    <AppBar title="Settings" hasBackIconLabel @back="handleBack" />

    <div class="container px-4">
      <!-- User Profile Card -->
      <div class="is-flex is-align-items-center mb-5">
        <div class="avatar-container mr-4">
          <img v-if="profile.avatar" :src="profile.avatar" class="avatar-img" />
          <div v-else class="avatar-placeholder has-background-grey-lighter is-flex is-align-items-center is-justify-content-center">
            <font-awesome-icon icon="fa-solid fa-user" class="has-text-grey" size="2x" />
          </div>
        </div>
        <div>
          <h2 class="title is-5 mb-1 has-text-weight-bold">{{ profile.fullName }}</h2>
          <p class="subtitle is-7 has-text-grey mb-0">
            <font-awesome-icon icon="fa-solid fa-envelope-circle-check" class="mr-1" />
            {{ profile.email }}
          </p>
        </div>
      </div>
      
      <button class="button is-rounded is-fullwidth is-outlined is-primary is-light has-text-primary has-background-white is-family-secondary has-text-weight-bold mb-6" style="border-color: #bcaaff;" @click="goToEditProfile">
        <font-awesome-icon icon="fa-regular fa-pen-to-square" class="mr-2" />
        Edit Profile
      </button>

      <!-- Settings Menu -->
      <div class="settings-menu mb-6">
        <p class="is-size-7 has-text-grey mb-3">SETTINGS</p>
        
        <div class="menu-item is-flex is-justify-content-space-between is-align-items-center py-4 is-clickable" @click="goToChangePassword">
          <div class="is-flex is-align-items-center">
            <font-awesome-icon icon="fa-solid fa-lock" class="has-text-grey mr-3" />
            <span class="has-text-weight-medium is-family-secondary">Change Password</span>
          </div>
          <font-awesome-icon icon="fa-solid fa-chevron-right" class="has-text-grey-light" />
        </div>

        <div class="menu-item is-flex is-justify-content-space-between is-align-items-center py-4">
          <div class="is-flex is-align-items-center">
            <font-awesome-icon icon="fa-solid fa-font" class="has-text-grey mr-3" />
            <span class="has-text-weight-medium is-family-secondary">Text Size</span>
          </div>
          <span class="has-text-grey is-size-7">{{ profile.textSize }}</span>
        </div>

        <div class="menu-item is-flex is-justify-content-space-between is-align-items-center py-4 is-clickable" @click="showNotificationsModal = true">
          <div class="is-flex is-align-items-center">
            <font-awesome-icon icon="fa-regular fa-bell" class="has-text-grey mr-3" />
            <span class="has-text-weight-medium is-family-secondary">Notifications</span>
          </div>
          <span class="has-text-grey is-size-7">{{ profile.emailNotifications ? 'All active' : 'None' }}</span>
        </div>

        <div class="menu-item is-flex is-justify-content-space-between is-align-items-center py-4 mt-2 is-clickable" @click="showLogoutModal = true">
          <div class="is-flex is-align-items-center">
            <font-awesome-icon icon="fa-solid fa-arrow-right-from-bracket" class="has-text-danger mr-3" style="transform: scaleX(-1);" />
            <span class="has-text-weight-bold has-text-danger is-family-secondary">Log Out</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Log Out Modal -->
    <SlideUpPromptModal v-model="showLogoutModal" @no="showLogoutModal = false">
      <template #title>
        <div class="has-text-centered">
          <h3 class="title is-5 mb-2">Log Out</h3>
          <p class="has-text-grey is-size-6" style="line-height: 1.4;">Are you sure you want to log<br/>out from the application?</p>
        </div>
      </template>
      <template #buttons>
        <button class="button is-rounded is-light has-text-primary has-background-white is-outlined" style="border-color: #bcaaff; width: 48%;" @click="showLogoutModal = false">Cancel</button>
        <button class="button is-rounded is-primary" style="width: 48%;" @click="handleLogout">Yes</button>
      </template>
    </SlideUpPromptModal>

    <!-- Notifications Modal -->
    <SlideupSelector v-model="showNotificationsModal" hasModalBackground modalBackgroundTransparent>
      <div class="p-5">
        <ToggleSlider v-model="profile.emailNotifications" label="Email Notifications" @change="userStore.saveProfile({ emailNotifications: profile.emailNotifications })" />
        <div class="mt-5 is-flex is-align-items-center is-clickable has-text-danger" style="margin-top: 2rem !important;">
          <font-awesome-icon icon="fa-regular fa-trash-can" class="mr-3" />
          <span class="has-text-weight-medium is-family-secondary">Delete Note</span>
        </div>
      </div>
    </SlideupSelector>

    <BottomNavBar @fab="router.push('/note')" />
  </div>
</template>

<style scoped>
.avatar-container {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #f5f5f5;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.menu-item {
  border-bottom: 1px solid #f5f5f5;
}

.menu-item:last-child {
  border-bottom: none;
}
</style>