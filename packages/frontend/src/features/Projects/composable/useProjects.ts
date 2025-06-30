import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'
import { createApiConfig } from '@/config/api'

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

  const addStaffToProject = async (pid: string, staff: Record<string, string>, silent: boolean = false) => {
    submitting.value = true
    try {
      const { message } = await api.patch(`/${pid}`, staff)

      if (!silent) {
        ElMessage.success(message)
      }
    }
    catch (error: any | { message: string }) {
      ElMessage.error(error.message)
    }
    finally {
      submitting.value = false
    }
  }

  const createProject = async (payload: Record<string, any>) => {
    submitting.value = true

    const { staff, ...project } = payload

    try {
      const { message, pid } = await api.post('/', {
        ...project,
        startDate: new Date(project.startDate).toISOString(),
        endDate: new Date(project.endDate).toISOString(),
      })

      if (staff.length !== 0) {
        await addStaffToProject(pid, staff.map(({ uid, userRole }: Record<string, string>) => ({ uid, userRole })), true)
      }

      ElMessage.success(message)
    }
    catch (error: any | { message: string }) {
      ElMessage.error(error.message)
    }
    finally {
      submitting.value = false
    }
  }

  const fetchAllProjects = async () => {
    // if (projects.value.length === 0)
    loading.value = true

    try {
      const { count, projects: _projects } = await api.get(`?size=${meta.size}&page=${meta.page - 1}`)

      meta.total = count
      projects.value = _projects
    }
    catch (error: any | { message: string }) {
      ElMessage.success(error.message)
    }
    finally {
      loading.value = false
    }
  }

  const searchProjectByKeyword = async () => { }

  const fetchProjectById = async (id: string) => {
    try {
      project.value = undefined
      const { project: _project } = await api.get(`/${id}`)

      project.value = _project
    } catch (error: any | { message: string }) {
      ElMessage.error(error.message)
    }
  }

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
    addStaffToProject,
    fetchProjectById
  }
}
