import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api'

export interface DashboardMetrics {
  totalCourses: number
  publishedCourses: number
  draftCourses: number
  totalLessons: number
  recentCourses: Array<{
    id: string
    title: string
    status: string
    totalLessons: number
    lastModified: string
  }>
}

export const useDashboardStore = defineStore('dashboard', () => {
  const metrics = ref<DashboardMetrics>({
    totalCourses: 0,
    publishedCourses: 0,
    draftCourses: 0,
    totalLessons: 0,
    recentCourses: [],
  })
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchMetrics(): Promise<void> {
    loading.value = true
    error.value = null

    try {
      // Fetch all courses to calculate metrics
      const [draftResponse, publishedResponse] = await Promise.all([
        api.get('/courses/search?status=Draft&pageSize=100'),
        api.get('/courses/search?status=Published&pageSize=100'),
      ])

      const draftCourses = draftResponse.data.courses || []
      const publishedCourses = publishedResponse.data.courses || []
      const allCourses = [...draftCourses, ...publishedCourses]

      // Get summaries for recent courses to count lessons
      const recentCoursesData = allCourses
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5)

      const summariesPromises = recentCoursesData.map((course) =>
        api.get(`/courses/${course.id}/summary`).catch(() => null),
      )

      const summaries = await Promise.all(summariesPromises)

      let totalLessons = 0
      const recentCourses = recentCoursesData.map((course, index) => {
        const summary = summaries[index]?.data
        const lessonCount = summary?.totalLessons || 0
        totalLessons += lessonCount
        return {
          id: course.id,
          title: course.title,
          status: course.status,
          totalLessons: lessonCount,
          lastModified: summary?.lastModified || course.updatedAt,
        }
      })

      metrics.value = {
        totalCourses: allCourses.length,
        publishedCourses: publishedCourses.length,
        draftCourses: draftCourses.length,
        totalLessons,
        recentCourses,
      }
    } catch (err) {
      error.value = 'Error loading dashboard metrics'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  return {
    metrics,
    loading,
    error,
    fetchMetrics,
  }
})

