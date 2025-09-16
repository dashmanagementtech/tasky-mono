import { readonly, ref } from "vue"
import { createApiConfig } from "@/config/api"

const baseUrl = import.meta.env.VITE_BASE_URL

const api = createApiConfig(`${baseUrl}`)

const tasksAnalytics = ref({
  total: 0,
  active: 0,
  completed: 0,
  productivity: 0,
  loading: true
})

const upcoming = ref({
  items: [],
  loading: true
})

const tasks = ref({
  items: [],
  loading: true
})

export function useDashoard() {
  const loadTasksAnalytics = async () => {
    tasksAnalytics.value.loading = true
    try {
      const { total, active, completed, productivity } = await api.get('/projects/analytics')

      tasksAnalytics.value.active = active
      tasksAnalytics.value.completed = completed
      tasksAnalytics.value.total = total
      tasksAnalytics.value.productivity = productivity
    } catch (error) {
      console.error(error);
    } finally {
      tasksAnalytics.value.loading = false
    }
  }

  const loadUpcomingTasks = async () => {
    upcoming.value.loading = true
    try {
      const { deadlines } = await api.get("/projects/upcoming")
      upcoming.value.items = deadlines
    } catch (error) {
      console.error(error);
    } finally {
      upcoming.value.loading = false
    }
  }

  const loadTasks = async () => {
    tasks.value.loading = true
    try {
      const { tasks: allTasks } = await api.get("/projects/my-tasks")

      tasks.value.items = allTasks
    } catch (error) {
      console.error(error)
    } finally {
      tasks.value.loading = false
    }
  }

  return {
    loadTasksAnalytics,
    loadUpcomingTasks,
    loadTasks,
    upcoming: readonly(upcoming),
    tasksAnalytics: readonly(tasksAnalytics),
    tasks: readonly(tasks)
  }
}
