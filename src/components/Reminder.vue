<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSetReminderStore } from '@/stores/counter'
import Button from '@/components/Button.vue'
import InfiniteTimePicker from './InfiniteTimePicker.vue'

defineProps<{ modelValue: boolean }>()
const emit = defineEmits(['update:modelValue', 'save'])

const { selectedHour, selectedMinute, selectedPeriod, repeatDays, vibrate, ringtone } =
  storeToRefs(useSetReminderStore())
const { toggleDay, setRingtone } = useSetReminderStore()

const hours = Array.from({ length: 12 }, (_, i) => i + 1)
const minutes = Array.from({ length: 60 }, (_, i) => i)

function close() {
  emit('update:modelValue', false)
}

function done() {
  emit('save')
  close()
}

function togglePeriod() {
  selectedPeriod.value = selectedPeriod.value === 'AM' ? 'PM' : 'AM'
}

// function selectHour(hour: number, event: MouseEvent) {
//   selectedHour.value = hour
//   const target = event.currentTarget as HTMLElement
//   target.scrollIntoView({ behavior: 'smooth', block: 'center' })
// }

// function selectMinute(minute: number, event: MouseEvent) {
//   selectedMinute.value = minute
//   const target = event.currentTarget as HTMLElement
//   target.scrollIntoView({ behavior: 'smooth', block: 'center' })
// }
</script>

<template>
  <Teleport to="body">
    <transition name="slide-up">
      <div v-if="modelValue" class="modal is-active">
        <div class="modal-background" @click="close" />

        <div class="modal-card bottom-modal-content">
          <section class="modal-card-body pb-4 px-4">
            <!-- Time Picker -->
            <div class="columns is-mobile is-centered has-text-centered mb-5 time-picker-wrapper">
              <div class="column is-narrow">
                <!-- <div class="time-scroll">
                  <div
                    v-for="h in hours"
                    :key="h"
                    class="time-unit"
                    :class="{ 'is-selected': h === selectedHour }"
                    @click="selectHour(h, $event)"
                  >
                    {{ h }}
                  </div>
                </div> -->
                <InfiniteTimePicker v-model="selectedHour" :options="hours" />
              </div>
              <div class="column is-narrow">
                <!-- <div class="time-scroll">
                  <div
                    v-for="m in minutes"
                    :key="m"
                    class="time-unit"
                    :class="{ 'is-selected': m === selectedMinute }"
                    @click="selectMinute(m, $event)"
                  >
                    {{ m.toString().padStart(2, '0') }}
                  </div>
                </div> -->
                <InfiniteTimePicker v-model="selectedMinute" :options="minutes" padZero />
              </div>

              <!-- AM/PM Button Outside Flow -->
              <button
                class="am-pm-toggle button is-normal is-rounded is-transparent"
                @click="togglePeriod"
              >
                <span> {{ selectedPeriod }} </span>
              </button>
            </div>

            <!-- Repeat Days -->
            <div class="mb-4 is-family-secondary">
              <p class="has-text-weight-normal has-text-grey-dark is-size-7 mb-2">REPEAT</p>
              <div class="is-flex is-justify-content-space-between">
                <div
                  v-for="(day, index) in ['M', 'T', 'W', 'T', 'F', 'S', 'S']"
                  :key="day"
                  class="day-picker-wrapper is-flex is-align-items-center is-justify-content-center is-size-6 has-text-weight-normal"
                  :class="{
                    'has-background-primary has-text-white-bis': repeatDays.includes(index),
                  }"
                  @click="toggleDay(index)"
                >
                  <span>{{ day }}</span>
                </div>
              </div>
            </div>

            <!-- Vibrate -->
            <div class="is-flex is-justify-content-space-between py-4 mb-2">
              <span class="has-text-weight-medium">Vibrate</span>
              <label class="switch toggle">
                <input type="checkbox" v-model="vibrate" />
                <span class="slider round"></span>
              </label>
            </div>

            <!-- Ringtone -->
            <div class="is-flex is-justify-content-space-between is-align-items-center py-4 mb-4">
              <span class="has-text-weight-medium">Ringtone</span>
              <div class="has-text-grey is-size-7 is-clickable" @click="setRingtone('Default')">
                {{ ringtone }} <font-awesome-icon icon="fas fa-chevron-right" class="ml-2" />
              </div>
            </div>
          </section>

          <!-- Footer -->
          <footer class="modal-card-foot is-flex is-justify-content-space-between px-5 py-5">
            <Button color="primary" label-color="primary" px="5p5" py="2" outlined @click="close"
              >Cancel</Button
            >
            <Button
              color="primary"
              label-color="light"
              py="2"
              style="padding-left: 2.75rem; padding-right: 2.75rem"
              @click="done"
              >Done</Button
            >
          </footer>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
/* Vue transition class for slide-up effect */
.slide-up-enter-active,
.slide-up-leave-active {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.slide-up-enter-to,
.slide-up-leave-from {
  transform: translateY(0%);
  opacity: 1;
}

.bottom-modal-content {
  z-index: 100;
  position: absolute;
  bottom: 0;
  width: 100%;
  max-width: 95vw;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  background: white;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  animation: float-up 0.3s ease-out;
}

/* .time-scroll {
  max-height: 11rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
} */

/* .time-unit {
  font-size: 1.25rem;
  opacity: 0.5;
  scroll-snap-align: center;
  cursor: pointer;
  transition:
    transform 0.6s ease,
    opacity 0.6s ease;
} */

/* .time-unit.is-selected {
  font-size: 1.75rem;
  font-weight: bold;
  opacity: 1;
  color: black;
} */

/* Toggle slider override */
.switch.toggle {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 22px;
}

.switch.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider.round {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.6s;
  border-radius: 34px;
}

.slider.round::before {
  position: absolute;
  content: '';
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 3px;
  background-color: white;
  transition: 0.6s;
  border-radius: 50%;
}

input:checked + .slider.round {
  background-color: #bcaaff;
}

input:checked + .slider.round::before {
  transform: translateX(18px);
}

.time-picker-wrapper {
  position: relative;
}

.am-pm-toggle {
  position: absolute;
  right: 22%;
  top: 50%;
  transform: translateY(-50%);
}

@media only screen and (max-width: 360px) {
   /* CSS styles for screen widths 360px and below */
  .am-pm-toggle {
    right: 15%;
  }
}

@media screen and (width >= 568px) {
  /* CSS styles for screen widths 568px and above */
  .am-pm-toggle {
    right: 35%;
  }
}

.day-picker-wrapper {
  width: 38px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  background: #f0f3fd;
}
</style>
