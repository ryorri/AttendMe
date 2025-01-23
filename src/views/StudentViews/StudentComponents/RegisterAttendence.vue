<template>
  <qrcode-vue :value="value" :level="level" :render-as="renderAs" :background="background" :foreground='foreground'
    :gradient="gradient" :gradient-type="gradientType" :gradient-start-color="gradientStartColor"
    :gradient-end-color="gradientEndColor" :image-settings='imageSettings' :size="400" />

  <button @click="check">Check</button>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import QrcodeVue from 'qrcode.vue'
import type { Level, RenderAs, GradientType, ImageSettings } from 'qrcode.vue'
import { Backend } from '@/main'


const value = ref()
const level = ref<Level>('M')
const renderAs = ref<RenderAs>('svg')
const background = ref('#ffffff')
const foreground = ref('#000000')
const ticket = () => Backend.userAttendanceTicketGet().then((result) => (value.value = result.token))

const imageSettings = ref<ImageSettings>({
  src: 'https://github.com/scopewu.png',
  width: 30,
  height: 30,
  // x: 10,
  // y: 10,
  excavate: true,
})

const gradient = ref(false)
const gradientType = ref<GradientType>('linear')
const gradientStartColor = ref('#000000')
const gradientEndColor = ref('#38bdf8')

onMounted(() => {

  ticket()
  setInterval(ticket, 2000);

})

const check = () => {
  Backend.userAttendanceTicketGet().then((result) => (value.value = result.token))
  console.log(value)
}
</script>
