<script setup lang="ts">

const props = defineProps<{tagSearch: string}>()

</script>

<template>
    <div class="box">
        <p class="has-text-centered">Recent tags show up here</p>
        <p class="has-text-centered">Searched Tag: <strong>{{ props.tagSearch }}</strong></p>
    </div>
</template>

<style lang="css" scoped>

</style>