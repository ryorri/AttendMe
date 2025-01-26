import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import LecturerDashboard from '@/views/LecturerViews/LecturerDashboard.vue'
import StudentDashboard from '@/views/StudentViews/StudentDashboard.vue'
import CourseDetails from '@/views/LecturerViews/LecturerComponents/CourseDetails.vue'
import RegisterDevice from '@/views/RegisterDevice.vue'
import ScanningPage from '@/views/LecturerViews/ScanningPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomePage,
    },
    {
      path: '/Lecturer/LecturerDashboard',
      name: 'LecturerDashboard',
      component: LecturerDashboard,
    },
    {
      path: '/Student/StudentDashboard',
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
    {
      path: '/scanningpage/:id',
      name: 'ScanningPage',
      component: ScanningPage,
    },
  ],
})

export default router
