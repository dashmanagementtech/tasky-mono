import { createApiConfig } from "@/config/api";
import { ElMessage } from "element-plus";
import { ref } from "vue";

const baseUrl = import.meta.env.VITE_BASE_URL

const api = createApiConfig(`${baseUrl}/staff`)
const loading = ref(false);
const submitting = ref(false);

export function useStaff() {
  const keyword = ref('')

  const inviteStaff = async (payload: any) => {
    submitting.value = true

    try {
      const { message } = await api.post('/invite', payload)

      ElMessage.success(message)
    } catch (error: any | { message: string }) {
      ElMessage.error(error.message)
    } finally {
      submitting.value = false
    }
  }

  const fetchAllStaff = async ({ size, page }: { size: number, page: number }) => {
    loading.value = true
    
    try {
      return await api.get(`?size=${size}&page=${page}`)
    } catch (error: any | { message: string }) {
      ElMessage.error(error.message)
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    submitting,
    keyword,
    inviteStaff,
    fetchAllStaff
  }
}
