<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  email: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
})

const localError = ref('')

async function handleSubmit() {
  localError.value = ''

  if (form.value.password !== form.value.confirmPassword) {
    localError.value = 'Las contraseñas no coinciden'
    return
  }

  if (form.value.password.length < 6) {
    localError.value = 'La contraseña debe tener al menos 6 caracteres'
    return
  }

  const success = await authStore.register({
    email: form.value.email,
    password: form.value.password,
    confirmPassword: form.value.confirmPassword,
    firstName: form.value.firstName,
    lastName: form.value.lastName,
  })

  if (success) {
    router.push('/courses')
  }
}

function goToLogin() {
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-600 flex items-center justify-center p-5">
    <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md p-10">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl mb-2">🎓</h1>
        <h2 class="text-2xl font-bold text-slate-800">Crear Cuenta</h2>
        <p class="text-gray-500 mt-2">Únete a Riwi Courses hoy</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="firstName" class="block mb-2 text-gray-600 font-medium text-sm">Nombre</label>
            <input
              id="firstName"
              v-model="form.firstName"
              type="text"
              placeholder="Juan"
              required
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
            />
          </div>
          <div>
            <label for="lastName" class="block mb-2 text-gray-600 font-medium text-sm">Apellido</label>
            <input
              id="lastName"
              v-model="form.lastName"
              type="text"
              placeholder="Pérez"
              required
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label for="email" class="block mb-2 text-gray-600 font-medium text-sm">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="juan@ejemplo.com"
            required
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
          />
        </div>

        <div>
          <label for="password" class="block mb-2 text-gray-600 font-medium text-sm">Contraseña</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            placeholder="••••••••"
            required
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
          />
        </div>

        <div>
          <label for="confirmPassword" class="block mb-2 text-gray-600 font-medium text-sm">Confirmar Contraseña</label>
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            placeholder="••••••••"
            required
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
          />
        </div>

        <div v-if="localError || authStore.error" class="bg-red-50 text-red-600 p-3 rounded-xl text-center text-sm">
          {{ localError || authStore.error }}
        </div>

        <button
          type="submit"
          :disabled="authStore.loading"
          class="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-lg rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed transition-all mt-2"
        >
          {{ authStore.loading ? 'Creando cuenta...' : 'Registrarse' }}
        </button>
      </form>

      <!-- Footer -->
      <div class="mt-6 text-center">
        <p class="text-gray-500">
          ¿Ya tienes cuenta?
          <button @click="goToLogin" class="text-indigo-500 font-semibold hover:underline ml-1">
            Inicia sesión
          </button>
        </p>
      </div>
    </div>
  </div>
</template>
