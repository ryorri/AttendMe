<template>
  <div class="container-fluid vh-100 border border-primary">
    <div class="row">
      <div class="col-md-2 border border-primary">
        <button @click="setComponentId(0)">Kursy</button>
      </div>
      <div class="col-md-10 border border-primary">
        <div v-if="componentId == 0">
          <LecturerCourses />
        </div>
        <div v-if="componentId == 1">
          <ScanningPage />
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-2 border border-primary">
        <button @click="setComponentId(1)">Rejestracja urządzenia</button>
      </div>
    </div>
  </div>
</template>

<style lang="css">
.row {
  height: 20vh;
}

.col-md-10 {
  height: 100vh;
  overflow-y: auto;
}
</style>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import validateToken from '@/lib/Extensions/JWTDecodeLib'
import { useRouter } from 'vue-router'
import LecturerCourses from './LecturerComponents/LecturerCourses.vue'
import ScanningPage from './ScanningPage.vue'


const router = useRouter()
const componentId = ref(0)

onMounted(() => {
  const isValidToken = validateToken()

  if (isValidToken.isValid == true && isValidToken.role == 'teacher') {
    router.push('/Lecturer/LecturerDashboard')
  } else if (isValidToken.isValid == true && isValidToken.role == 'student') {
    router.push('/Student/StudentDashboard')
  } else {
    router.push('/')
  }
})

const setComponentId = (id: number) => {
  componentId.value = id
}
</script>
