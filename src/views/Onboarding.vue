<script setup lang="ts">
import { watchEffect } from 'vue'
import { useOnboardingStore } from '@/stores/counter'
import Onboard1SVG from '@/components/svgs/onboard1SVG.vue'
import Onboard2SVG from '@/components/svgs/onboard2SVG.vue'
import Onboard3SVG from '@/components/svgs/onboard3SVG.vue'
import PaginationBullets from '@/components/PaginationBullets.vue'
import Button from '@/components/Button.vue'
import { useRouter } from 'vue-router'


const onboard = useOnboardingStore()
const router = useRouter()

watchEffect(()=> {
  if (onboard.complete) {
    console.log("Redirected!")
    router.push({path: '/questionaire'})
  }
})
</script>

<template>
  <div class="flex-center max-height custom-background" v-touch:swipe.right="onboard.prevStep">
    <div class="" v-if="onboard.step == 0">
      <p
        @click="onboard.nextStep"
        class="is-size-2 is-family-secondary has-text-primary-100 is-clickable"
      >
        StillNotes
      </p>
    </div>
    <div class="flex-center" v-else-if="onboard.step == 1">
      <div class="is-align-content-center">
        <Onboard1SVG />
      </div>
      <p class="is-size-3-touch has-text-centered has-text-primary-100 mt-5">
        Find peace in the small, scattered, uncertain moments.
      </p>
    </div>

    <div class="flex-center" v-else-if="onboard.step == 2">
      <div class="is-align-content-center">
        <Onboard2SVG />
      </div>
      <p class="is-size-3-touch has-text-centered has-text-primary-100 mt-5">
        Every quiet moment matters
      </p>
    </div>

    <div class="flex-center" v-else>
      <div class="is-align-content-center">
        <Onboard3SVG />
      </div>
      <p class="is-size-3-touch has-text-centered has-text-primary-100 mt-5">
        Reflect, remember, and stay rooted
      </p>
    </div>

    <div v-show="onboard.step > 0">
      <PaginationBullets :total-pages="3" />
      <div
        class="is-flex width-80vw mt-5p5"
        :class="
          onboard.step >= 3
            ? 'is-flex-direction-row-reverse'
            : 'is-align-items-flex-start is-justify-content-space-between'
        "
      >
        <Button
          color="transparent"
          label-color="light"
          v-show="onboard.step < 3"
          >Skip</Button
        >
        <Button
          icon="fas fa-arrow-right"
          icon-position="right"
          icon-size="small"
          icon-color="primary"
          icon-gap="5"
          label-color="primary"
          @click="onboard.nextStep"
        >
          Next
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-background {
  background: linear-gradient(-180deg, rgba(205, 194, 255, 1) 0%, rgba(167, 149, 248, 1) 100%);
}

.flex-center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.width-80vw {
  width: 85vw;
}

.max-height {
  height: 100vh;
}

p {
  margin-left: 1rem;
  margin-right: 1rem;
}
</style>
