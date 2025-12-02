<script setup lang="ts">
import Button from '@/components/Button.vue'
import googleIconSVG from '@/components/svgs/googleIconSVG.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const password = ref('')

const handleLogin = () => {
  // TODO: Implement login logic
  console.log('Logging in with:', email.value, password.value)
  router.push('/')
}

const handleGoogleLogin = () => {
  // TODO: Implement Google login logic
  console.log('Logging in with Google')
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-header">
      <h1 class="title is-4 is-family-primary">Let's Login</h1>
      <p class="subtitle is-6 is-family-secondary has-text-grey">And notes your ideas</p>
    </div>

    <form @submit.prevent="handleLogin" class="auth-form">
      <div class="field">
        <label class="label is-family-secondary">Email Address</label>
        <div class="control">
          <input
            v-model="email"
            class="input is-rounded-4 has-background-light-purple"
            type="email"
            placeholder="Enter your email"
            required
          />
        </div>
      </div>

      <div class="field">
        <label class="label is-family-secondary">Password</label>
        <div class="control">
          <input
            v-model="password"
            class="input is-rounded-4 has-background-light-purple"
            type="password"
            placeholder="********"
            required
          />
        </div>
        <div class="has-text-right mt-2">
          <router-link to="/forgot-password" class="is-size-7 has-text-grey">Forgot Password?</router-link>
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
          Login
        </Button>
      </div>

      <div class="divider is-family-secondary">or</div>

      <div class="field">
        <Button full-width rounded outlined color="black" @click="handleGoogleLogin">
          <template #icon>
            <googleIconSVG />
          </template>
          Login with Google
        </Button>
      </div>

      <div class="has-text-centered mt-4 is-family-secondary">
        <p class="is-size-7">
          Don't have any account?
          <router-link to="/register" class="has-text-primary has-text-weight-bold">Register here</router-link>
        </p>
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

.divider {
  text-align: center;
  margin: 1.5rem 0;
  color: #b5b5c3;
  position: relative;
}
</style>
