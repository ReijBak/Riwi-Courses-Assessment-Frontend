<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCourseStore } from '@/stores/courses'
import { useAuthStore } from '@/stores/auth'
import AppLayout from '@/components/AppLayout.vue'
import CourseCard from '@/components/CourseCard.vue'
import CourseModal from '@/components/CourseModal.vue'

const router = useRouter()
const courseStore = useCourseStore()
const authStore = useAuthStore()

const searchQuery = ref('')
const statusFilter = ref('')
const showCreateModal = ref(false)
const editingCourse = ref<{ id: string; title: string } | null>(null)

onMounted(() => {
  authStore.init()
  loadCourses()
})

watch([searchQuery, statusFilter], () => {
  loadCourses()
})

async function loadCourses() {
  await courseStore.searchCourses(
    searchQuery.value,
    statusFilter.value,
    1,
    courseStore.pageSize,
  )
}

async function changePage(page: number) {
  await courseStore.searchCourses(
    searchQuery.value,
    statusFilter.value,
    page,
    courseStore.pageSize,
  )
}

function handleCreateCourse() {
  showCreateModal.value = true
  editingCourse.value = null
}

function handleEditCourse(course: { id: string; title: string }) {
  editingCourse.value = course
  showCreateModal.value = true
}

function handleCloseModal() {
  showCreateModal.value = false
  editingCourse.value = null
}

function handleViewCourse(id: string) {
  router.push(`/courses/${id}`)
}
</script>

<template>
  <AppLayout>
    <div class="p-8 w-full">
      <!-- Page Header -->
      <header class="flex justify-between items-start mb-8">
        <div>
          <h1 class="text-3xl font-bold text-slate-800">📚 Courses</h1>
          <p class="text-gray-500 mt-1">Manage your courses and lessons</p>
        </div>
        <button
          @click="handleCreateCourse"
          class="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all"
        >
          + New Course
        </button>
      </header>

      <!-- Filters -->
      <div class="flex flex-wrap gap-4 mb-8">
        <div class="flex-1 min-w-[250px]">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="🔍 Search courses..."
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all bg-white"
          />
        </div>
        <select
          v-model="statusFilter"
          class="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 outline-none bg-white min-w-[150px]"
        >
          <option value="">All Status</option>
          <option value="Draft">Draft</option>
          <option value="Published">Published</option>
        </select>
      </div>

      <!-- Error Message -->
      <div v-if="courseStore.error" class="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-center">
        {{ courseStore.error }}
      </div>

      <!-- Loading -->
      <div v-if="courseStore.loading" class="flex flex-col items-center justify-center py-20">
        <div class="w-10 h-10 border-3 border-gray-200 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
        <p class="text-gray-500">Loading courses...</p>
      </div>

      <!-- Course List -->
      <div v-else-if="courseStore.courses.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <CourseCard
          v-for="course in courseStore.courses"
          :key="course.id"
          :course="course"
          @edit="handleEditCourse"
          @view="handleViewCourse"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="flex flex-col items-center justify-center py-20 text-gray-500">
        <div class="text-6xl mb-4">📚</div>
        <p class="text-lg mb-6">No courses found</p>
        <button
          @click="handleCreateCourse"
          class="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg"
        >
          Create your first course
        </button>
      </div>

      <!-- Pagination -->
      <div v-if="courseStore.totalPages > 1" class="flex justify-center items-center gap-6 mt-10">
        <button
          :disabled="courseStore.currentPage === 1"
          @click="changePage(courseStore.currentPage - 1)"
          class="px-5 py-2.5 border-2 border-indigo-500 text-indigo-500 rounded-lg font-medium hover:bg-indigo-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          ← Previous
        </button>
        <span class="text-gray-600">
          Page {{ courseStore.currentPage }} of {{ courseStore.totalPages }}
          ({{ courseStore.totalCount }} courses)
        </span>
        <button
          :disabled="courseStore.currentPage === courseStore.totalPages"
          @click="changePage(courseStore.currentPage + 1)"
          class="px-5 py-2.5 border-2 border-indigo-500 text-indigo-500 rounded-lg font-medium hover:bg-indigo-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Next →
        </button>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <CourseModal
      v-if="showCreateModal"
      :course="editingCourse"
      @close="handleCloseModal"
    />
  </AppLayout>
</template>
