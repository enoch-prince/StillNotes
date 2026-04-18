<script setup lang="ts">
import { computed } from 'vue'

export interface FeedNote {
  id: string
  title: string
  content: string
  scripture: string
  color: string
  tag: string
  user: {
    avatar: string
    name: string
  }
  stats: {
    likes: string
    comments: string
  }
}

const props = defineProps<{
  note: FeedNote
}>()
</script>

<template>
  <div class="feed-note-card p-5 mb-4 is-relative" :style="{ backgroundColor: note.color }">
    <!-- Header -->
    <div class="is-flex is-justify-content-space-between is-align-items-center mb-4">
      <figure class="image is-32x32 m-0 p-0 circular-avatar">
        <img class="is-rounded" :src="note.user.avatar" alt="Avatar">
      </figure>
      <span class="icon has-text-white is-clickable">
        <font-awesome-icon icon="fa-solid fa-ellipsis" />
      </span>
    </div>

    <!-- Body text -->
    <div class="content has-text-centered has-text-white mb-5 pb-2 px-2">
      <p class="is-size-4 mb-3 is-family-secondary" style="font-weight: 300;">{{ note.title }}</p>
      <p class="is-size-6 is-family-secondary" style="line-height: 1.5; opacity: 0.95;">
        {{ note.content }}
      </p>
    </div>

    <!-- Scripture Pill -->
    <div class="is-flex is-justify-content-center mb-6">
      <div 
        class="scripture-pill is-inline-block px-4 py-1 has-text-white is-family-secondary"
        style="font-size: 0.85rem;"
      >
        {{ note.scripture }}
      </div>
    </div>

    <!-- Footer Stats & Actions -->
    <div class="is-flex is-justify-content-space-between is-align-items-flex-end mt-4">
      
      <!-- Footer User Info -->
      <div class="is-flex is-flex-direction-column">
        <figure class="image is-32x32 m-0 mb-1 circular-avatar">
          <img class="is-rounded" :src="note.user.avatar" alt="Avatar">
        </figure>
        <span class="has-text-white is-family-secondary has-text-weight-bold" style="font-size: 0.75rem;">{{ note.user.name }}</span>
      </div>

      <!-- Actions -->
      <div class="is-flex is-align-items-center" style="gap: 1.1rem; flex-wrap: nowrap;">
        <div class="is-flex is-align-items-center">
            <span class="icon is-medium is-clickable" style="color: #FFA09F;">
                <font-awesome-icon icon="fa-solid fa-heart" class="fa-lg"/>
            </span>
            <span class="has-text-white is-size-7 ml-1 is-family-secondary" style="opacity: 0.9; font-size: 0.8rem;">{{ note.stats.likes }}</span>
        </div>
        <div class="is-flex is-align-items-center">
            <span class="icon is-medium has-text-white is-clickable">
                <font-awesome-icon icon="fa-regular fa-comment" class="fa-lg"/>
            </span>
            <span class="has-text-white is-size-7 ml-1 is-family-secondary" style="opacity: 0.9; font-size: 0.8rem;">{{ note.stats.comments }}</span>
        </div>
        <div>
            <span class="icon is-medium has-text-white is-clickable">
                <font-awesome-icon icon="fa-regular fa-paper-plane" class="fa-lg"/>
            </span>
        </div>
        <div>
            <span class="icon is-medium has-text-white is-clickable">
                <font-awesome-icon icon="fa-regular fa-bookmark" class="fa-lg"/>
            </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.feed-note-card {
  border-radius: 1rems;
  border-radius: 12px;
  overflow: hidden;
  /* box-shadow: 0 4px 15px rgba(0,0,0,0.05); */
}

.circular-avatar img {
  border: 2px solid rgba(255, 255, 255, 0.4);
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.scripture-pill {
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 20px;
}
</style>
