<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

type IconColor =
  | 'primary'
  | 'link'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'
  | 'dark'
  | 'light'
  | 'white'
  | 'black'

const props = defineProps<{
  title?: string
  hasBackIconLabel?: boolean
  iconColor?: IconColor
}>()

const iconClasses = computed(() => ({
  [`has-text-${props.iconColor}`]: props.iconColor,
}))

const router = useRouter()

const goBack = () => {
  router.back()
}
</script>

<template>
  <nav class="navbar is-flex is-align-items-center is-transparent py-2 px-4 mb-5">
    <div class="navbar-brand">
      <a class="navbar-item" :class="iconClasses" @click="goBack">
        <span> <font-awesome-icon icon="fa-solid fa-chevron-left fa-lg" /> </span>
        <span v-if="hasBackIconLabel" class="is-family-secondary">Back</span>
      </a>
    </div>
    <div
      v-if="title"
      class="navbar-item is-expanded has-text-centered has-text-weight-bold is-family-secondary"
    >
      {{ title }}
    </div>
    <div
      v-else
      class="navbar-item is-expanded has-text-centered has-text-weight-bold is-family-secondary"
    >
      <div class="control">
        <input class="input" type="text" placeholder="Search" />
      </div>
    </div>
    <div v-if="title" class="navbar-item">
      <slot></slot>
    </div>
  </nav>
</template>

<style scoped>
nav {
  filter: drop-shadow(#EFEEF0 0 1px 0);
}
</style>
