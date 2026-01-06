<script setup lang="ts">
import { useCourseStore } from '@/stores/courses'
import { useAuthStore } from '@/stores/auth'
import type { Course } from '@/types'

const props = defineProps<{
  course: Course
}>()

const emit = defineEmits<{
  edit: [course: { id: string; title: string }]
  view: [id: string]
}>()

const courseStore = useCourseStore()
const authStore = useAuthStore()

async function handlePublish() {
  await courseStore.publishCourse(props.course.id)
}

async function handleUnpublish() {
  await courseStore.unpublishCourse(props.course.id)
}

async function handleDelete() {
  if (confirm('¿Estás seguro de que deseas eliminar este curso?')) {
    await courseStore.deleteCourse(props.course.id)
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>

<template>
  <div class="course-card" @click="emit('view', course.id)">
    <div class="card-header">
      <span :class="['status-badge', course.status.toLowerCase()]">
        {{ course.status === 'Draft' ? '📝 Borrador' : '✅ Publicado' }}
      </span>
    </div>

    <h3 class="card-title">{{ course.title }}</h3>

    <div class="card-meta">
      <p>Creado: {{ formatDate(course.createdAt) }}</p>
      <p>Actualizado: {{ formatDate(course.updatedAt) }}</p>
    </div>

    <div class="card-actions" @click.stop>
      <button
        v-if="course.status === 'Draft'"
        class="btn-action btn-publish"
        @click="handlePublish"
        title="Publicar curso"
      >
        🚀
      </button>
      <button
        v-else
        class="btn-action btn-unpublish"
        @click="handleUnpublish"
        title="Despublicar curso"
      >
        📥
      </button>

      <button
        class="btn-action btn-edit"
        @click="emit('edit', { id: course.id, title: course.title })"
        title="Editar curso"
      >
        ✏️
      </button>

      <button
        class="btn-action btn-delete"
        @click="handleDelete"
        title="Eliminar curso"
      >
        🗑️
      </button>
    </div>

    <div v-if="authStore.isAdmin" class="admin-badge">
      Admin
    </div>
  </div>
</template>

<style scoped>
.course-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
}

.course-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.card-header {
  margin-bottom: 16px;
}

.status-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

.status-badge.draft {
  background: #fff3cd;
  color: #856404;
}

.status-badge.published {
  background: #d4edda;
  color: #155724;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
  line-height: 1.4;
}

.card-meta {
  font-size: 13px;
  color: #888;
  margin-bottom: 20px;
}

.card-meta p {
  margin: 4px 0;
}

.card-actions {
  display: flex;
  gap: 8px;
  border-top: 1px solid #eee;
  padding-top: 16px;
}

.btn-action {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.2s;
}

.btn-publish {
  background: #e8f5e9;
}

.btn-publish:hover {
  background: #c8e6c9;
}

.btn-unpublish {
  background: #fff3e0;
}

.btn-unpublish:hover {
  background: #ffe0b2;
}

.btn-edit {
  background: #e3f2fd;
}

.btn-edit:hover {
  background: #bbdefb;
}

.btn-delete {
  background: #ffebee;
}

.btn-delete:hover {
  background: #ffcdd2;
}

.admin-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 10px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 10px;
}
</style>

