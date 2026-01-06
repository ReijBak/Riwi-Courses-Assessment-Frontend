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
  <div
    @click="emit('view', course.id)"
    class="bg-white rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer relative"
  >
    <!-- Admin Badge -->
    <div v-if="authStore.isAdmin" class="absolute -top-2 -right-2 px-2 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[10px] font-semibold rounded-lg">
      Admin
    </div>

    <!-- Status Badge -->
    <div class="mb-3 md:mb-4">
      <span
        class="inline-block px-2.5 md:px-3 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-medium"
        :class="course.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'"
      >
        {{ course.status === 'Draft' ? '📝 Draft' : '✅ Published' }}
      </span>
    </div>

    <!-- Title -->
    <h3 class="text-base md:text-lg font-semibold text-slate-800 mb-3 md:mb-4 line-clamp-2">{{ course.title }}</h3>

    <!-- Meta -->
    <div class="text-xs md:text-sm text-gray-500 mb-4 md:mb-5 space-y-1">
      <p>Creado: {{ formatDate(course.createdAt) }}</p>
      <p>Actualizado: {{ formatDate(course.updatedAt) }}</p>
    </div>

    <!-- Actions -->
    <div class="flex gap-2 pt-3 md:pt-4 border-t border-gray-100" @click.stop>
      <button
        v-if="course.status === 'Draft'"
        @click="handlePublish"
        class="flex-1 py-2 md:py-2.5 rounded-lg bg-green-50 hover:bg-green-100 text-base md:text-lg transition-colors"
        title="Publicar"
      >
        🚀
      </button>
      <button
        v-else
        @click="handleUnpublish"
        class="flex-1 py-2 md:py-2.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-base md:text-lg transition-colors"
        title="Despublicar"
      >
        📥
      </button>

      <button
        @click="emit('edit', { id: course.id, title: course.title })"
        class="flex-1 py-2 md:py-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-base md:text-lg transition-colors"
        title="Editar"
      >
        ✏️
      </button>

      <button
        @click="handleDelete"
        class="flex-1 py-2 md:py-2.5 rounded-lg bg-red-50 hover:bg-red-100 text-base md:text-lg transition-colors"
        title="Eliminar"
      >
        🗑️
      </button>
    </div>
  </div>
</template>
