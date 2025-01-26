<template>
  <h2 class="text-center mt-3">Drogi Użytkowniku</h2>
  <h1 class="text-center">Zaloguj się</h1>
  <form @submit.prevent="LogIn">
    <div class="form-group">
      <label for="loginname">Login</label>
      <input type="login" class="form-control" v-model="formData.loginName" id="login" placeholder="Enter login" />
    </div>
    <div class="form-group">
      <label for="password">Password</label>
      <input type="password" class="form-control" v-model="formData.password" id="password" placeholder="Password" />
    </div>
    <button type="submit" class="btn btn-primary" @click="LogIn()">Zaloguj</button>
  </form>
  <p v-if="formData.errorMessage" style="color: red">{{ formData.errorMessage }}</p>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Backend } from '@/main'
import { useRouter } from 'vue-router'
import validateToken from '@/lib/Extensions/JWTDecodeLib'

const router = useRouter()

const formData = ref({
  loginName: '',
  password: '',
  errorMessage: '',
})

onMounted(() => {
  const isValidToken = validateToken()

  if (isValidToken.isValid == true && isValidToken.role == 'teacher') {
    router.push('/Lecturer/LecturerDashboard')
  } else if (isValidToken.isValid == true && isValidToken.role == 'student') {
    router.push('/Student/StudentDashboard')
  }
})

const LogIn = async () => {

  const isValidToken = validateToken()
  try {
    await Backend.userLogin(formData.value.loginName, formData.value.password)

    if (isValidToken.isValid == true && isValidToken.role == 'teacher') {
      router.push('/Lecturer/LecturerDashboard')
    } else if (isValidToken.isValid == true && isValidToken.role == 'student') {
      router.push('/Student/StudentDashboard')
    }
  } catch {
    formData.value.errorMessage = 'Nie udało się zalogować. Sprawdź dane logowania.'
  }
}
</script>
