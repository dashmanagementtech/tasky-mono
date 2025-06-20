import { ElMessage } from "element-plus";
import { reactive, ref } from "vue";
import { createApiConfig } from "@/config/api";

const baseUrl = import.meta.env.VITE_BASE_URL

const api = createApiConfig(`${baseUrl}/projects`)
const loading = ref(false)
const submitting = ref(false)

const projects = ref([])
const project = ref()
const meta = reactive({
  page: 1,
  size: 10,
  total: 0,
})

export function useProject() {
  const keyword = ref('')

  const createProject = async (payload: Record<string, any>) => {
    submitting.value = true

    try {
      const { message } = await api.post('/', {
        ...payload,
        startDate: new Date(payload.startDate).toISOString(),
        endDate: new Date(payload.endDate).toISOString()
      })

      ElMessage.success(message)
    } catch (error: any | { message: string }) {
      ElMessage.error(error.message)
    } finally {
      submitting.value = false
    }
  }

  const fetchAllProjects = async () => {
    loading.value = true

    try {
      const { count, projects: _projects } = await api.get(`?size=${meta.size}&page=${meta.page - 1}`)

      meta.total = count
      projects.value = _projects
    } catch (error: any | { message: string }) {
      ElMessage.success(error.message)
    } finally {
      loading.value = false
    }
  }

  const searchProjectByKeyword = async () => {}

  return {
    loading,
    submitting,
    keyword,
    projects,
    project,
    meta,
    createProject,
    fetchAllProjects,
    searchProjectByKeyword,
  }
}
