<template>
  <div class="container mt-5 text-center text-black">
    <h1 class="mb-3">Rejestracja obecności</h1>
    <h3 class="mb-4">Pokaż swój kod QR do skanera</h3>

    <div class="d-flex justify-content-center">
      <div class="card p-4 shadow-lg" style="max-width: 800px; width: 100%;">
        <qrcode-stream @detect="onDetect" class="qr-reader"></qrcode-stream>
      </div>
    </div>

    <div v-if="isSaved" class="alert alert-success mt-4">
      ✅ Obecny jest <strong>{{ att.name }} {{ att.surname }}</strong>
    </div>
  </div>
</template>

<style scoped>
.qr-reader {
  width: 100%;
  height: 300px;
}
</style>


<script setup lang="ts">
import { QrcodeStream } from 'vue-qrcode-reader';
import { onMounted, onUnmounted, ref } from 'vue';
import { Backend } from '@/main';
import { useRoute } from 'vue-router';

const route = useRoute();
const sessionId = Number(route.params.courseId);

const qrData = ref();
const isSaved = ref(false);
const att = ref();
const interval = ref();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onDetect(detectedCodes: any) {
  qrData.value = detectedCodes;
}

async function checkQrData() {
  if (qrData.value) {
    isSaved.value = true;
    att.value = await Backend.courseSessionAttendanceRegister(qrData.value[0].rawValue);
    console.log(att.value);

    setTimeout(() => {
      isSaved.value = false;
      qrData.value = undefined;
    }, 5000);
  }
}

onMounted(async () => {
  console.log(sessionId)
  const scanerToken = await Backend.courseSessionAttendanceScannerTokenGet(sessionId);
  Backend.deviceTokenResult = scanerToken;

  interval.value = setInterval(checkQrData, 5000);
});

onUnmounted(() => {
  if (interval.value) {
    clearInterval(interval.value);
  }
});
</script>
