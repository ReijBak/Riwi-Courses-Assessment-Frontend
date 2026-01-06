import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api'
import type { Lesson, CreateLessonDto, UpdateLessonDto } from '@/types'

export const useLessonStore = defineStore('lessons', () => {
  const lessons = ref<Lesson[]>([])
  const currentLesson = ref<Lesson | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function getLessonsByCourse(courseId: string): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const response = await api.get<Lesson[]>(`/lessons/course/${courseId}`)
      lessons.value = response.data
    } catch (err: unknown) {
      error.value = 'Error al cargar las lecciones'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function getLesson(id: string): Promise<Lesson | null> {
    loading.value = true
    error.value = null

    try {
      const response = await api.get<Lesson>(`/lessons/${id}`)
      currentLesson.value = response.data
      return response.data
    } catch (err: unknown) {
      error.value = 'Error al cargar la lección'
      console.error(err)
      return null
    } finally {
      loading.value = false
    }
  }

  async function createLesson(data: CreateLessonDto): Promise<Lesson | null> {
    loading.value = true
    error.value = null

    try {
      const response = await api.post<Lesson>('/lessons', data)
      await getLessonsByCourse(data.courseId)
      return response.data
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } }
        error.value = axiosError.response?.data?.message || 'Error al crear la lección'
      } else {
        error.value = 'Error al crear la lección'
      }
      console.error(err)
      return null
    } finally {
      loading.value = false
    }
  }

  async function updateLesson(id: string, data: UpdateLessonDto, courseId: string): Promise<Lesson | null> {
    loading.value = true
    error.value = null

    try {
      const response = await api.put<Lesson>(`/lessons/${id}`, data)
      await getLessonsByCourse(courseId)
      return response.data
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } }
        error.value = axiosError.response?.data?.message || 'Error al actualizar la lección'
      } else {
        error.value = 'Error al actualizar la lección'
      }
      console.error(err)
      return null
    } finally {
      loading.value = false
    }
  }

  async function deleteLesson(id: string, courseId: string): Promise<boolean> {
    loading.value = true
    error.value = null

    try {
      await api.delete(`/lessons/${id}`)
      await getLessonsByCourse(courseId)
      return true
    } catch (err: unknown) {
      error.value = 'Error al eliminar la lección'
      console.error(err)
      return false
    } finally {
      loading.value = false
    }
  }

  async function reorderLesson(id: string, newOrder: number, courseId: string): Promise<boolean> {
    loading.value = true
    error.value = null

    try {
      await api.patch(`/lessons/${id}/reorder`, newOrder)
      await getLessonsByCourse(courseId)
      return true
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } }
        error.value = axiosError.response?.data?.message || 'Error al reordenar la lección'
      } else {
        error.value = 'Error al reordenar la lección'
      }
      console.error(err)
      return false
    } finally {
      loading.value = false
    }
  }

  function clearLessons() {
    lessons.value = []
    currentLesson.value = null
  }

  // Admin only functions
  const deletedLessons = ref<Lesson[]>([])

  async function getDeletedLessonsByCourse(courseId: string): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const response = await api.get<Lesson[]>(`/lessons/course/${courseId}/deleted`)
      deletedLessons.value = response.data
    } catch (err: unknown) {
      error.value = 'Error al cargar lecciones eliminadas'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function restoreLesson(id: string, courseId: string): Promise<boolean> {
    loading.value = true
    error.value = null

    try {
      await api.patch(`/lessons/${id}/restore`)
      await getLessonsByCourse(courseId)
      await getDeletedLessonsByCourse(courseId)
      return true
    } catch (err: unknown) {
      error.value = 'Error al restaurar la lección'
      console.error(err)
      return false
    } finally {
      loading.value = false
    }
  }

  async function hardDeleteLesson(id: string, courseId: string): Promise<boolean> {
    loading.value = true
    error.value = null

    try {
      await api.delete(`/lessons/${id}/hard`)
      await getDeletedLessonsByCourse(courseId)
      return true
    } catch (err: unknown) {
      error.value = 'Error al eliminar permanentemente la lección'
      console.error(err)
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    lessons,
    deletedLessons,
    currentLesson,
    loading,
    error,
    getLessonsByCourse,
    getDeletedLessonsByCourse,
    getLesson,
    createLesson,
    updateLesson,
    deleteLesson,
    reorderLesson,
    restoreLesson,
    hardDeleteLesson,
    clearLessons,
  }
})

