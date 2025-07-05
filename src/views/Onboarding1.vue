<script setup lang="ts">
import { useOnboardingStore } from "@/stores/counter";
import Onboard1SVG from "@/components/svgs/onboard1SVG.vue";
import Onboard2SVG from "@/components/svgs/onboard2SVG.vue";
import Onboard3SVG from "@/components/svgs/onboard3SVG.vue";
import PaginationBullets from '@/components/PaginationBullets.vue';

const onboard = useOnboardingStore();

</script>

<template>
    <div class="flex-center max-height custom-background" v-touch:swipe.right="onboard.prevStep">
        <div class="" v-if="onboard.step == 0">
            <p @click="onboard.nextStep" class="is-size-2 is-family-secondary has-text-primary-100 is-clickable">StillNotes</p>
        </div>
        <div class="flex-center" v-else-if="onboard.step == 1">
            <div class="is-align-content-center">
                <Onboard1SVG />
            </div>
            <p class="is-size-3-mobile has-text-centered has-text-primary-100 mt-5">Find peace in the small, scattered, uncertain moments.
            </p>
            <div class="is-flex is-align-items-flex-start is-justify-content-space-between width-80vw mt-6">
                <div>
                    <button type="button">Skip</button>
                </div>
                <div>
                    <button class="button" @click="onboard.nextStep">
                        <span>Next</span>
                        <span class="icon is-small">
                            <font-awesome-icon icon="fa-solid fa-arrow-right"
                                style="color:var(--bulma-primary);" />
                        </span>
                    </button>
                </div>
            </div>
        </div>
        <div class="flex-center" v-else-if="onboard.step == 2">
            <div class="is-align-content-center">
                <Onboard2SVG />
            </div>
            <p class="is-size-3-mobile has-text-centered has-text-primary-100 mt-5">Every quiet moment matters</p>
            <div class="is-flex is-align-items-flex-start is-justify-content-space-between width-80vw mt-6">
                <div>
                    <button type="button">Skip</button>
                </div>
                <div>
                    <button class="button" @click="onboard.nextStep">
                        <span>Next</span>
                        <span class="icon is-small">
                            <!-- <font-awesome-icon icon="fa-brands fa-google" style="color: #B197FC;" /> -->
                            <font-awesome-icon icon="fa-solid fa-arrow-right" style="color:var(--bulma-primary);"/>
                        </span>
                    </button>
                </div>
            </div>
        </div>
        <div class="flex-center" v-else>
            <div class="is-align-content-center">
                <Onboard3SVG />
            </div>
            <p class="is-size-3-mobile has-text-centered has-text-primary-100 mt-5">Reflect, remember, and stay rooted</p>
            <div class="is-flex is-flex-direction-row-reverse width-80vw mt-6">
                <div>
                    <button class="button is-rounded" @click="onboard.nextStep()">
                        <span class="has-text-primary">Next</span>
                        <span class="icon is-small">
                            <font-awesome-icon icon="fa-solid fa-arrow-right" style="color:var(--bulma-primary);"/>
                        </span>
                    </button>
                </div>
            </div>
        </div>
        <PaginationBullets :total-pages="3" v-show="onboard.step > 0"/>
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