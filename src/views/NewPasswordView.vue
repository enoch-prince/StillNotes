<script setup lang="ts">
import Button from '@/components/Button.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const newPassword = ref('')
const confirmPassword = ref('')
const showSuccessModal = ref(false)

const handleCreatePassword = () => {
  if (newPassword.value !== confirmPassword.value) {
    alert('Passwords do not match')
    return
  }
  // TODO: Implement password reset logic
  console.log('Creating new password')
  showSuccessModal.value = true
}

const handleLoginRedirect = () => {
  showSuccessModal.value = false
  router.push('/login')
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-header">
      <div class="back-button mb-4">
        <router-link to="/otp" class="has-text-black">
          <span class="icon">
            <i class="fas fa-chevron-left"></i>
          </span>
          <span class="is-family-secondary">Back</span>
        </router-link>
      </div>
      <h1 class="title is-4 is-family-primary">Create a New Password</h1>
      <p class="subtitle is-6 is-family-secondary has-text-grey">
        Enter your new password to access the account
      </p>
    </div>

    <form @submit.prevent="handleCreatePassword" class="auth-form">
      <div class="field">
        <label class="label is-family-secondary">New Password</label>
        <div class="control">
          <input
            v-model="newPassword"
            class="input is-rounded-4 has-background-light-purple"
            type="password"
            placeholder="********"
            required
          />
        </div>
      </div>

      <div class="field">
        <label class="label is-family-secondary">Confirm Password</label>
        <div class="control">
          <input
            v-model="confirmPassword"
            class="input is-rounded-4 has-background-light-purple"
            type="password"
            placeholder="********"
            required
          />
        </div>
      </div>

      <div class="field mt-5">
        <Button
          color="primary"
          full-width
          rounded
          type="submit"
          label-color="white"
          label-size="normal"
        >
          Create Password
        </Button>
      </div>
    </form>

    <!-- Success Modal -->
    <div class="modal" :class="{ 'is-active': showSuccessModal }">
      <div class="modal-background"></div>
      <div class="modal-content has-text-centered p-5 has-background-white is-rounded-4">
        <div class="mb-4">
            <!-- Placeholder for Success Image -->
             <img src="@/assets/logo.svg" alt="Success" style="width: 80px; height: 80px;">
        </div>
        <h3 class="title is-5 is-family-primary">Password Created Successfully</h3>
        <p class="subtitle is-6 is-family-secondary has-text-grey mb-5">
          Your password has been updated successfully.
        </p>
        <Button
          color="primary"
          full-width
          rounded
          @click="handleLoginRedirect"
          label-color="white"
        >
          Login
        </Button>
      </div>
      <button class="modal-close is-large" aria-label="close" @click="showSuccessModal = false"></button>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  padding: 2rem;
  max-width: 400px;
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.auth-header {
  margin-bottom: 2rem;
}

.has-background-light-purple {
  background-color: #f3f0ff;
  border: none;
  box-shadow: none;
}

.input:focus {
  box-shadow: 0 0 0 0.125em rgba(108, 93, 211, 0.25);
}

.back-button a {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.modal-content {
    border-radius: 1rem;
    max-width: 300px;
}
</style>
