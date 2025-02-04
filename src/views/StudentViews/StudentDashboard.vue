<template>
  <div class="header">
    Attend Me! App
  </div>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-2 ">
        <a href="#" class="buttons" @click="setComponentId(0)">Lista przedmiotów</a>
      </div>
      <div class="col-md-10 border border-primary">
        <div v-if="componentId == 0">
          <StudentCourses />
        </div>
        <div v-if="componentId == 1">
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-2 ">
        <a href="#" class="buttons" @click="setComponentId(1)">Funkcjonalność w tworzeniu</a>
      </div>
    </div>
  </div>
  <div class="logout_Button">
    <a href="#" class="buttons" @click="LogOut()">Wyloguj</a>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import validateToken from '@/lib/Extensions/JWTDecodeLib'
import { useRouter } from 'vue-router'
import StudentCourses from './StudentComponents/StudentCourses.vue'



const router = useRouter()
const componentId = ref(0)

const interval = ref()
const refreshInterval = 60000;

onMounted(() => {
  TryToken()
  interval.value = setInterval(TryToken, refreshInterval);
})

onUnmounted(() => {
  if (interval.value) {
    clearInterval(interval.value);
  }
})

const TryToken = () => {
  const isValidToken = validateToken()

  if (isValidToken.isValid == true && isValidToken.role == 'teacher') {
    router.push('/Lecturer/LecturerDashboard')
  } else if (isValidToken.isValid == true && isValidToken.role == 'student') {
    router.push('/Student/StudentDashboard')
  }
  else {
    router.push('/')
  }
}

const setComponentId = (id: number) => {
  componentId.value = id
}

const LogOut = () => {
  sessionStorage.removeItem('attend-me:userAuthData')
  window.location.reload()
}
</script>
