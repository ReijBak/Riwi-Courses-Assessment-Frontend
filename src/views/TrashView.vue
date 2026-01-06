<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCourseStore } from '@/stores/courses'
import { useAuthStore } from '@/stores/auth'
import AppLayout from '@/components/AppLayout.vue'

const router = useRouter()
const courseStore = useCourseStore()
const authStore = useAuthStore()

onMounted(async () => {
  authStore.init()

  // Only Admin can access this view
  if (!authStore.isAdmin) {
    router.push('/dashboard')
    return
  }

  await courseStore.getDeletedCourses()
})

async function handleRestore(id: string) {
  const success = await courseStore.restoreCourse(id)
  if (success) {
    // Optionally show success message
  }
}

async function handleHardDelete(id: string) {
  if (confirm('⚠️ This action cannot be undone. Are you sure you want to permanently delete this course and all its lessons?')) {
    await courseStore.hardDeleteCourse(id)
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <AppLayout>
    <div class="p-4 md:p-8 w-full">
      <!-- Header -->
      <header class="mb-8">
        <h1 class="text-2xl md:text-3xl font-bold text-slate-800">🗑️ Trash</h1>
        <p class="text-gray-500 mt-1">Manage deleted courses - Restore or permanently delete</p>
      </header>

      <!-- Warning Banner -->
      <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
        <span class="text-2xl">⚠️</span>
        <div>
          <p class="font-semibold text-amber-800">Admin Area</p>
          <p class="text-sm text-amber-700">
            Items here are soft-deleted. You can restore them or permanently delete them.
            Permanent deletion cannot be undone.
          </p>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="courseStore.error" class="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-center">
        {{ courseStore.error }}
      </div>

      <!-- Loading -->
      <div v-if="courseStore.loading" class="flex flex-col items-center justify-center py-20">
        <div class="w-10 h-10 border-3 border-gray-200 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
        <p class="text-gray-500">Loading deleted courses...</p>
      </div>

      <!-- Deleted Courses List -->
      <div v-else-if="courseStore.deletedCourses.length > 0" class="space-y-4">
        <div
          v-for="course in courseStore.deletedCourses"
          :key="course.id"
          class="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <span class="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">
                Deleted
              </span>
              <span
                class="px-2 py-1 text-xs font-semibold rounded"
                :class="course.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'"
              >
                {{ course.status }}
              </span>
            </div>
            <h3 class="text-lg font-semibold text-slate-800">{{ course.title }}</h3>
            <p class="text-sm text-gray-500">
              Deleted: {{ formatDate(course.updatedAt) }}
            </p>
          </div>

          <div class="flex gap-2 w-full sm:w-auto">
            <button
              @click="handleRestore(course.id)"
              class="flex-1 sm:flex-none px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              ♻️ Restore
            </button>
            <button
              @click="handleHardDelete(course.id)"
              class="flex-1 sm:flex-none px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              🗑️ Delete Forever
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="flex flex-col items-center justify-center py-20 text-gray-500">
        <div class="text-6xl mb-4">🎉</div>
        <p class="text-lg mb-2">Trash is empty</p>
        <p class="text-sm">No deleted courses to show</p>
      </div>
    </div>
  </AppLayout>
</template>

