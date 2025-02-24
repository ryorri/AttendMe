<template>
  <div class="d-flex justify-content-center align-items-center vh-100">
    <div class="d-flex flex-column w-50 border border-2 rounded p-4">
      <h2 class="text-center">Drogi Użytkowniku</h2>
      <h1 class="text-center">Zaloguj się</h1>
      <div class="text-center">
        <form @submit.prevent="LogIn">
          <div class="form-group w-100">
            <label for="loginname">Login</label>
            <input type="login" class="form-control" v-model="formData.loginName" id="login"
              placeholder="Enter login" />
          </div>
          <div class="form-group w-100 mt-3">
            <label for="password">Hasło</label>
            <input type="password" class="form-control" v-model="formData.password" id="password"
              placeholder="Password" />
          </div>
          <div class="text-center mt-4">
            <button type="submit" class="btn btn-primary" @click="LogIn()">Zaloguj</button>
          </div>
        </form>
      </div>
      <p class="text-center mt-3" v-if="formData.errorMessage" style="color: red">{{ formData.errorMessage }}</p>
    </div>
  </div>
</template>


<script setup lang="ts">

import { Backend } from '@/main'
import { ref } from 'vue'
import { useUserStore } from '@/stores/User'
import { useRouter } from 'vue-router'

const formData = ref({
  loginName: '',
  password: '',
  errorMessage: '',
})

const router = useRouter()

const LogIn = async () => {
  await Backend.userLogin(formData.value.loginName, formData.value.password)

  const user = await Backend.userGet(undefined)

  const userStore = useUserStore();
  userStore.setUser(user);


  if (userStore.isTeacher) {
    router.push({ name: 'LecturerDashboard' });
  }
  else if (userStore.isStudent) {
    router.push({ name: 'StudentDashboard' });
  }
}

</script>
