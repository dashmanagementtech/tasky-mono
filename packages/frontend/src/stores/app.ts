import { defineStore } from "pinia";
import { ref } from "vue";

export const useAppStore = defineStore('app', () => {
  const token = ref()
  const refresh = ref()

  const setToken = (payload: string) => token.value = payload
  const setRefresh = (payload: string) => refresh.value = payload

  const reset = () => {
    token.value = undefined
    refresh.value = undefined
  }

  return { token, refresh, setToken, setRefresh, reset}
})
