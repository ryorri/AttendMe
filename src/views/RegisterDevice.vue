<template>
  Zarejestruj swoje urządzenie

  <form @submit.prevent="registerDevice">
    <div class="form-group">
      <label for="deviceName">Nazwa urządzenia</label>
      <input type="deviceName" class="form-control" v-model="formData.deviceName" id="login" />
    </div>
    <div class="form-group">
      <label for="studentName">Imię</label>
      <input type="studentName" class="form-control" v-model="formData.studentName" id="studentName" />
    </div>
    <div class="form-group">
      <label for="studentSurname">Nazwisko</label>
      <input type="studentSurname" class="form-control" v-model="formData.studentSurname" id="studentSurname" />
    </div>
    <div class="form-group">
      <label for="albumIdNumber">Nr albumu</label>
      <input type="albumIdNumber" class="form-control" v-model="formData.albumIdNumber" id="albumIdNumber" />
    </div>
    <button type="submit" class="btn btn-primary" @click="registerDevice()">Zarejestruj urządzenie</button>
  </form>

  <div v-if="successMessage">{{ successMessage }}</div>
  <div v-else>{{ errorMessage }}</div>

</template>
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { Backend } from '@/main';

import { onMounted, onUnmounted, ref } from 'vue'
import validateToken from '@/lib/Extensions/JWTDecodeLib'

const route = useRoute()
const router = useRouter()
const token = route.params.token.toString()

const formData = ref({
  deviceName: '',
  studentName: '',
  studentSurname: '',
  albumIdNumber: 0
})

const errorMessage = ref()
const successMessage = ref()
const interval = ref()
const refreshInterval = 60000;

const registerDevice = async () => {
  try {
    await Backend.userDeviceRegisterWithToken(token, formData.value)
    successMessage.value = 'Zarejestrowano! Możesz zamknać okno.'
  } catch {
    errorMessage.value = 'Nie udało się zarejestrowaĆ. Sprawdź dane.'
  }
}

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
    router.push('/Lecturer/LecturerDashboard').then(() => { window.location.reload() })
  } else if (isValidToken.isValid == true && isValidToken.role == 'student') {
    router.push('/Student/StudentDashboard').then(() => { window.location.reload() })
  }
}


</script>
