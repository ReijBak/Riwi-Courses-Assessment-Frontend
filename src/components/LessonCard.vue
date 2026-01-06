<script setup lang="ts">
import { useLessonStore } from '@/stores/lessons'
import type { Lesson } from '@/types'

const props = defineProps<{
  lesson: Lesson
  courseId: string
  totalLessons: number
}>()

const emit = defineEmits<{
  edit: [lesson: { id: string; title: string; order: number }]
}>()

const lessonStore = useLessonStore()

async function handleMoveUp() {
  if (props.lesson.order > 1) {
    await lessonStore.reorderLesson(props.lesson.id, props.lesson.order - 1, props.courseId)
  }
}

async function handleMoveDown() {
  if (props.lesson.order < props.totalLessons) {
    await lessonStore.reorderLesson(props.lesson.id, props.lesson.order + 1, props.courseId)
  }
}

async function handleDelete() {
  if (confirm('¿Estás seguro de que deseas eliminar esta lección?')) {
    await lessonStore.deleteLesson(props.lesson.id, props.courseId)
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('es-ES', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <div class="lesson-card">
    <div class="lesson-order">
      {{ lesson.order }}
    </div>

    <div class="lesson-content">
      <h4>{{ lesson.title }}</h4>
      <p class="lesson-meta">
        Actualizado: {{ formatDate(lesson.updatedAt) }}
      </p>
    </div>

    <div class="lesson-actions">
      <!-- Reorder buttons -->
      <div class="reorder-buttons">
        <button
          class="btn-reorder"
          :disabled="lesson.order <= 1"
          @click="handleMoveUp"
          title="Subir"
        >
          ↑
        </button>
        <button
          class="btn-reorder"
          :disabled="lesson.order >= totalLessons"
          @click="handleMoveDown"
          title="Bajar"
        >
          ↓
        </button>
      </div>

      <!-- Action buttons -->
      <button
        class="btn-action btn-edit"
        @click="emit('edit', { id: lesson.id, title: lesson.title, order: lesson.order })"
        title="Editar"
      >
        ✏️
      </button>
      <button
        class="btn-action btn-delete"
        @click="handleDelete"
        title="Eliminar"
      >
        🗑️
      </button>
    </div>
  </div>
</template>

<style scoped>
.lesson-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #f8f9fa;
  border-radius: 10px;
  padding: 16px 20px;
  transition: all 0.2s;
}

.lesson-card:hover {
  background: #f0f2f5;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.lesson-order {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  flex-shrink: 0;
}

.lesson-content {
  flex: 1;
}

.lesson-content h4 {
  margin: 0 0 4px 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
}

.lesson-meta {
  margin: 0;
  color: #888;
  font-size: 13px;
}

.lesson-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.reorder-buttons {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.btn-reorder {
  width: 32px;
  height: 24px;
  border: none;
  background: #e9ecef;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-reorder:hover:not(:disabled) {
  background: #667eea;
  color: white;
}

.btn-reorder:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.btn-action {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.2s;
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
</style>

