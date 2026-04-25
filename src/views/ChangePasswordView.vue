<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppBar from '@/components/AppBar.vue'

const router = useRouter()

const currentPassword = ref('')
const newPassword = ref('')
const retypeNewPassword = ref('')

const handleBack = () => {
  router.back()
}

const submitNewPassword = () => {
  // Add password change logic here later
  router.back()
}
</script>

<template>
  <div class="change-password-page pb-6">
    <AppBar title="Change Password" hasBackIconLabel @back="handleBack" />

    <div class="container px-4 mt-5">
      <p class="is-size-7 has-text-primary has-text-weight-medium mb-3">Please input your current password first</p>

      <div class="field mb-5">
        <label class="label has-text-weight-medium is-family-secondary is-size-6">Current Password</label>
        <div class="control">
          <input 
            class="input is-rounded has-background-light has-text-weight-medium is-family-secondary py-4" 
            type="password" 
            v-model="currentPassword"
            placeholder="********" 
            style="border: none; box-shadow: none;"
          />
        </div>
      </div>

      <p class="is-size-7 has-text-primary has-text-weight-medium mb-3 mt-6">Now, create your new password</p>

      <div class="field mb-5">
        <label class="label has-text-weight-medium is-family-secondary is-size-6">New Password</label>
        <div class="control">
          <input 
            class="input is-rounded has-background-light has-text-weight-medium is-family-secondary py-4" 
            type="password" 
            v-model="newPassword"
            placeholder="********"
            style="border: none; box-shadow: none;"
          />
        </div>
        <p class="help has-text-grey mt-2" style="font-size: 0.75rem;">
          Password should contain a-z, A-Z, 0-9
        </p>
      </div>

      <div class="field mb-6">
        <label class="label has-text-weight-medium is-family-secondary is-size-6">Retype New Password</label>
        <div class="control">
          <input 
            class="input is-rounded has-background-light has-text-weight-medium is-family-secondary py-4" 
            type="password" 
            v-model="retypeNewPassword"
            placeholder="********"
            style="border: none; box-shadow: none;"
          />
        </div>
      </div>

      <button 
        class="button is-primary is-rounded is-fullwidth has-text-weight-bold is-family-secondary mt-6 py-5 is-flex is-justify-content-space-between" 
        style="height: 56px; padding-left: 2rem; padding-right: 2rem;"
        @click="submitNewPassword"
      >
        <span>Submit New Password</span>
        <font-awesome-icon icon="fa-solid fa-arrow-right" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.input.has-background-light {
  background-color: #F5EDFF !important;
}

.button.is-primary {
  display: flex !important;
  align-items: center;
}
</style>
