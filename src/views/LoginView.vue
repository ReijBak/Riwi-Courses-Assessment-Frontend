<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')

async function handleSubmit() {
  const success = await authStore.login({
    email: email.value,
    password: password.value,
  })

  if (success) {
    router.push('/dashboard')
  }
}

function goToRegister() {
  router.push('/register')
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-600 flex items-center justify-center p-5">
    <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md p-10">
      <!-- Header -->
      <div class="text-center mb-10">
        <h1 class="text-4xl mb-2">🎓</h1>
        <h2 class="text-2xl font-bold text-slate-800">Riwi Courses</h2>
        <p class="text-gray-500 mt-2">Sign in to your account</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div>
          <label for="email" class="block mb-2 text-gray-600 font-medium">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="admin@riwi.io"
            required
            class="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
          />
        </div>

        <div>
          <label for="password" class="block mb-2 text-gray-600 font-medium">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="••••••••"
            required
            class="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
          />
        </div>

        <div v-if="authStore.error" class="bg-red-50 text-red-600 p-3 rounded-xl text-center text-sm">
          {{ authStore.error }}
        </div>

        <button
          type="submit"
          :disabled="authStore.loading"
          class="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-lg rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
        >
          {{ authStore.loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>

      <!-- Footer -->
      <div class="mt-8 text-center">
        <p class="text-gray-500">
          Don't have an account?
          <button @click="goToRegister" class="text-indigo-500 font-semibold hover:underline ml-1">
            Sign Up
          </button>
        </p>
      </div>

      <!-- Demo Credentials -->
      <div class="mt-8 p-4 bg-gray-50 rounded-xl">
        <p class="text-sm font-semibold text-gray-700 mb-2">Demo Credentials:</p>
        <div class="text-sm text-gray-600 space-y-1">
          <p><span class="font-medium">Admin:</span> admin@riwi.io / Admin123!</p>
          <p><span class="font-medium">User:</span> user@riwi.io / User123!</p>
        </div>
      </div>
    </div>
  </div>
</template>
