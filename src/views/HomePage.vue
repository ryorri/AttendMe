<template>

  <h2 class="text-center top-margin">Drogi Użytkowniku</h2>
  <h1 class="text-center">Zaloguj się</h1>
  <div class="centred">
    <form class="border border-2 rounded login" @submit.prevent="LogIn">
      <div class="form-group">
        <label for="loginname">Login</label>
        <input type="login" class="form-control" v-model="formData.loginName" id="login" placeholder="Enter login" />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" class="form-control" v-model="formData.password" id="password" placeholder="Password" />
      </div>
      <div class="centred top-margin">
        <button type="submit" class="btn" @click="LogIn()">Zaloguj</button>
      </div>
    </form>
  </div>
  <p class="text-center" v-if="formData.errorMessage" style="color: red">{{ formData.errorMessage }}</p>
</template>

<style lang="css">
.btn {
  background-color: var(--darkgreen);
}

.btn:hover {
  background-color: var(--green);
}
</style>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { Backend } from '@/main'
import { useRouter } from 'vue-router'
import validateToken from '@/lib/Extensions/JWTDecodeLib'

const router = useRouter()

const formData = ref({
  loginName: '',
  password: '',
  errorMessage: '',
})


const interval = ref()
const refreshInterval = 60000;

onMounted(() => {
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
  } else {
    router.push('/')
  }
}

const LogIn = async () => {


  const isValidToken = validateToken()
  try {
    await Backend.userLogin(formData.value.loginName, formData.value.password)

    if (isValidToken.isValid == true && isValidToken.role == 'teacher') {
      router.push('/Lecturer/LecturerDashboard').then(() => { window.location.reload() })
    } else if (isValidToken.isValid == true && isValidToken.role == 'student') {
      router.push('/Student/StudentDashboard').then(() => { window.location.reload() })
    }
  } catch {
    formData.value.errorMessage = 'Nie udało się zalogować. Sprawdź dane logowania.'
  }
}
</script>
