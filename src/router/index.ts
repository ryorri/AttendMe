import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import LecturerDashboard from '@/views/LecturerViews/LecturerDashboard.vue'
import StudentDashboard from '@/views/StudentViews/StudentDashboard.vue'
import CourseDetails from '@/views/LecturerViews/LecturerComponents/CourseDetails.vue'
import RegisterDevice from '@/views/RegisterDevice.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomePage,
    },
    {
      path: '/lecturerdashboard',
      name: 'LecturerDashboard',
      component: LecturerDashboard,
    },
    {
      path: '/studentdashboard',
      name: 'StudentDashboard',
      component: StudentDashboard,
    },
    {
      path: '/course/:id',
      name: 'CourseDetails',
      component: CourseDetails,
    },
    {
      path: '/registerdevice/:token',
      name: 'RegisterDevice',
      component: RegisterDevice,
    },
  ],
})

export default router
