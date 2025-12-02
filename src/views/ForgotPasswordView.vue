<script setup lang="ts">
import Button from '@/components/Button.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')

const handleSendCode = () => {
  // TODO: Implement send code logic
  console.log('Sending code to:', email.value)
  router.push('/otp')
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-header">
      <div class="back-button mb-4">
        <router-link to="/login" class="has-text-black">
          <div> 
            <span> <font-awesome-icon icon="fa-solid fa-chevron-left fa-lg" /> </span>
          <span class="is-family-secondary ml-2">Back to Login</span>
          </div>
        </router-link>
      </div>
      <h1 class="title is-4 is-family-primary">Forgot Password</h1>
      <p class="subtitle is-6 is-family-secondary has-text-grey">
        Insert your email address to receive a code for creating a new password
      </p>
    </div>

    <form @submit.prevent="handleSendCode" class="auth-form">
      <div class="field">
        <label class="label is-family-secondary">Email Address</label>
        <div class="control">
          <input
            v-model="email"
            class="input is-rounded-4 has-background-light-purple"
            type="email"
            placeholder="anto_bambang@gmail.com"
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
          Send Code
        </Button>
      </div>
    </form>
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

.input::placeholder {
  color: #b5b5c3;
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
</style>
