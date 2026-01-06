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
  <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 bg-gray-50 rounded-xl p-3 md:p-4 hover:bg-gray-100 transition-all">
    <!-- Order Number -->
    <div class="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm md:text-base shrink-0">
      {{ lesson.order }}
    </div>

    <!-- Content -->
    <div class="flex-1 min-w-0 w-full sm:w-auto">
      <h4 class="font-semibold text-slate-800 truncate text-sm md:text-base">{{ lesson.title }}</h4>
      <p class="text-xs md:text-sm text-gray-500">Actualizado: {{ formatDate(lesson.updatedAt) }}</p>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
      <!-- Reorder -->
      <div class="flex gap-1">
        <button
          :disabled="lesson.order <= 1"
          @click="handleMoveUp"
          class="w-8 h-8 md:w-8 md:h-6 bg-gray-200 rounded text-xs md:text-sm hover:bg-indigo-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center"
        >
          ↑
        </button>
        <button
          :disabled="lesson.order >= totalLessons"
          @click="handleMoveDown"
          class="w-8 h-8 md:w-8 md:h-6 bg-gray-200 rounded text-xs md:text-sm hover:bg-indigo-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center"
        >
          ↓
        </button>
      </div>

      <!-- Edit -->
      <button
        @click="emit('edit', { id: lesson.id, title: lesson.title, order: lesson.order })"
        class="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-blue-50 hover:bg-blue-100 text-base md:text-lg transition-colors flex items-center justify-center"
        title="Editar"
      >
        ✏️
      </button>

      <!-- Delete -->
      <button
        @click="handleDelete"
        class="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-red-50 hover:bg-red-100 text-base md:text-lg transition-colors flex items-center justify-center"
        title="Eliminar"
      >
        🗑️
      </button>
    </div>
  </div>
</template>
