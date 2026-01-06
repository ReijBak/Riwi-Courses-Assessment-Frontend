import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/courses',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/courses',
      name: 'courses',
      component: () => import('../views/CoursesView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/courses/:id',
      name: 'course-detail',
      component: () => import('../views/CourseDetailView.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

// Navigation guard
router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token')
  const isAuthenticated = !!token

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next('/courses')
  } else {
    next()
  }
})

export default router
