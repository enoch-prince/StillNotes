<script setup lang="ts">

defineProps<{id_num?:number}>()

</script>

<template>
    <div class="box">
        <p class="has-text-centered">This is a recent <strong>note {{ id_num }}</strong> !!! </p>
    </div>
</template>

<style lang="css" scoped>

</style>