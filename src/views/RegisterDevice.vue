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
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { Backend } from '@/main';


const route = useRoute()
const token = route.params.token.toString()

const formData = ref({
  deviceName: '',
  studentName: '',
  studentSurname: '',
  albumIdNumber: 0
})

const errorMessage = ref()
const successMessage = ref()


const registerDevice = async () => {
  try {
    await Backend.userDeviceRegisterWithToken(token, formData.value)
    successMessage.value = 'Zarejestrowano! Możesz zamknać okno.'
  } catch {
    errorMessage.value = 'Nie udało się zarejestrowaĆ. Sprawdź dane.'
  }
}


</script>
