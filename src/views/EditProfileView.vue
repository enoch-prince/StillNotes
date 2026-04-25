<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppBar from '@/components/AppBar.vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const fullName = ref('')
const email = ref('')

const handleBack = () => {
  router.back()
}

const saveChanges = async () => {
  await userStore.saveProfile({
    fullName: fullName.value,
    email: email.value
  })
  router.back()
}

onMounted(async () => {
  await userStore.loadProfile()
  fullName.value = userStore.profile.fullName
  email.value = userStore.profile.email
})
</script>

<template>
  <div class="edit-profile-page pb-6">
    <AppBar title="Edit Profile" hasBackIconLabel @back="handleBack" />

    <div class="container px-4 mt-4">
      <!-- Avatar Section -->
      <div class="is-flex is-flex-direction-column is-align-items-center mb-6">
        <div class="avatar-container mb-3">
          <img v-if="userStore.profile.avatar" :src="userStore.profile.avatar" class="avatar-img" />
          <div v-else class="avatar-placeholder has-background-grey-lighter is-flex is-align-items-center is-justify-content-center">
            <font-awesome-icon icon="fa-solid fa-user" class="has-text-grey" size="3x" />
          </div>
        </div>
        
        <button class="button is-rounded is-small is-outlined is-primary is-light has-text-primary has-background-white is-family-secondary has-text-weight-bold" style="border-color: #bcaaff;">
          <font-awesome-icon icon="fa-regular fa-image" class="mr-2" />
          Change Image
        </button>
      </div>

      <!-- Form Section -->
      <div class="field mb-5">
        <label class="label has-text-weight-medium is-family-secondary is-size-6">Full Name</label>
        <div class="control">
          <input 
            class="input is-rounded has-background-light has-text-weight-medium is-family-secondary py-4" 
            type="text" 
            v-model="fullName"
            placeholder="Enter your full name" 
            style="border: none; box-shadow: none;"
          />
        </div>
      </div>

      <div class="field mb-6">
        <label class="label has-text-weight-medium is-family-secondary is-size-6">Email Address</label>
        <div class="control">
          <input 
            class="input is-rounded has-background-light has-text-weight-medium is-family-secondary py-4" 
            type="email" 
            v-model="email"
            placeholder="Enter your email address"
            style="border: none; box-shadow: none;"
          />
        </div>
        <p class="help has-text-grey mt-2" style="font-size: 0.75rem; line-height: 1.4;">
          Changing your email address information here means you need to re-login to the app.
        </p>
      </div>

      <button 
        class="button is-primary is-rounded is-fullwidth has-text-weight-bold is-family-secondary mt-6 py-5" 
        style="height: 56px;"
        @click="saveChanges"
      >
        <font-awesome-icon icon="fa-solid fa-check" class="mr-2" />
        Save Changes
      </button>
    </div>
  </div>
</template>

<style scoped>
.avatar-container {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #f5f5f5;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
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

.input.has-background-light {
  background-color: #F5EDFF !important;
}
</style>
