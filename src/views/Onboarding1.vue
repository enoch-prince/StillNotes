<script setup lang="ts">
import { ref } from 'vue';
import { useOnboardingStore } from "@/stores/counter";
import Onboard1SVG from "@/components/svgs/onboard1SVG.vue"
import Onboard2SVG from "@/components/svgs/onboard2SVG.vue"
import Onboard3SVG from "@/components/svgs/onboard3SVG.vue"

let next = ref(1);
const onboard = useOnboardingStore();

</script>

<template>
    <div class="flex-center max-height custom-background">
        <div class="" v-if="onboard.step == 0">
            <p @click="onboard.incrementStep()" class="is-size-2 is-family-secondary is-clickable">StillNotes</p>
        </div>
        <div class="flex-center" v-else-if="onboard.step == 1">
            <div class="is-align-content-center">
                <Onboard1SVG />
            </div>
            <p class="is-size-3-mobile has-text-centered mt-5">Find peace in the small, scattered, uncertain moments.
            </p>
            <div class="is-flex is-align-items-flex-start is-justify-content-space-between width-80vw mt-6">
                <div>
                    <button type="button">Skip</button>
                </div>
                <div>
                    <button class="button" @click="onboard.incrementStep()">
                        <span>Next</span>
                        <span class="icon is-small">
                            <font-awesome-icon icon="fa-solid fa-arrow-right fa-beat-fade"
                                style="--fa-beat-fade-opacity: 0.1; --fa-beat-fade-scale: 1.25;" />
                        </span>
                    </button>
                </div>
            </div>
        </div>
        <div class="flex-center" v-else-if="onboard.step == 2">
            <div class="is-align-content-center">
                <Onboard2SVG />
            </div>
            <p class="is-size-3-mobile has-text-centered mt-5">Every quiet moment matters</p>
            <div class="is-flex is-align-items-flex-start is-justify-content-space-between width-80vw mt-6">
                <div>
                    <button type="button">Skip</button>
                </div>
                <div>
                    <button class="button" @click="onboard.incrementStep()">
                        <span>Next</span>
                        <span class="icon is-small">
                            <!-- <font-awesome-icon icon="fa-brands fa-google" style="color: #B197FC;" /> -->
                            <font-awesome-icon icon="fa-solid fa-arrow-right" />
                        </span>
                    </button>
                </div>
            </div>
        </div>
        <div class="flex-center" v-else>
            <div class="is-align-content-center">
                <Onboard3SVG />
            </div>
            <p class="is-size-3-mobile has-text-centered mt-5">Reflect, remember, and stay rooted</p>
            <div class="is-flex is-flex-direction-row-reverse width-80vw mt-6">
                <div>
                    <button class="button" @click="onboard.incrementStep()">
                        <span>Next</span>
                        <span class="icon is-small">
                            <font-awesome-icon icon="fa-solid fa-arrow-right" />
                        </span>
                    </button>
                </div>
            </div>
        </div>

        <nav class="pagination is-rounded" role="navigation" aria-label="pagination">
            <ul class="pagination-list">
                <li><a href="#" class="pagination-link" aria-label="Goto page 1">1</a></li>
                <li><a href="#" class="pagination-link" aria-label="Goto page 45">45</a></li>
                <li>
                    <a class="pagination-link is-current" aria-label="Page 46" aria-current="page">46</a>
                </li>
            </ul>
        </nav>
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
</style>