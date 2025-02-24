import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/views/LoginPage.vue'

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
    },
    {
      path: '/StudentDashboard',
      name: 'StudentDashboard',
      component: () => import('@/views/Student/StudentDashboard.vue'),
    },
    {
      path: '/LecturerDashboard/SelectedCourse/:id',
      name: 'SelectedCourse',
      component: () => import('@/views/Lecturer/SelectedCourse.vue'),
    },
    {
      path: '/StudentDashboard/SelectedCourse/:id/:courseId',
      name: 'SelectedCourseStudent',
      component: () => import('@/views/Student/SelectedCourse.vue'),
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
    },
  ],
})

export default router
