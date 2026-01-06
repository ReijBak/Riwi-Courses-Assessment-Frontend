<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCourseStore } from '@/stores/courses'
import { useLessonStore } from '@/stores/lessons'
import { useAuthStore } from '@/stores/auth'
import AppLayout from '@/components/AppLayout.vue'
import LessonCard from '@/components/LessonCard.vue'
import LessonModal from '@/components/LessonModal.vue'

const route = useRoute()
const router = useRouter()
const courseStore = useCourseStore()
const lessonStore = useLessonStore()
const authStore = useAuthStore()

const courseId = computed(() => route.params.id as string)
const showLessonModal = ref(false)
const editingLesson = ref<{ id: string; title: string; order: number } | null>(null)
const showDeletedLessons = ref(false)

onMounted(async () => {
  authStore.init()
  await loadCourseData()
})

async function loadCourseData() {
  await Promise.all([
    courseStore.getCourseSummary(courseId.value),
    lessonStore.getLessonsByCourse(courseId.value),
  ])

  // Load deleted lessons if Admin
  if (authStore.isAdmin) {
    await lessonStore.getDeletedLessonsByCourse(courseId.value)
  }
}

function handleCreateLesson() {
  showLessonModal.value = true
  editingLesson.value = null
}

function handleEditLesson(lesson: { id: string; title: string; order: number }) {
  editingLesson.value = lesson
  showLessonModal.value = true
}

function handleCloseModal() {
  showLessonModal.value = false
  editingLesson.value = null
}

async function handlePublish() {
  const success = await courseStore.publishCourse(courseId.value)
  if (success) {
    await courseStore.getCourseSummary(courseId.value)
  }
}

async function handleUnpublish() {
  const success = await courseStore.unpublishCourse(courseId.value)
  if (success) {
    await courseStore.getCourseSummary(courseId.value)
  }
}

function goBack() {
  router.push('/courses')
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getNextOrder() {
  if (lessonStore.lessons.length === 0) return 1
  return Math.max(...lessonStore.lessons.map((l) => l.order)) + 1
}

async function handleRestoreLesson(id: string) {
  await lessonStore.restoreLesson(id, courseId.value)
  await courseStore.getCourseSummary(courseId.value)
}

async function handleHardDeleteLesson(id: string) {
  if (confirm('⚠️ This action cannot be undone. Are you sure you want to permanently delete this lesson?')) {
    await lessonStore.hardDeleteLesson(id, courseId.value)
  }
}

function toggleDeletedLessons() {
  showDeletedLessons.value = !showDeletedLessons.value
}
</script>

<template>
  <AppLayout>
    <div class="p-4 md:p-8 w-full">
      <!-- Breadcrumb -->
      <button
        @click="goBack"
        class="text-indigo-500 hover:text-indigo-600 font-medium mb-4 md:mb-6 transition-colors text-sm md:text-base"
      >
        ← Back to Courses
      </button>

      <!-- Loading -->
      <div v-if="courseStore.loading && !courseStore.currentCourse" class="flex flex-col items-center justify-center py-20">
        <div class="w-10 h-10 border-3 border-gray-200 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
        <p class="text-gray-500">Loading course...</p>
      </div>

      <!-- Course Info -->
      <div v-else-if="courseStore.currentCourse" class="bg-white rounded-2xl p-4 md:p-8 shadow-sm mb-6 md:mb-8">
        <div class="flex flex-col sm:flex-row justify-between items-start gap-4 md:gap-6">
          <div class="w-full sm:w-auto">
            <span
              class="inline-block px-3 md:px-4 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-semibold mb-3 md:mb-4"
              :class="courseStore.currentCourse.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'"
            >
              {{ courseStore.currentCourse.status === 'Draft' ? '📝 Draft' : '✅ Published' }}
            </span>
            <h1 class="text-xl md:text-3xl font-bold text-slate-800 mb-2 md:mb-3">{{ courseStore.currentCourse.title }}</h1>
            <p class="text-gray-500 text-sm md:text-base">
              📖 {{ courseStore.currentCourse.totalLessons }} lessons •
              Last modified: {{ formatDate(courseStore.currentCourse.lastModified) }}
            </p>
          </div>
          <div class="flex gap-3 w-full sm:w-auto">
            <button
              v-if="courseStore.currentCourse.status === 'Draft'"
              @click="handlePublish"
              class="flex-1 sm:flex-none px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm md:text-base"
            >
              🚀 Publish
            </button>
            <button
              v-else
              @click="handleUnpublish"
              class="flex-1 sm:flex-none px-4 md:px-6 py-2.5 md:py-3 bg-amber-400 text-slate-800 font-semibold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm md:text-base"
            >
              📥 Unpublish
            </button>
          </div>
        </div>

        <!-- Error -->
        <div v-if="courseStore.error" class="bg-red-50 text-red-600 p-4 rounded-xl mt-6 text-center">
          {{ courseStore.error }}
        </div>
      </div>

      <!-- Lessons Section -->
      <div class="bg-white rounded-2xl p-4 md:p-8 shadow-sm">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 class="text-xl md:text-2xl font-semibold text-slate-800">📖 Lessons</h2>
          <button
            @click="handleCreateLesson"
            class="w-full sm:w-auto px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm md:text-base"
          >
            + New Lesson
          </button>
        </div>

        <!-- Error -->
        <div v-if="lessonStore.error" class="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-center">
          {{ lessonStore.error }}
        </div>

        <!-- Loading -->
        <div v-if="lessonStore.loading && lessonStore.lessons.length === 0" class="flex flex-col items-center justify-center py-16">
          <div class="w-10 h-10 border-3 border-gray-200 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
          <p class="text-gray-500">Loading lessons...</p>
        </div>

        <!-- Lessons List -->
        <div v-else-if="lessonStore.lessons.length > 0" class="space-y-3">
          <LessonCard
            v-for="lesson in lessonStore.lessons"
            :key="lesson.id"
            :lesson="lesson"
            :course-id="courseId"
            :total-lessons="lessonStore.lessons.length"
            @edit="handleEditLesson"
          />
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-16">
          <div class="text-6xl mb-4">📖</div>
          <p class="text-gray-600 text-lg mb-2">No lessons yet</p>
          <p class="text-gray-400 text-sm mb-6">Add at least one lesson to publish this course</p>
          <button
            @click="handleCreateLesson"
            class="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg"
          >
            Create first lesson
          </button>
        </div>
      </div>

      <!-- Deleted Lessons Section (Admin Only) -->
      <div v-if="authStore.isAdmin && lessonStore.deletedLessons.length > 0" class="bg-white rounded-2xl p-4 md:p-8 shadow-sm mt-6">
        <div class="flex justify-between items-center mb-4">
          <button
            @click="toggleDeletedLessons"
            class="flex items-center gap-2 text-lg font-semibold text-slate-800"
          >
            🗑️ Deleted Lessons ({{ lessonStore.deletedLessons.length }})
            <span class="text-sm text-gray-500">{{ showDeletedLessons ? '▼' : '▶' }}</span>
          </button>
        </div>

        <div v-if="showDeletedLessons" class="space-y-3">
          <div
            v-for="lesson in lessonStore.deletedLessons"
            :key="lesson.id"
            class="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-red-50 rounded-xl p-4 border border-red-100"
          >
            <div class="w-8 h-8 rounded-full bg-red-200 flex items-center justify-center text-red-600 font-bold text-sm shrink-0">
              {{ lesson.order }}
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="font-semibold text-slate-800 truncate">{{ lesson.title }}</h4>
              <p class="text-xs text-red-600">Deleted</p>
            </div>
            <div class="flex gap-2 w-full sm:w-auto">
              <button
                @click="handleRestoreLesson(lesson.id)"
                class="flex-1 sm:flex-none px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                ♻️ Restore
              </button>
              <button
                @click="handleHardDeleteLesson(lesson.id)"
                class="flex-1 sm:flex-none px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lesson Modal -->
    <LessonModal
      v-if="showLessonModal"
      :lesson="editingLesson"
      :course-id="courseId"
      :next-order="getNextOrder()"
      @close="handleCloseModal"
    />
  </AppLayout>
</template>
