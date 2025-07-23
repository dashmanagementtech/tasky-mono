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
  const keyword = ref('')

  const fetchAllClients = async () => {
    loading.value = true

    try {
      const { count, clients: _clients } = await api.get(`?size=${meta.size}&page=${meta.page - 1}`)

      meta.total = count
      clients.value = _clients
    } catch (error: any | { message: string }) {
      ElMessage.error(error.message)
    } finally {
      loading.value = false
    }
  }

  const addNewClient = async function (payload: { firstName: string, lastName: string, email: string }) {
    submitting.value = true

    try {
      await api.post('/', payload)

      await fetchAllClients()
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
      const { clients: _clients } = await api.get(`/search?query=${query}`)

      oneclient.value = _clients
      clients.value = _clients
    } catch (error: any | { message: string }) {
      ElMessage.error(error.message);
    } finally {
      loading.value = false
    }
  }

  const fetchClientById = async function (id: string) {
    try {
      oneclient.value = undefined
      const { client } = await api.get(`/${id}`)

      oneclient.value  = client
    } catch (error: any | { message: string }) {
      ElMessage.error(error.message)
    }
  }

  return {
    submitting,
    loading,
    clients,
    oneclient,
    meta,
    keyword,
    addNewClient,
    searchClient,
    fetchAllClients,
    fetchClientById
  }
}
