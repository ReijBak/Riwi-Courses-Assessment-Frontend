// Auth types
export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
}

export interface AuthResponse {
  success: boolean
  token: string
  email: string
  fullName: string
  roles: string[]
  expiration: string
  errorMessage?: string
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  fullName: string
  roles: string[]
}

// Course types
export interface Course {
  id: string
  title: string
  status: 'Draft' | 'Published'
  createdAt: string
  updatedAt: string
}

export interface CourseSummary {
  id: string
  title: string
  status: string
  totalLessons: number
  lastModified: string
}

export interface CourseSearchResult {
  courses: Course[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

export interface CreateCourseDto {
  title: string
}

export interface UpdateCourseDto {
  title: string
}

// Lesson types
export interface Lesson {
  id: string
  courseId: string
  title: string
  order: number
  createdAt: string
  updatedAt: string
}

export interface CreateLessonDto {
  courseId: string
  title: string
  order: number
}

export interface UpdateLessonDto {
  title: string
  order: number
}

