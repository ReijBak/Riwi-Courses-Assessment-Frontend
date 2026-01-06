import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api'
import type { Course, CourseSummary, CourseSearchResult, CreateCourseDto, UpdateCourseDto } from '@/types'

export const useCourseStore = defineStore('courses', () => {
  const courses = ref<Course[]>([])
  const currentCourse = ref<CourseSummary | null>(null)
  const totalCount = ref(0)
  const totalPages = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(10)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function searchCourses(
    query: string = '',
    status: string = '',
    page: number = 1,
    size: number = 10,
  ): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const params = new URLSearchParams()
      if (query) params.append('q', query)
      if (status) params.append('status', status)
      params.append('page', page.toString())
      params.append('pageSize', size.toString())

      const response = await api.get<CourseSearchResult>(`/courses/search?${params.toString()}`)

      courses.value = response.data.courses
      totalCount.value = response.data.totalCount
      totalPages.value = response.data.totalPages
      currentPage.value = response.data.page
      pageSize.value = response.data.pageSize
    } catch (err: unknown) {
      error.value = 'Error al cargar los cursos'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function getCourse(id: string): Promise<Course | null> {
    loading.value = true
    error.value = null

    try {
      const response = await api.get<Course>(`/courses/${id}`)
      return response.data
    } catch (err: unknown) {
      error.value = 'Error al cargar el curso'
      console.error(err)
      return null
    } finally {
      loading.value = false
    }
  }

  async function getCourseSummary(id: string): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const response = await api.get<CourseSummary>(`/courses/${id}/summary`)
      currentCourse.value = response.data
    } catch (err: unknown) {
      error.value = 'Error al cargar el resumen del curso'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function createCourse(data: CreateCourseDto): Promise<Course | null> {
    loading.value = true
    error.value = null

    try {
      const response = await api.post<Course>('/courses', data)
      await searchCourses('', '', currentPage.value, pageSize.value)
      return response.data
    } catch (err: unknown) {
      error.value = 'Error al crear el curso'
      console.error(err)
      return null
    } finally {
      loading.value = false
    }
  }

  async function updateCourse(id: string, data: UpdateCourseDto): Promise<Course | null> {
    loading.value = true
    error.value = null

    try {
      const response = await api.put<Course>(`/courses/${id}`, data)
      await searchCourses('', '', currentPage.value, pageSize.value)
      return response.data
    } catch (err: unknown) {
      error.value = 'Error al actualizar el curso'
      console.error(err)
      return null
    } finally {
      loading.value = false
    }
  }

  async function deleteCourse(id: string): Promise<boolean> {
    loading.value = true
    error.value = null

    try {
      await api.delete(`/courses/${id}`)
      await searchCourses('', '', currentPage.value, pageSize.value)
      return true
    } catch (err: unknown) {
      error.value = 'Error al eliminar el curso'
      console.error(err)
      return false
    } finally {
      loading.value = false
    }
  }

  async function publishCourse(id: string): Promise<boolean> {
    loading.value = true
    error.value = null

    try {
      await api.patch(`/courses/${id}/publish`)
      await searchCourses('', '', currentPage.value, pageSize.value)
      return true
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } }
        error.value = axiosError.response?.data?.message || 'Error al publicar el curso'
      } else {
        error.value = 'Error al publicar el curso'
      }
      console.error(err)
      return false
    } finally {
      loading.value = false
    }
  }

  async function unpublishCourse(id: string): Promise<boolean> {
    loading.value = true
    error.value = null

    try {
      await api.patch(`/courses/${id}/unpublish`)
      await searchCourses('', '', currentPage.value, pageSize.value)
      return true
    } catch (err: unknown) {
      error.value = 'Error al despublicar el curso'
      console.error(err)
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    courses,
    currentCourse,
    totalCount,
    totalPages,
    currentPage,
    pageSize,
    loading,
    error,
    searchCourses,
    getCourse,
    getCourseSummary,
    createCourse,
    updateCourse,
    deleteCourse,
    publishCourse,
    unpublishCourse,
  }
})

