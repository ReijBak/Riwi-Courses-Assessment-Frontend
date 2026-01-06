<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const menuItems = computed(() => [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: '📊',
    active: route.path === '/dashboard',
  },
  {
    name: 'Courses',
    path: '/courses',
    icon: '📚',
    active: route.path.startsWith('/courses'),
  },
])

function navigate(path: string) {
  router.push(path)
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <aside class="w-64 h-screen bg-gradient-to-b from-slate-900 to-slate-800 fixed left-0 top-0 z-50 flex flex-col">
    <!-- Header -->
    <div class="p-6 border-b border-white/10">
      <h1 class="text-2xl font-bold text-white">🎓 Riwi</h1>
      <span class="text-indigo-400 text-sm font-medium ml-2">Courses</span>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 py-5">
      <ul class="space-y-1">
        <li
          v-for="item in menuItems"
          :key="item.path"
          @click="navigate(item.path)"
          class="flex items-center px-6 py-3.5 cursor-pointer transition-all duration-300 border-l-4"
          :class="item.active
            ? 'bg-indigo-500/20 text-white border-indigo-500'
            : 'text-white/70 border-transparent hover:bg-white/5 hover:text-white'"
        >
          <span class="text-xl mr-3">{{ item.icon }}</span>
          <span class="font-medium">{{ item.name }}</span>
        </li>
      </ul>
    </nav>

    <!-- Footer -->
    <div class="p-5 border-t border-white/10 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
          {{ authStore.user?.firstName?.charAt(0) || 'U' }}
        </div>
        <div class="flex flex-col">
          <span class="text-white text-sm font-medium truncate max-w-[120px]">
            {{ authStore.user?.fullName }}
          </span>
          <span
            class="text-xs"
            :class="authStore.isAdmin ? 'text-indigo-400' : 'text-white/50'"
          >
            {{ authStore.isAdmin ? 'Admin' : 'User' }}
          </span>
        </div>
      </div>
      <button
        @click="handleLogout"
        class="w-9 h-9 rounded-lg bg-white/10 hover:bg-red-500/20 transition-colors flex items-center justify-center"
        title="Logout"
      >
        🚪
      </button>
    </div>
  </aside>
</template>
