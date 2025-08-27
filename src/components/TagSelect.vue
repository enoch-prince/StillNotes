<script setup lang="ts">
const props = defineProps<{ tagSearch: string }>()

/// store selected tag in the store someway
</script>

<template>
  <div class="px-4">
    <div style="margin-bottom: 1.25rem; width: 100%">
      <p class="is-family-secondary is-size-7" style="color: #c8c5cb">RECENT TAGS</p>
    </div>
    <div class="tags" style="gap: 12px">
      <div
        class="tag is-rounded custom-styled is-clickable"
        v-for="tag in ['Walk', 'Faith', 'Purpose']"
        @click=""
      >
        {{ tag }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-styled {
  background-color: transparent;
  border: 1px solid #8080805e;
  color: grey;
}
</style>
