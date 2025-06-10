import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

import { useAppStore } from '@/stores/app'

export function createApiConfig(baseURL: string, { withAuth = true, customHeaders = {} } = {}) {
  const store = useAppStore()

  const getHeaders = () => {
    const baseHeaders: any = {
      ...customHeaders,
    }

    if (withAuth) {
      baseHeaders['Content-Type'] = 'application/json'
      baseHeaders.Authorization = `Bearer ${store.token}`
    }

    return baseHeaders
  }

  const request = async (url: string, method = 'GET', options = {}) => {
    const response = await fetch(`${baseURL}${url}`, {
      method,
      headers: getHeaders(),
      ...options,
    })

    if (!response.ok) {
      if (response.status === 401) {
        // refresh token, and retry the request
        await getRefreshToken()
        request(url, method, options)
      } else {
        throw await response.json()
      }
    }
    return await response.json()
  }

  return {
    get: (url: string, options = {}) => request(url, 'GET', options),
    post: (url: string, body: any, options = {}) =>
      request(url, 'POST', { ...options, body: JSON.stringify(body) }),
    put: (url: string, body: any, options = {}) =>
      request(url, 'PUT', { ...options, body: JSON.stringify(body) }),
    delete: (url: string, options = {}) => request(url, 'DELETE', options),
  }
}

async function getRefreshToken() {
  const store = useAppStore()
  const router = useRouter()

  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/refresh-token`, { method: 'POST', headers: {}, body: JSON.stringify({ refresh: store.refresh }) })

    const { token, refresh } = await response.json()

    store.setRefresh(refresh)
    store.setToken(token)
  }
  catch (error) {
    store.reset()
    console.error(error)
    ElMessage.warning('Please login to continue')
    router.replace('/')
  }
}
