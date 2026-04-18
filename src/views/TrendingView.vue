<script setup lang="ts">
import { computed } from 'vue'
import BottomNavBar from '@/components/BottomNavBar.vue'
import SoulRythmSVG from '@/components/svgs/soulRythmSVG.vue'
import BellIconSVG from '@/components/svgs/bellIconSVG.vue'
import { useSavedNotesStore, useSetReminderStore } from '@/stores/counter'

const savedNotesStore = useSavedNotesStore()
const reminderStore = useSetReminderStore()

const notesThisWeek = computed(() => {
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return savedNotesStore.notes.filter(n => n.timestamp >= oneWeekAgo).length;
})

const alarmTime = computed(() => {
  return `${reminderStore.selectedHour}:${reminderStore.selectedMinute.toString().padStart(2, '0')} ${reminderStore.selectedPeriod}`
})

const topDayString = computed(() => {
  if (savedNotesStore.notes.length === 0) return 'Not enough data'
  
  const dayCounts = new Array(7).fill(0)
  savedNotesStore.notes.forEach(n => {
    dayCounts[new Date(n.timestamp).getDay()]++
  })
  
  const maxDayIndex = dayCounts.indexOf(Math.max(...dayCounts))
  const days = ['Sundays', 'Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays']
  
  return dayCounts[maxDayIndex] > 0 ? days[maxDayIndex] : 'Not recorded yet'
})

const topTheme = computed(() => {
  if (savedNotesStore.notes.length === 0) return 'Not enough data'
  
  const tagCounts: Record<string, number> = {}
  savedNotesStore.notes.forEach(n => {
    n.tags.forEach(t => {
      tagCounts[t] = (tagCounts[t] || 0) + 1
    })
    
    // Also include scriptures as themes
    n.scripture.forEach(s => {
      const scriptLabel = `${s.book} ${s.chapter}:${s.verse}`
      tagCounts[scriptLabel] = (tagCounts[scriptLabel] || 0) + 1
    })
  })
  
  let maxTag = 'None yet'
  let maxCount = 0
  for (const [tag, count] of Object.entries(tagCounts)) {
    if (count > maxCount) {
      maxTag = tag
      maxCount = count
    }
  }
  return maxTag
})
</script>

<template>
  <div class="content is-relative">
    <!-- Header -->
    <div class="header-section is-relative">
       <div class="pt-6 px-5 pb-4 is-flex is-justify-content-space-between is-align-items-flex-end is-relative z-index-1" style="height: 100%">
          <div class="mb-2">
            <p class="is-size-3 has-text-white mb-1 is-family-secondary">Soul Rhythm</p>
            <p class="is-size-7 has-text-white is-family-secondary" style="opacity: 0.8; line-height: 1.4">You created {{ notesThisWeek }} notes<br>this week</p>
          </div>
          <div class="header-svg is-absolute">
          <SoulRythmSVG />
       </div>
       </div>
       <!-- <div class="header-svg is-absolute">
          <SoulRythmSVG />
       </div> -->
    </div>

    <!-- Alarm Section -->
    <div class="px-5 py-5 is-flex is-justify-content-space-between is-align-items-center">
       <div>
         <p class="is-size-7 has-text-grey is-family-secondary mb-1">Alarm set for</p>
         <p class="is-size-3 has-text-black has-text-weight-normal is-family-secondary">{{ alarmTime }}</p>
       </div>
       <div>
         <BellIconSVG /> 
       </div>
    </div>
    
    <div class="px-5">
      <hr class="mt-0 mb-5" style="background-color: #efeef0; height: 1px;">
    </div>

    <!-- Rhythm Chart Section -->
    <div class="px-5 mb-6">
      <p class="is-size-7 has-text-grey is-family-secondary tracking-wide mb-4">RHYTHM</p>
      <div class="chart-container is-relative mb-3" style="height: 140px; width: 100%;">
        <!-- TODO: Make chart dynamic using real note frequency data from savedNotesStore -->
        <svg width="100%" height="100%" viewBox="0 0 300 140" preserveAspectRatio="none">
           <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                 <stop offset="0%" stop-color="#b8a6ff" stop-opacity="0.3" />
                 <stop offset="100%" stop-color="#b8a6ff" stop-opacity="0" />
              </linearGradient>
           </defs>
           <path d="M0,70 Q20,50 40,60 T90,90 T140,40 T160,20 T180,60 T200,80 T230,50 T260,70 T280,60 T300,30 L300,140 L0,140 Z" fill="url(#chartGradient)" />
           <path d="M0,70 Q20,50 40,60 T90,90 T140,40 T160,20 T180,60 T200,80 T230,50 T260,70 T280,60 T300,30" stroke="#a795f8" stroke-width="2.5" fill="none" stroke-linecap="round" />
        </svg>
      </div>
      <div class="is-flex is-justify-content-space-between is-size-7 has-text-grey is-family-secondary">
        <span>MON</span>
        <span>TUE</span>
        <span>WED</span>
        <span>THU</span>
        <span>FRI</span>
        <span>SAT</span>
        <span>SUN</span>
      </div>
    </div>

    <!-- Insights Section -->
    <div class="px-5 pb-6 mb-6">
      <div class="insight-card p-4 mb-4">
        <p class="is-size-7 has-text-grey is-family-secondary mb-2">Days you tend to reflect more</p>
        <p class="is-size-5 has-text-black is-family-secondary">{{ topDayString }}</p>
      </div>
      
      <div class="insight-card p-4 mb-6" style="background-color: #eaf7ff;"
      >
        <p class="is-size-7 has-text-grey is-family-secondary mb-2">Most used themes or verses</p>
        <p class="is-size-5 has-text-black is-family-secondary">{{ topTheme }}</p>
      </div>
    </div>

    <!-- Navigation -->
    <BottomNavBar />
  </div>
</template>

<style scoped>
.content {
  background-color: #fafbfc;
  min-height: 100vh;
  padding-bottom: 80px;
}

.header-section {
  background-color: #A795F8;
  /* border-bottom-left-radius: 2rem; */
  border-bottom-right-radius: 2rem;
  overflow: hidden;
  height: 160px;
}

.z-index-1 {
  z-index: 1;
}

.is-absolute {
  position: absolute;
}

.header-svg {
  /* bottom: 0; */
  right: 2%;
  /* width: 220px; */
  height: auto;
  top: 18.5%;
}

.tracking-wide {
  letter-spacing: 0.12em;
}

.insight-card {
  background-color: #f4f2ff;
  /* background-color: #eaf7ff; */
  border-radius: 12px;
}
</style>