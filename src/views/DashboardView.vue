<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDashboardStore } from '@/stores/dashboard'
import { useAuthStore } from '@/stores/auth'
import AppLayout from '@/components/AppLayout.vue'

const router = useRouter()
const dashboardStore = useDashboardStore()
const authStore = useAuthStore()

onMounted(async () => {
  authStore.init()
  await dashboardStore.fetchMetrics()
})

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function navigateToCourse(id: string) {
  router.push(`/courses/${id}`)
}

function navigateToCourses() {
  router.push('/courses')
}
</script>

<template>
  <AppLayout>
    <div class="p-8 w-full">
      <!-- Header -->
      <header class="flex justify-between items-start mb-8">
        <div>
          <h1 class="text-3xl font-bold text-slate-800">Dashboard</h1>
          <p class="text-gray-500 mt-1">
            Welcome back, <strong>{{ authStore.user?.firstName }}</strong>! 👋
          </p>
        </div>
        <button
          @click="navigateToCourses"
          class="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all"
        >
          📚 Manage Courses
        </button>
      </header>

      <!-- Loading State -->
      <div v-if="dashboardStore.loading" class="flex flex-col items-center justify-center py-20">
        <div class="w-10 h-10 border-3 border-gray-200 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
        <p class="text-gray-500">Loading metrics...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="dashboardStore.error" class="text-center py-20">
        <p class="text-red-500 mb-4">{{ dashboardStore.error }}</p>
        <button
          @click="dashboardStore.fetchMetrics()"
          class="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
        >
          Retry
        </button>
      </div>

      <!-- Dashboard Content -->
      <div v-else class="space-y-8">
        <!-- Metrics Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
            <div class="flex items-center gap-5">
              <div class="w-14 h-14 rounded-xl bg-indigo-100 flex items-center justify-center text-3xl">📚</div>
              <div>
                <span class="text-4xl font-bold text-slate-800">{{ dashboardStore.metrics.totalCourses }}</span>
                <p class="text-gray-500 text-sm mt-1">Total Courses</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
            <div class="flex items-center gap-5">
              <div class="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center text-3xl">✅</div>
              <div>
                <span class="text-4xl font-bold text-slate-800">{{ dashboardStore.metrics.publishedCourses }}</span>
                <p class="text-gray-500 text-sm mt-1">Published</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
            <div class="flex items-center gap-5">
              <div class="w-14 h-14 rounded-xl bg-amber-100 flex items-center justify-center text-3xl">📝</div>
              <div>
                <span class="text-4xl font-bold text-slate-800">{{ dashboardStore.metrics.draftCourses }}</span>
                <p class="text-gray-500 text-sm mt-1">Drafts</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
            <div class="flex items-center gap-5">
              <div class="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center text-3xl">📖</div>
              <div>
                <span class="text-4xl font-bold text-slate-800">{{ dashboardStore.metrics.totalLessons }}</span>
                <p class="text-gray-500 text-sm mt-1">Total Lessons</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Course Distribution -->
          <div class="bg-white rounded-2xl p-6 shadow-sm">
            <h3 class="text-lg font-semibold text-slate-800 mb-5">Course Distribution</h3>
            <div class="flex items-center gap-8">
              <div class="relative w-36 h-36">
                <svg viewBox="0 0 100 100" class="w-full h-full">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" stroke-width="20" />
                  <circle
                    cx="50" cy="50" r="40" fill="none" stroke="#22c55e" stroke-width="20"
                    :stroke-dasharray="`${(dashboardStore.metrics.publishedCourses / Math.max(dashboardStore.metrics.totalCourses, 1)) * 251.2} 251.2`"
                    stroke-dashoffset="0" transform="rotate(-90 50 50)"
                  />
                </svg>
                <div class="absolute inset-0 flex flex-col items-center justify-center">
                  <span class="text-2xl font-bold text-slate-800">
                    {{ dashboardStore.metrics.totalCourses > 0
                      ? Math.round((dashboardStore.metrics.publishedCourses / dashboardStore.metrics.totalCourses) * 100)
                      : 0 }}%
                  </span>
                  <span class="text-xs text-gray-500">Published</span>
                </div>
              </div>
              <div class="space-y-3">
                <div class="flex items-center gap-3">
                  <span class="w-3 h-3 rounded bg-green-500"></span>
                  <span class="text-gray-600">Published ({{ dashboardStore.metrics.publishedCourses }})</span>
                </div>
                <div class="flex items-center gap-3">
                  <span class="w-3 h-3 rounded bg-gray-300"></span>
                  <span class="text-gray-600">Draft ({{ dashboardStore.metrics.draftCourses }})</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Stats -->
          <div class="bg-white rounded-2xl p-6 shadow-sm">
            <h3 class="text-lg font-semibold text-slate-800 mb-5">Quick Stats</h3>
            <div class="space-y-5">
              <div class="flex justify-between items-center pb-4 border-b border-gray-100">
                <span class="text-gray-600">Avg. Lessons per Course</span>
                <span class="text-xl font-semibold text-slate-800">
                  {{ dashboardStore.metrics.totalCourses > 0
                    ? (dashboardStore.metrics.totalLessons / dashboardStore.metrics.totalCourses).toFixed(1)
                    : 0 }}
                </span>
              </div>
              <div class="flex justify-between items-center pb-4 border-b border-gray-100">
                <span class="text-gray-600">Publication Rate</span>
                <span class="text-xl font-semibold text-slate-800">
                  {{ dashboardStore.metrics.totalCourses > 0
                    ? Math.round((dashboardStore.metrics.publishedCourses / dashboardStore.metrics.totalCourses) * 100)
                    : 0 }}%
                </span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">User Role</span>
                <span
                  class="px-3 py-1 rounded-full text-sm font-medium"
                  :class="authStore.isAdmin ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'"
                >
                  {{ authStore.isAdmin ? 'Administrator' : 'User' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-white rounded-2xl p-6 shadow-sm">
          <div class="flex justify-between items-center mb-5">
            <h3 class="text-lg font-semibold text-slate-800">📅 Recent Activity</h3>
            <button @click="navigateToCourses" class="text-indigo-500 hover:text-indigo-600 font-medium text-sm">
              View All →
            </button>
          </div>

          <div v-if="dashboardStore.metrics.recentCourses.length > 0" class="space-y-3">
            <div
              v-for="course in dashboardStore.metrics.recentCourses"
              :key="course.id"
              @click="navigateToCourse(course.id)"
              class="flex justify-between items-center p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 hover:translate-x-1 transition-all"
            >
              <div>
                <p class="font-semibold text-slate-800">{{ course.title }}</p>
                <p class="text-sm text-gray-500">
                  {{ course.totalLessons }} lessons • Updated {{ formatDate(course.lastModified) }}
                </p>
              </div>
              <span
                class="px-3 py-1.5 rounded-full text-xs font-semibold"
                :class="course.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'"
              >
                {{ course.status }}
              </span>
            </div>
          </div>

          <div v-else class="text-center py-10">
            <p class="text-gray-500 mb-4">No courses yet. Create your first course!</p>
            <button
              @click="navigateToCourses"
              class="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg"
            >
              + Create Course
            </button>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
/* No custom styles needed, using Tailwind CSS classes */
</style>
