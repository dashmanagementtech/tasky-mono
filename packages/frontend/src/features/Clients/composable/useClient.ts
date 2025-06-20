import { ElMessage } from "element-plus";
import { ref, reactive } from "vue";
import { createApiConfig } from "@/config/api";

const baseUrl = import.meta.env.VITE_BASE_URL

const api = createApiConfig(`${baseUrl}/clients`)
const loading = ref(false)
const submitting = ref(false)

const clients = ref([])
const oneclient = ref()
const meta = reactive({
  page: 1,
  size: 10,
  total: 0
})

export function useClient() {

  const addNewClient = async function (payload: { firstName: string, lastName: string, email: string }) {
    submitting.value = true

    try {
      await api.post('/', payload)

      ElMessage.success('Client added')
    } catch (error: any | { message: string }) {
      ElMessage.error(error.message)
    } finally {
      submitting.value = false
    }
  }

  const searchClient = async function (query: string) {
    loading.value = true
    try {
      const { clients } = await api.get(`/search?query=${query}`)

      oneclient.value = clients
    } catch (error: any | { message: string }) {
      ElMessage.error(error.message);
    } finally {
      loading.value = false
    }
  }

  return {
    submitting,
    loading,
    clients,
    oneclient,
    meta,
    addNewClient,
    searchClient
  }
}
