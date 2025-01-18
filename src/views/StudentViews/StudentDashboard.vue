<template>Yaay</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import validateToken from '@/lib/Extensions/JWTDecodeLib'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  const isValidToken = validateToken()

  if (isValidToken.isValid == true && isValidToken.role == 'teacher') {
    router.push('/LecturerDashboard')
  } else if (isValidToken.isValid == true && isValidToken.role == 'student') {
    router.push('/StudentDashboard')
  } else {
    router.push('/')
  }
})
</script>
