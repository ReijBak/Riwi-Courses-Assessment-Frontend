<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const isOpen = ref(false)
const isMobile = ref(false)

const menuItems = computed(() => {
  const items = [
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
  ]

  // Add Trash option only for Admin
  if (authStore.isAdmin) {
    items.push({
      name: 'Trash',
      path: '/trash',
      icon: '🗑️',
      active: route.path === '/trash',
    })
  }

  return items
})

function checkMobile() {
  isMobile.value = window.innerWidth < 768
  if (!isMobile.value) {
    isOpen.value = false
  }
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

function toggleSidebar() {
  isOpen.value = !isOpen.value
}

function closeSidebar() {
  if (isMobile.value) {
    isOpen.value = false
  }
}

function navigate(path: string) {
  router.push(path)
  closeSidebar()
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <!-- Mobile Header -->
  <header v-if="isMobile" class="fixed top-0 left-0 right-0 h-16 bg-slate-900 z-40 flex items-center justify-between px-4">
    <button
      @click="toggleSidebar"
      class="w-10 h-10 flex flex-col items-center justify-center gap-1.5 text-white"
    >
      <span class="w-6 h-0.5 bg-white transition-all" :class="{ 'rotate-45 translate-y-2': isOpen }"></span>
      <span class="w-6 h-0.5 bg-white transition-all" :class="{ 'opacity-0': isOpen }"></span>
      <span class="w-6 h-0.5 bg-white transition-all" :class="{ '-rotate-45 -translate-y-2': isOpen }"></span>
    </button>
    <h1 class="text-xl font-bold text-white">🎓 Riwi Courses</h1>
    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
      {{ authStore.user?.firstName?.charAt(0) || 'U' }}
    </div>
  </header>

  <!-- Overlay for mobile -->
  <div
    v-if="isMobile && isOpen"
    class="fixed inset-0 bg-black/50 z-40"
    @click="closeSidebar"
  ></div>

  <!-- Sidebar -->
  <aside
    class="h-screen bg-gradient-to-b from-slate-900 to-slate-800 fixed left-0 top-0 z-50 flex flex-col transition-transform duration-300"
    :class="[
      isMobile ? 'w-72' : 'w-64',
      isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'
    ]"
  >
    <!-- Header -->
    <div class="p-6 border-b border-white/10 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white">🎓 Riwi</h1>
        <span class="text-indigo-400 text-sm font-medium">Courses</span>
      </div>
      <button
        v-if="isMobile"
        @click="closeSidebar"
        class="text-white/70 hover:text-white text-2xl"
      >
        ×
      </button>
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
          <span class="text-white text-sm font-medium truncate max-w-28">
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
