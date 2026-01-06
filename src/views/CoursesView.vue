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
    <div class="courses-page">
      <!-- Page Header -->
      <header class="page-header">
        <div>
          <h1>📚 Courses</h1>
          <p class="subtitle">Manage your courses and lessons</p>
        </div>
        <button class="btn-create" @click="handleCreateCourse">
          + New Course
        </button>
      </header>

      <!-- Filters -->
      <div class="filters-section">
        <div class="search-box">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="🔍 Search courses..."
          />
        </div>
        <div class="filter-status">
          <select v-model="statusFilter">
            <option value="">All Status</option>
            <option value="Draft">Draft</option>
            <option value="Published">Published</option>
          </select>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="courseStore.error" class="error-message">
        {{ courseStore.error }}
      </div>

      <!-- Loading -->
      <div v-if="courseStore.loading" class="loading">
        <div class="spinner"></div>
        <p>Loading courses...</p>
      </div>

      <!-- Course List -->
      <div v-else-if="courseStore.courses.length > 0" class="courses-grid">
        <CourseCard
          v-for="course in courseStore.courses"
          :key="course.id"
          :course="course"
          @edit="handleEditCourse"
          @view="handleViewCourse"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-icon">📚</div>
        <p>No courses found</p>
        <button class="btn-create" @click="handleCreateCourse">
          Create your first course
        </button>
      </div>

      <!-- Pagination -->
      <div v-if="courseStore.totalPages > 1" class="pagination">
        <button
          :disabled="courseStore.currentPage === 1"
          @click="changePage(courseStore.currentPage - 1)"
        >
          ← Previous
        </button>
        <span>
          Page {{ courseStore.currentPage }} of {{ courseStore.totalPages }}
          ({{ courseStore.totalCount }} courses)
        </span>
        <button
          :disabled="courseStore.currentPage === courseStore.totalPages"
          @click="changePage(courseStore.currentPage + 1)"
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

<style scoped>
.courses-page {
  padding: 30px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 28px;
  color: #1a1a2e;
  margin: 0 0 8px 0;
}

.subtitle {
  color: #666;
  margin: 0;
  font-size: 15px;
}

.btn-create {
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

.btn-create:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.filters-section {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 250px;
}

.search-box input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e1e1;
  border-radius: 10px;
  font-size: 15px;
  box-sizing: border-box;
  background: white;
  transition: all 0.3s;
}

.search-box input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.filter-status select {
  padding: 12px 16px;
  border: 2px solid #e1e1e1;
  border-radius: 10px;
  font-size: 15px;
  background: white;
  cursor: pointer;
  min-width: 150px;
}

.filter-status select:focus {
  outline: none;
  border-color: #667eea;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.loading,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
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

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-state p {
  margin-bottom: 20px;
  font-size: 16px;
}

.error-message {
  background: #fee;
  color: #c00;
  padding: 16px;
  border-radius: 10px;
  margin-bottom: 20px;
  text-align: center;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 30px;
  padding: 20px;
}

.pagination button {
  background: white;
  border: 2px solid #667eea;
  color: #667eea;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.pagination button:hover:not(:disabled) {
  background: #667eea;
  color: white;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination span {
  color: #666;
}
</style>
