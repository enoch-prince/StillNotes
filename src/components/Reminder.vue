<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useSetReminderStore } from '@/stores/counter'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits(['update:modelValue', 'save'])

const { selectedHour, selectedMinute, selectedPeriod, repeatDays, vibrate, ringtone } =
  storeToRefs(useSetReminderStore())
const { toggleDay, toggleVibrate, setRingtone } = useSetReminderStore()

const hours = Array.from({ length: 12 }, (_, i) => i + 1)
const minutes = Array.from({ length: 60 }, (_, i) => i)
const periods: string[] = ['AM', 'PM']

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
</script>

<template>
  <transition name="modal-fade">
    <div v-if="modelValue" class="modal is-active">
      <div class="modal-background" @click="close" />

      <div class="modal-card reminder-modal">
        <section class="modal-card-body pb-4 px-4">
          <!-- Time Picker -->
          <!-- Time Picker -->
          <div class="columns is-mobile is-centered has-text-centered mb-5 time-picker-wrapper">
            <div class="column is-narrow">
              <div class="time-scroll">
                <div
                  v-for="h in hours"
                  :key="h"
                  class="time-unit"
                  :class="{ 'is-selected': h === selectedHour }"
                  @click="selectedHour = h"
                >
                  {{ h }}
                </div>
              </div>
            </div>
            <div class="column is-narrow">
              <div class="time-scroll">
                <div
                  v-for="m in minutes"
                  :key="m"
                  class="time-unit"
                  :class="{ 'is-selected': m === selectedMinute }"
                  @click="selectedMinute = m"
                >
                  {{ m.toString().padStart(2, '0') }}
                </div>
              </div>
            </div>

            <!-- AM/PM Button Outside Flow -->
            <button
              class="am-pm-toggle button is-small is-rounded is-transparent"
              @click="togglePeriod"
            >
              {{ selectedPeriod }}
            </button>
          </div>

          <!-- Repeat Days -->
          <div class="mb-4 is-family-secondary">
            <p class="has-text-weight-normal has-text-grey-dark is-size-7 mb-2">REPEAT</p>
            <div class="buttons is-centered">
              <button
                v-for="day in ['M', 'T', 'W', 'T', 'F', 'S', 'S']"
                :key="day"
                class="button is-size-6 is-rounded has-text-weight-normal"
                :class="{ 'is-primary': repeatDays.includes(day) }"
                @click="toggleDay(day)"
              >
                {{ day }}
              </button>
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
              {{ ringtone }} <font-awesome-icon icon="fas fa-chevron-right" class="ml-2"/>
            </div>
          </div>
        </section>

        <!-- Footer -->
        <footer class="modal-card-foot is-flex is-justify-content-space-between px-5 py-5">
          <button class="button is-light is-rounded has-text-primary" @click="close">Cancel</button>
          <button class="button is-primary is-rounded px-6" @click="done">Done</button>
        </footer>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.5s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.reminder-modal {
  border-radius: 1.25rem;
  max-width: 30rem;
}

.time-scroll {
  max-height: 11rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  scroll-snap-type: y mandatory;
}

.time-unit {
  font-size: 1.25rem;
  opacity: 0.5;
  scroll-snap-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.time-unit.is-selected {
  font-size: 1.75rem;
  font-weight: bold;
  opacity: 1;
  color: black;
}

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
  transition: 0.4s;
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
  transition: 0.4s;
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
  right: 25%;
  top: 50%;
  transform: translateY(-50%);
}

</style>
