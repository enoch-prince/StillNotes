<script setup lang="ts">
import Button from '@/components/Button.vue'
import googleIconSVG from '@/components/svgs/googleIconSVG.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const fullName = ref('')
const email = ref('')
const password = ref('')

const handleRegister = () => {
  // TODO: Implement registration logic
  console.log('Registering with:', fullName.value, email.value, password.value)
  router.push('/login')
}

const handleGoogleRegister = () => {
  // TODO: Implement Google registration logic
  console.log('Registering with Google')
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-header">
      <h1 class="title is-4 is-family-primary">Register</h1>
      <p class="subtitle is-6 is-family-secondary has-text-grey">Create your new account</p>
    </div>

    <form @submit.prevent="handleRegister" class="auth-form">
      <div class="field">
        <label class="label is-family-secondary">Full Name</label>
        <div class="control">
          <input
            v-model="fullName"
            class="input is-rounded-4 has-background-light-purple"
            type="text"
            placeholder="Enter your full name"
            required
          />
        </div>
      </div>

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
          Sign up
        </Button>
      </div>

      <div class="divider is-family-secondary">or</div>

      <div class="field">
        <Button full-width rounded outlined color="black" @click="handleGoogleRegister">
          <template #icon>
            <googleIconSVG />
          </template>
          Register with Google
        </Button>
      </div>

      <div class="has-text-centered mt-4 is-family-secondary">
        <p class="is-size-7">
          Already have an account?
          <router-link to="/login" class="has-text-primary has-text-weight-bold"
            >Log in</router-link
          >
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
  background-color: #f3f0ff; /* Light purple background from design */
  border: none;
  box-shadow: none;
}

.input::placeholder {
  color: #b5b5c3;
}

.input:focus {
  box-shadow: 0 0 0 0.125em rgba(108, 93, 211, 0.25); /* Primary color focus */
}

.divider {
  text-align: center;
  margin: 1.5rem 0;
  color: #b5b5c3;
  position: relative;
}

/* Custom Google Icon handling since we might not have the font awesome icon ready or want specific svg */
/* Assuming we might need to add the google icon asset or use font awesome if available */
</style>
