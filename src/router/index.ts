import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/views/LoginPage.vue'

function isTokenValid() {
  const rawUserAuthData = window.sessionStorage.getItem('attend-me:userAuthData')
  if (!rawUserAuthData) return false

  try {
    const userAuthData = JSON.parse(rawUserAuthData)
    if (!userAuthData.token || !userAuthData.expires) return false

    const expirationTime = new Date(userAuthData.expires).getTime()
    return expirationTime > Date.now()
  } catch (error) {
    console.error('Błąd sprawdzania tokena:', error)
    return false
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'LoginPage',
      component: LoginPage,
    },
    {
      path: '/LecturerDashboard',
      name: 'LecturerDashboard',
      component: () => import('@/views/Lecturer/LecturerDashboard.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/StudentDashboard',
      name: 'StudentDashboard',
      component: () => import('@/views/Student/StudentDashboard.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/LecturerDashboard/SelectedCourse/:id',
      name: 'SelectedCourse',
      component: () => import('@/views/Lecturer/SelectedCourse.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/StudentDashboard/SelectedCourse/:id/:courseId',
      name: 'SelectedCourseStudent',
      component: () => import('@/views/Student/SelectedCourse.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/RegisterDevice/:token',
      name: 'RegisterDevice',
      component: () => import('@/views/RegisterDevice.vue'),
    },
    {
      path: '/ScanningPage/:courseId',
      name: 'ScanningPage',
      component: () => import('@/views/ScanningPage.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

// 🔹 Obsługa błędu 401 przy przechodzeniu między stronami
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    if (!isTokenValid()) {
      console.warn('Błąd 401 - Token wygasł, przekierowanie do logowania')
      return next('/') // Przekierowanie na stronę logowania
    }
  }
  next()
})

export default router
