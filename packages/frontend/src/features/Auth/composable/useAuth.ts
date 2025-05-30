import type { ILoginData } from '@dash/shared'
import { ref } from 'vue'

const loading = ref(false)

export function useAuth() {
  const logUserIn = async function (payload: ILoginData) {
    loading.value = true
    try {
      console.warn({ payload })
    }
    catch (error) {
      console.error(error)
    }
    finally {
      loading.value = false
    }
  }

  return {
    logUserIn,
    loading
  }
}
