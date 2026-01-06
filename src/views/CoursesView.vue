<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCourseStore } from '@/stores/courses'
import { useAuthStore } from '@/stores/auth'
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

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="courses-page">
    <!-- Header -->
    <header class="header">
      <div class="header-content">
        <h1>🎓 Riwi Courses</h1>
        <div class="user-info">
          <span>{{ authStore.user?.fullName }}</span>
          <span v-if="authStore.isAdmin" class="badge-admin">Admin</span>
          <button class="btn-logout" @click="handleLogout">Cerrar Sesión</button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Filters -->
      <div class="filters-section">
        <div class="search-box">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="🔍 Buscar cursos..."
          />
        </div>
        <div class="filter-status">
          <select v-model="statusFilter">
            <option value="">Todos los estados</option>
            <option value="Draft">Borrador</option>
            <option value="Published">Publicado</option>
          </select>
        </div>
        <button class="btn-create" @click="handleCreateCourse">
          + Nuevo Curso
        </button>
      </div>

      <!-- Error Message -->
      <div v-if="courseStore.error" class="error-message">
        {{ courseStore.error }}
      </div>

      <!-- Loading -->
      <div v-if="courseStore.loading" class="loading">
        Cargando cursos...
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
        <p>No se encontraron cursos</p>
        <button class="btn-create" @click="handleCreateCourse">
          Crear el primer curso
        </button>
      </div>

      <!-- Pagination -->
      <div v-if="courseStore.totalPages > 1" class="pagination">
        <button
          :disabled="courseStore.currentPage === 1"
          @click="changePage(courseStore.currentPage - 1)"
        >
          ← Anterior
        </button>
        <span>
          Página {{ courseStore.currentPage }} de {{ courseStore.totalPages }}
          ({{ courseStore.totalCount }} cursos)
        </span>
        <button
          :disabled="courseStore.currentPage === courseStore.totalPages"
          @click="changePage(courseStore.currentPage + 1)"
        >
          Siguiente →
        </button>
      </div>
    </main>

    <!-- Create/Edit Modal -->
    <CourseModal
      v-if="showCreateModal"
      :course="editingCourse"
      @close="handleCloseModal"
    />
  </div>
</template>

<style scoped>
.courses-page {
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
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box;
}

.search-box input:focus {
  outline: none;
  border-color: #667eea;
}

.filter-status select {
  padding: 12px 16px;
  border: 2px solid #e1e1e1;
  border-radius: 8px;
  font-size: 16px;
  background: white;
  cursor: pointer;
}

.filter-status select:focus {
  outline: none;
  border-color: #667eea;
}

.btn-create {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-create:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.loading,
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.empty-state .btn-create {
  margin-top: 20px;
}

.error-message {
  background: #fee;
  color: #c00;
  padding: 16px;
  border-radius: 8px;
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

