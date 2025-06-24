import { ElMessage } from "element-plus"
import { reactive, ref } from "vue"
import { createApiConfig } from "@/config/api"

const baseUrl = import.meta.env.VITE_BASE_URL

const api = createApiConfig(`${baseUrl}/sprints`)
const loading = ref(false)
const submitting = ref(false)

const sprints = ref([])
const sprint = ref()
const meta = reactive({})

export function useSprint() {
  const fetchAllSprintsByProjectId = async (pid: string) => {
    loading.value = true

    try {
      const { sprints: _sprints } = api.get(`/${pid}`) as any

      sprint.value = _sprints
    } catch (error: any | { message: string }) {
      ElMessage.error(error.message);
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    submitting,
    fetchAllSprintsByProjectId,
    sprint,
    sprints,
    meta
  }
}

