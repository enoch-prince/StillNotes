<script setup lang="ts">

const prop = defineProps<{label: string}>()

</script>

<template>
    <div class="is-flex is-justify-content-space-between py-2 max-width">
        <div class="is-flex is-align-items-center">
            <slot name="icon"></slot>
            <p class="is-family-secondary is-size-6">{{ prop.label }}</p>
        </div>
        <span><font-awesome-icon icon="fa-solid fa-chevron-right" style="color: #827D89"/></span>
    </div>
</template>

<style scoped>
.max-width {
    width: 100%;
}
</style>