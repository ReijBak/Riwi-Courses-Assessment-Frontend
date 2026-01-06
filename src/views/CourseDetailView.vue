<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCourseStore } from '@/stores/courses'
import { useLessonStore } from '@/stores/lessons'
import { useAuthStore } from '@/stores/auth'
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

onMounted(async () => {
  authStore.init()
  await loadCourseData()
})

async function loadCourseData() {
  await Promise.all([
    courseStore.getCourseSummary(courseId.value),
    lessonStore.getLessonsByCourse(courseId.value),
  ])
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

function handleLogout() {
  authStore.logout()
  router.push('/login')
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('es-ES', {
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
</script>

<template>
  <div class="course-detail-page">
    <!-- Header -->
    <header class="header">
      <div class="header-content">
        <div class="header-left">
          <button class="btn-back" @click="goBack">← Volver</button>
          <h1>🎓 Riwi Courses</h1>
        </div>
        <div class="user-info">
          <span>{{ authStore.user?.fullName }}</span>
          <span v-if="authStore.isAdmin" class="badge-admin">Admin</span>
          <button class="btn-logout" @click="handleLogout">Cerrar Sesión</button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Loading -->
      <div v-if="courseStore.loading && !courseStore.currentCourse" class="loading">
        Cargando curso...
      </div>

      <!-- Course Info -->
      <div v-else-if="courseStore.currentCourse" class="course-info-section">
        <div class="course-header">
          <div>
            <span :class="['status-badge', courseStore.currentCourse.status.toLowerCase()]">
              {{ courseStore.currentCourse.status === 'Draft' ? '📝 Borrador' : '✅ Publicado' }}
            </span>
            <h2>{{ courseStore.currentCourse.title }}</h2>
            <p class="course-meta">
              📚 {{ courseStore.currentCourse.totalLessons }} lecciones •
              Última modificación: {{ formatDate(courseStore.currentCourse.lastModified) }}
            </p>
          </div>
          <div class="course-actions">
            <button
              v-if="courseStore.currentCourse.status === 'Draft'"
              class="btn-publish"
              @click="handlePublish"
            >
              🚀 Publicar
            </button>
            <button v-else class="btn-unpublish" @click="handleUnpublish">
              📥 Despublicar
            </button>
          </div>
        </div>

        <!-- Error from course store -->
        <div v-if="courseStore.error" class="error-message">
          {{ courseStore.error }}
        </div>
      </div>

      <!-- Lessons Section -->
      <div class="lessons-section">
        <div class="lessons-header">
          <h3>📖 Lecciones</h3>
          <button class="btn-add-lesson" @click="handleCreateLesson">
            + Nueva Lección
          </button>
        </div>

        <!-- Error from lesson store -->
        <div v-if="lessonStore.error" class="error-message">
          {{ lessonStore.error }}
        </div>

        <!-- Loading -->
        <div v-if="lessonStore.loading && lessonStore.lessons.length === 0" class="loading">
          Cargando lecciones...
        </div>

        <!-- Lessons List -->
        <div v-else-if="lessonStore.lessons.length > 0" class="lessons-list">
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
        <div v-else class="empty-state">
          <p>Este curso no tiene lecciones</p>
          <p class="hint">
            Agrega al menos una lección para poder publicar el curso
          </p>
          <button class="btn-add-lesson" @click="handleCreateLesson">
            Crear la primera lección
          </button>
        </div>
      </div>
    </main>

    <!-- Lesson Modal -->
    <LessonModal
      v-if="showLessonModal"
      :lesson="editingLesson"
      :course-id="courseId"
      :next-order="getNextOrder()"
      @close="handleCloseModal"
    />
  </div>
</template>

<style scoped>
.course-detail-page {
  min-height: 100vh;
  background: #f5f7fa;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.btn-back {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-back:hover {
  background: rgba(255, 255, 255, 0.3);
}

.header h1 {
  margin: 0;
  font-size: 24px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.badge-admin {
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.btn-logout {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-logout:hover {
  background: rgba(255, 255, 255, 0.3);
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
}

.course-info-section {
  background: white;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.course-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.status-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 12px;
}

.status-badge.draft {
  background: #fff3cd;
  color: #856404;
}

.status-badge.published {
  background: #d4edda;
  color: #155724;
}

.course-info-section h2 {
  margin: 0 0 12px 0;
  color: #333;
  font-size: 28px;
}

.course-meta {
  color: #666;
  margin: 0;
}

.course-actions {
  display: flex;
  gap: 10px;
}

.btn-publish,
.btn-unpublish {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-publish {
  background: linear-gradient(135deg, #28a745 0%, #218838 100%);
  color: white;
}

.btn-publish:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.4);
}

.btn-unpublish {
  background: #ffc107;
  color: #333;
}

.btn-unpublish:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 193, 7, 0.4);
}

.lessons-section {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.lessons-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.lessons-header h3 {
  margin: 0;
  color: #333;
  font-size: 20px;
}

.btn-add-lesson {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-add-lesson:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.lessons-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.loading,
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #666;
}

.empty-state .hint {
  font-size: 14px;
  color: #999;
  margin: 8px 0 20px;
}

.error-message {
  background: #fee;
  color: #c00;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
}
</style>

