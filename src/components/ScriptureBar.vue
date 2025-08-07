<script setup lang="ts">

const prop = defineProps<{label: string}>()

</script>

<template>
    <div class="is-flex is-justify-content-space-between py-2 max-width">
        <p class="is-family-secondary is-size-6">{{ prop.label }}</p>
        <span><font-awesome-icon icon="fa-solid fa-chevron-right" style="color: #827D89"/></span>
    </div>
</template>

<style scoped>
.max-width {
    width: 100%;
}
</style>