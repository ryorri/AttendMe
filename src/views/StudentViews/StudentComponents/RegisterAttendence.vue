<template>
  <qrcode-vue :value="value" :level="level" :render-as="renderAs" :background="background" :foreground='foreground'
    :gradient="gradient" :gradient-type="gradientType" :gradient-start-color="gradientStartColor"
    :gradient-end-color="gradientEndColor" :size="400" />
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import QrcodeVue from 'qrcode.vue'
import type { Level, RenderAs, GradientType } from 'qrcode.vue'
import { Backend } from '@/main'


const value = ref()
const level = ref<Level>('M')
const renderAs = ref<RenderAs>('svg')
const background = ref('#ffffff')
const foreground = ref('#000000')
const ticket = () => Backend.userAttendanceTicketGet().then((result) => (value.value = result.token))


const gradient = ref(false)
const gradientType = ref<GradientType>('linear')
const gradientStartColor = ref('#000000')
const gradientEndColor = ref('#38bdf8')

onMounted(() => {

  ticket()
  setInterval(ticket, 2000);

})

</script>
