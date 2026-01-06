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
</script>

<template>
  <AppLayout>
    <div class="course-detail-page">
      <!-- Breadcrumb -->
      <div class="breadcrumb">
        <button class="btn-back" @click="goBack">← Back to Courses</button>
      </div>

      <!-- Loading -->
      <div v-if="courseStore.loading && !courseStore.currentCourse" class="loading">
        <div class="spinner"></div>
        <p>Loading course...</p>
      </div>

      <!-- Course Info -->
      <div v-else-if="courseStore.currentCourse" class="course-info-section">
        <div class="course-header">
          <div>
            <span :class="['status-badge', courseStore.currentCourse.status.toLowerCase()]">
              {{ courseStore.currentCourse.status === 'Draft' ? '📝 Draft' : '✅ Published' }}
            </span>
            <h1>{{ courseStore.currentCourse.title }}</h1>
            <p class="course-meta">
              📖 {{ courseStore.currentCourse.totalLessons }} lessons •
              Last modified: {{ formatDate(courseStore.currentCourse.lastModified) }}
            </p>
          </div>
          <div class="course-actions">
            <button
              v-if="courseStore.currentCourse.status === 'Draft'"
              class="btn-publish"
              @click="handlePublish"
            >
              🚀 Publish
            </button>
            <button v-else class="btn-unpublish" @click="handleUnpublish">
              📥 Unpublish
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
          <h2>📖 Lessons</h2>
          <button class="btn-add-lesson" @click="handleCreateLesson">
            + New Lesson
          </button>
        </div>

        <!-- Error from lesson store -->
        <div v-if="lessonStore.error" class="error-message">
          {{ lessonStore.error }}
        </div>

        <!-- Loading -->
        <div v-if="lessonStore.loading && lessonStore.lessons.length === 0" class="loading">
          <div class="spinner"></div>
          <p>Loading lessons...</p>
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
          <div class="empty-icon">📖</div>
          <p>No lessons yet</p>
          <p class="hint">
            Add at least one lesson to publish this course
          </p>
          <button class="btn-add-lesson" @click="handleCreateLesson">
            Create first lesson
          </button>
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

<style scoped>
.course-detail-page {
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.breadcrumb {
  margin-bottom: 20px;
}

.btn-back {
  background: none;
  border: none;
  color: #667eea;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  padding: 8px 0;
  transition: color 0.3s;
}

.btn-back:hover {
  color: #764ba2;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e0e0e0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.course-info-section {
  background: white;
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.course-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.status-badge {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
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

.course-info-section h1 {
  margin: 0 0 12px 0;
  color: #1a1a2e;
  font-size: 28px;
}

.course-meta {
  color: #666;
  margin: 0;
  font-size: 15px;
}

.course-actions {
  display: flex;
  gap: 10px;
}

.btn-publish,
.btn-unpublish {
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-publish {
  background: linear-gradient(135deg, #28a745 0%, #218838 100%);
  color: white;
}

.btn-publish:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.4);
}

.btn-unpublish {
  background: #ffc107;
  color: #333;
}

.btn-unpublish:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 193, 7, 0.4);
}

.lessons-section {
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.lessons-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.lessons-header h2 {
  margin: 0;
  color: #1a1a2e;
  font-size: 22px;
}

.btn-add-lesson {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-add-lesson:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.lessons-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.empty-state {
  text-align: center;
  padding: 50px 20px;
  color: #666;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-state p {
  margin: 0 0 8px;
  font-size: 16px;
}

.hint {
  font-size: 14px;
  color: #999;
  margin-bottom: 20px !important;
}

.error-message {
  background: #fee;
  color: #c00;
  padding: 16px;
  border-radius: 10px;
  margin-top: 20px;
  text-align: center;
}
</style>
