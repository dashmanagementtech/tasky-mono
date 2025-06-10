import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore('auth', () => {
  const user = ref()

  const setUser = (payload: typeof user.value) => user.value = payload

  const reset = () => {
    user.value = undefined
  }

  return {
    user,
    setUser,
    reset
  }
})
