import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { useDatabaseStore } from './db'

export interface UserProfile {
  id: string
  fullName: string
  email: string
  avatar: string
  emailNotifications: boolean
  textSize: string
}

export const useUserStore = defineStore('user', () => {
  const dbStore = useDatabaseStore()
  
  const profile = ref<UserProfile>({
    id: 'current-user',
    fullName: 'Nana Kwame',
    email: 'NanaKwame@gmail.com',
    avatar: '', // You can add a default base64 or URL here
    emailNotifications: true,
    textSize: 'Medium',
  })

  const loadProfile = async () => {
    if (!dbStore.isReady) return
    const data = await dbStore.execute((db) => db.find('user_profile'))
    if (data.length > 0) {
      profile.value = { ...profile.value, ...(data[0] as unknown as UserProfile) }
    }
  }

  const saveProfile = async (updates: Partial<UserProfile>) => {
    profile.value = { ...profile.value, ...updates }
    const payload = { ...profile.value, _id: profile.value.id }
    
    await dbStore.execute((db) => 
      db.update('user_profile', profile.value.id, payload)
        .catch(() => db.insert('user_profile', payload))
    )
  }

  watch(() => dbStore.isReady, (ready) => {
    if (ready) {
      loadProfile()
    }
  }, { immediate: true })

  return { profile, loadProfile, saveProfile }
})
