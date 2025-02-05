<template>
  <div class="centred" style="color:var(--white);margin-top: 3%;">
    <h1>Rejestracja obecności</h1>
  </div>
  <div class="centred" style="color:var(--white)">
    <h3>Pokaż swój kod QR do skanera</h3>
  </div>
  <div class="centred">
    <div class="qrReader"><qrcode-stream @detect="onDetect" /></div>
    <div v-if="isSaved" class="alert alert-success">Obecny jest {{ att.name }} {{ att.surname }}</div>
  </div>

</template>

<script setup lang="ts">
import { QrcodeStream } from 'vue-qrcode-reader'
import { onMounted, onUnmounted, ref } from 'vue'
import { Backend } from '@/main'
import { useRoute, useRouter } from 'vue-router'
import validateToken from '@/lib/Extensions/JWTDecodeLib'


const route = useRoute()
const router = useRouter()


const sessionId = Number(route.params.id)

const qrData = ref()
const isSaved = ref(false)
const att = ref()
const interval = ref()
const refreshInterval = 600000;


// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onDetect(detectedCodes: any) {
  qrData.value = detectedCodes
}


async function checkQrData() {
  if (qrData.value != undefined) {
    isSaved.value = true
    att.value = await Backend.courseSessionAttendanceRegister(qrData.value[0].rawValue);
    console.log(att.value)
  }

  if (isSaved.value) {
    setTimeout(() => {
      isSaved.value = false

      qrData.value = undefined
    }, 5000)
  }


}

onMounted(async () => {
  interval.value = setInterval(TryToken, refreshInterval);
  const scanerToken = await Backend.courseSessionAttendanceScannerTokenGet(sessionId);
  Backend.deviceTokenResult = scanerToken;

  setInterval(checkQrData, 5000);

})





onUnmounted(() => {
  if (interval.value) {
    clearInterval(interval.value);
  }
})

const TryToken = () => {
  const isValidToken = validateToken()

  if (isValidToken.isValid == true && isValidToken.role == 'teacher') {
    router.push(`/ScanningPage/${sessionId}`).then(() => { window.location.reload() })
  } else if (isValidToken.isValid == true && isValidToken.role == 'student') {
    router.push('/Student/StudentDashboard').then(() => { window.location.reload() })
  }
}

</script>
