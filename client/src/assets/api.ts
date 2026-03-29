const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:1337').replace(/\/+$/, '')

function getToken() {
  return localStorage.getItem('token')
}

async function request<T = unknown>(method: string, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  const res = await fetch(`${BASE_URL}${normalizedPath}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as Record<string, unknown>
    const msg = (err?.error as Record<string, unknown>)?.message ?? `Request failed: ${res.status}`
    throw new Error(String(msg))
  }

  return res.json() as Promise<T>
}

const api = {
  auth: {
    login: async (credentials: { identifier?: string; email?: string; password: string }) => {
      const raw = await request<{ jwt: string; user: Record<string, unknown> }>('POST', '/api/auth/local', {
        identifier: credentials.identifier ?? credentials.email,
        password: credentials.password,
      })
      return { data: { user: raw.user, jwt: raw.jwt } }
    },
    register: async (credentials: { username?: string; email: string; password: string }) => {
      const raw = await request<{ jwt: string; user: Record<string, unknown> }>('POST', '/api/auth/local/register', credentials)
      return { data: { user: raw.user, jwt: raw.jwt } }
    },
  },

  user: {
    me: async () => {
      const data = await request<Record<string, unknown>>('GET', '/api/users/me')
      return { data }
    },
    update: async (id: string, updates: Record<string, unknown>) => {
      const data = await request<Record<string, unknown>>('PUT', `/api/users/${id}`, updates)
      return { data }
    },
  },

  foodLogs: {
    list: async () => {
      const res = await request<any>('GET', '/api/food-logs')
      // Handle both plain array and Strapi-wrapped { data: [] } formats
      const data = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : [])
      return { data }
    },
    create: async (payload: { data: Record<string, unknown> }) => {
      const today = new Date().toISOString().split('T')[0]
      const res = await request<any>('POST', '/api/food-logs', {
        data: {
          ...payload.data,
          date: today,
          publishedAt: new Date().toISOString(),
        },
      })
      // Handle both plain object and { data: {} } wrapped
      const data = res?.data ?? res
      return { data }
    },
    delete: async (documentId: string) => {
      const data = await request<unknown>('DELETE', `/api/food-logs/${documentId}`)
      return { data }
    },
  },

  activityLogs: {
    list: async () => {
      const res = await request<any>('GET', '/api/activity-logs')
      const data = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : [])
      return { data }
    },
    create: async (payload: { data: Record<string, unknown> }) => {
      const today = new Date().toISOString().split('T')[0]
      const res = await request<any>('POST', '/api/activity-logs', {
        data: {
          ...payload.data,
          date: today,
          publishedAt: new Date().toISOString(),
        },
      })
      const data = res?.data ?? res
      return { data }
    },
    delete: async (documentId: string) => {
      const data = await request<unknown>('DELETE', `/api/activity-logs/${documentId}`)
      return { data }
    },
  },

  imageAnalysis: {
    analyze: async (payload: { imageBase64?: string; mimeType?: string }) => {
      const data = await request<{ result: { name: string; calories: number } }>('POST', '/api/image-analysis', payload)
      return { data }
    },
  },
}

export default api
