<script setup lang="ts"></script>

<template>
  <div class="mini-card">
    <div class="is-flex is-flex-direction-row is-justify-content-space-between has-width-100">
      <span class="icon icon-layout">
        <font-awesome-icon icon="fa fa-gamepad"></font-awesome-icon>
      </span>
      <span class="icon is-small is-rounded-background-success">
        <font-awesome-icon icon="fa-regular fa-circle-check" class="has-text-light"></font-awesome-icon>
      </span>
    </div>
    <div>
      <p class="is-family-secondary is-size-6-touch has-text-weight-semibold">
        Daily Devotion
      </p>
    </div>
  </div>
</template>


<style scoped>

.mini-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem 0.5rem;
  gap: 0.875rem;

  width: 9.75rem;/*156px;*/
  height: 8.5rem;/*136px;*/

  background: #d1c7ff;
  border-radius: 0.5rem;
}


.icon-layout {
  display: flex;
  padding: 0.75rem;
  margin: 0 2rem 0 auto; /* top right bottom left */
  width: 2.875rem;
  height: 2.875rem;
  background: #ffffff;
  border-radius: 100%;
}

.is-rounded-background-success {
    border-radius: 100%;
    background-color: var(--bulma-success);
}

.has-width-100 {
    width: 100%;
}
</style>
