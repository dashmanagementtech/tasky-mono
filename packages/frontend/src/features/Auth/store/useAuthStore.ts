import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore('auth', () => {
  const user = ref()
  const email = ref() // used only for setting password

  const setUser = (payload: typeof user.value) => user.value = payload
  const setEmail = (payload: typeof email.value) => email.value = payload

  const reset = () => {
    user.value = undefined
  }

  return {
    user,
    email,
    setUser,
    setEmail,
    reset
  }
})
