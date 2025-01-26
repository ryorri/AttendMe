<template>


  <div v-if="isSaved">Zapisano!</div>
  <div v-if="qrData">{{ qrData.value }}!</div>
  <qrcode-stream @detect="onDetect" />


  <button @click="checkData()">Check</button>

</template>

<script setup lang="ts">
import { QrcodeStream } from 'vue-qrcode-reader'
import { onMounted, ref } from 'vue'
import { Backend } from '@/main'

const qrData = ref()
const isSaved = ref(false)


const checkData = () => {
  console.log(qrData.value)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onDetect(detectedCodes: any) {
  qrData.value = detectedCodes
}


async function checkQrData() {
  if (qrData.value != undefined) {
    isSaved.value = true

    Backend.deviceTokenResult = qrData.value[0].rawValue
    await Backend.courseSessionAttendanceRegister(qrData.value[0].rawValue)
  }

  if (isSaved.value) {
    setTimeout(() => {
      isSaved.value = false

      qrData.value = undefined
    }, 2000)
    console.log("asd")
  }


}

onMounted(() => {

  setInterval(checkQrData, 2000);

})

</script>
