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
  <aside class="sidebar">
    <div class="sidebar-header">
      <h1 class="logo">🎓 Riwi</h1>
      <span class="logo-subtitle">Courses</span>
    </div>

    <nav class="sidebar-nav">
      <ul>
        <li
          v-for="item in menuItems"
          :key="item.path"
          :class="{ active: item.active }"
          @click="navigate(item.path)"
        >
          <span class="icon">{{ item.icon }}</span>
          <span class="label">{{ item.name }}</span>
        </li>
      </ul>
    </nav>

    <div class="sidebar-footer">
      <div class="user-info">
        <div class="user-avatar">
          {{ authStore.user?.firstName?.charAt(0) || 'U' }}
        </div>
        <div class="user-details">
          <span class="user-name">{{ authStore.user?.fullName }}</span>
          <span class="user-role" :class="{ admin: authStore.isAdmin }">
            {{ authStore.isAdmin ? 'Admin' : 'User' }}
          </span>
        </div>
      </div>
      <button class="btn-logout" @click="handleLogout" title="Logout">
        🚪
      </button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 260px;
  height: 100vh;
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
}

.sidebar-header {
  padding: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  font-size: 24px;
  color: white;
  margin: 0;
  font-weight: 700;
}

.logo-subtitle {
  color: #667eea;
  font-size: 14px;
  font-weight: 500;
  margin-left: 8px;
}

.sidebar-nav {
  flex: 1;
  padding: 20px 0;
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-nav li {
  display: flex;
  align-items: center;
  padding: 14px 24px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.3s;
  border-left: 3px solid transparent;
}

.sidebar-nav li:hover {
  background: rgba(255, 255, 255, 0.05);
  color: white;
}

.sidebar-nav li.active {
  background: rgba(102, 126, 234, 0.2);
  color: white;
  border-left-color: #667eea;
}

.sidebar-nav .icon {
  font-size: 20px;
  margin-right: 12px;
}

.sidebar-nav .label {
  font-size: 15px;
  font-weight: 500;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 16px;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  color: white;
  font-size: 14px;
  font-weight: 500;
}

.user-role {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}

.user-role.admin {
  color: #667eea;
}

.btn-logout {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.3s;
}

.btn-logout:hover {
  background: rgba(255, 77, 77, 0.2);
}
</style>

