import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api'
import type { User, LoginDto, RegisterDto, AuthResponse } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.roles.includes('Admin') ?? false)

  // Inicializar desde localStorage
  function init() {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')

    if (savedToken && savedUser) {
      token.value = savedToken
      user.value = JSON.parse(savedUser)
    }
  }

  async function login(credentials: LoginDto): Promise<boolean> {
    loading.value = true
    error.value = null

    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials)

      if (response.data.success) {
        token.value = response.data.token
        const nameParts = response.data.fullName.split(' ')
        user.value = {
          id: '',
          email: response.data.email,
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          fullName: response.data.fullName,
          roles: response.data.roles,
        }

        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(user.value))

        return true
      } else {
        error.value = response.data.errorMessage || 'Error al iniciar sesión'
        return false
      }
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { errorMessage?: string } } }
        error.value = axiosError.response?.data?.errorMessage || 'Error al iniciar sesión'
      } else {
        error.value = 'Error de conexión'
      }
      return false
    } finally {
      loading.value = false
    }
  }

  async function register(data: RegisterDto): Promise<boolean> {
    loading.value = true
    error.value = null

    try {
      const response = await api.post<AuthResponse>('/auth/register', data)

      if (response.data.success) {
        token.value = response.data.token
        user.value = {
          id: '',
          email: response.data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          fullName: response.data.fullName,
          roles: response.data.roles,
        }

        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(user.value))

        return true
      } else {
        error.value = response.data.errorMessage || 'Error al registrarse'
        return false
      }
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { errorMessage?: string } } }
        error.value = axiosError.response?.data?.errorMessage || 'Error al registrarse'
      } else {
        error.value = 'Error de conexión'
      }
      return false
    } finally {
      loading.value = false
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    init,
    login,
    register,
    logout,
  }
})

