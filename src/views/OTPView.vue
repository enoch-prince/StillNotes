<script setup lang="ts">
import Button from '@/components/Button.vue'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const otp = ref(['', '', '', ''])
const inputRefs = ref<HTMLInputElement[]>([])

const handleVerify = () => {
  const code = otp.value.join('')
  // TODO: Implement OTP verification logic
  console.log('Verifying code:', code)
  
  if (route.query.context === 'signup') {
    router.push('/questionaire')
  } else {
    router.push('/new-password')
  }
}

const handleInput = (index: number, event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value

  if (value.length > 1) {
    target.value = value.slice(0, 1)
    otp.value[index] = value.slice(0, 1)
  }

  if (value && index < 3) {
    inputRefs.value[index + 1]?.focus()
  }
}

const handleKeydown = (index: number, event: KeyboardEvent) => {
  if (event.key === 'Backspace' && !otp.value[index] && index > 0) {
    inputRefs.value[index - 1]?.focus()
  }
}

onMounted(() => {
  inputRefs.value[0]?.focus()
})
</script>

<template>
  <div class="auth-container">
    <div class="auth-header">
      <div class="back-button mb-4">
        <router-link to="/forgot-password" class="has-text-black">
          <div> 
            <span> <font-awesome-icon icon="fa-solid fa-chevron-left fa-lg" /> </span>
          <span class="is-family-secondary ml-2">Back</span>
          </div>
        </router-link>
      </div>
      <h1 class="title is-4 mb-4 is-family-primary">Enter OTP</h1>
      <p class="subtitle is-6 is-family-secondary has-text-grey">
        Enter the verification code we just sent to your email address
      </p>
    </div>

    <form @submit.prevent="handleVerify" class="auth-form">
      <div class="field is-grouped is-grouped-centered otp-inputs">
        <div class="control" v-for="(digit, index) in 4" :key="index">
          <input
            ref="inputRefs"
            v-model="otp[index]"
            class="input is-rounded-4 has-background-light-purple has-text-centered"
            type="text"
            maxlength="1"
            @input="handleInput(index, $event)"
            @keydown="handleKeydown(index, $event)"
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
          Verify Code
        </Button>
      </div>

      <div class="has-text-centered mt-4 is-family-secondary">
        <p class="is-size-7">
          Didn't receive code?
          <a href="#" class="has-text-primary has-text-weight-bold">Resend Code</a>
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

.input:focus {
  box-shadow: 0 0 0 0.125em rgba(108, 93, 211, 0.25);
}

.otp-inputs .control {
  width: 60px;
  margin: 0 0.5rem;
}

.otp-inputs .input {
  height: 60px;
  font-size: 1.5rem;
  font-weight: bold;
}

.back-button a {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

@media only screen and (max-width: 395px) {
  /* CSS styles for screen widths 395px and below */
  .otp-inputs .control {
    /* width: 60px; */
    margin: 0 0.25rem;
  }
}
</style>
