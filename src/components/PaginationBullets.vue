<script setup lang="ts">
import { computed, watchEffect } from 'vue';
import { useOnboardingStore } from '@/stores/counter';

defineProps<{
  totalPages: number;
}>();

const store = useOnboardingStore();
// const totalPages = 3; // or dynamically computed
const currentPage = computed(() => store.step);

watchEffect(() => { 
  console.log("currentPage: ", currentPage.value);
  // console.log("currentPage: ", currentPage);
});
</script>

<template>
  <div class="has-text-centered mt-5p5">
    <div class="buttons is-centered is-inline-flex">
      <button
        v-for="(page, index) in totalPages"
        :key="index"
        class="button is-rounded is-small"
        :class="{
          'is-primary is-focused': (currentPage-1) === index,
          'is-light': (currentPage-1) !== index,
        }"
        style="width: 10px; height: 10px; padding: 0; margin: 0 4px;"
        aria-label="Page indicator"
      ></button>
    </div>
  </div>
</template>
