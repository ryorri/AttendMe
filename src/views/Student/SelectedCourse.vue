<template>
  <div v-if="session" class="container mt-5">
    <h1 class="text-center mb-4">Szczegóły kursu</h1>
    <div class="card p-4 shadow-sm mb-4">
      <div class="card-body">
        <p><strong>Nazwa kursu:</strong> {{ session.courseName }}</p>
        <p><strong>Grupa:</strong> {{ session.courseGroupName }}</p>
        <p><strong>Miejsce:</strong> {{ session.locationName }}</p>
        <p><strong>Rozpoczęcie:</strong> {{ formatDate(session.dateStart) }}</p>
        <p><strong>Zakończenie:</strong> {{ formatDate(session.dateEnd) }}</p>
        <p><strong>Frekwencja:</strong> {{ noAtt }} / {{ noCou }}</p>
        <div v-if="isAbsent" class="alert alert-danger" role="alert">
          Nieobecny
        </div>
        <div v-else class="alert alert-success" role="alert">
          Obecny
        </div>
      </div>
    </div>
    <button @click="showQr()" class="btn btn-primary">Kod QR do obecności</button>

    <div v-if="qr" class="mt-5 text-center">
      <h2 class="mb-4">Twój kod QR do rejestracji obecności</h2>
      <div class="card p-4 shadow-lg d-inline-block">
        <qrcode-vue :value="value" level="M" render-as="svg" background="#ffffff" foreground="#000000" :size="400" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { onMounted, ref, onUnmounted } from 'vue';
import { Backend } from '@/main';
import { formatDate } from '@/lib/Extensions/dateFormatter';
import QrcodeVue from 'qrcode.vue';

const route = useRoute()

const courseGroupId = Number(route.params.id);
const courseSessionId = Number(route.params.courseId);
const sessionList = ref()
const session = ref()
const noAtt = ref()
const noCou = ref()
const isAbsent = ref()
const interval = ref()

const qr = ref(false)
const value = ref();

onMounted(() => {

  getSessionDetails()
  getTicket();
  getAttendence()
  interval.value = setInterval(getTicket, 2000);
})

onUnmounted(() => {
  if (interval.value) {
    clearInterval(interval.value);
  }
})

const getSessionDetails = async () => {
  sessionList.value = await Backend.courseStudentGroupSessionsGet(courseGroupId)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  session.value = sessionList.value.find((s: any) => s.courseSessionId === courseSessionId);
}

const getTicket = async () => {
  const result = await Backend.userAttendanceTicketGet();
  value.value = result.token;
};

const showQr = () => {
  qr.value = !qr.value;
}

const getAttendence = async () => {

  const courses = await Backend.courseStudentGroupSessionsGet(courseGroupId);

  const attendence = await Backend.courseStudentAttendanceGet(courseGroupId)

  noAtt.value = attendence.length
  noCou.value = courses.length

  console.log(attendence, courseSessionId)

  if (attendence.some(att => att.courseSessionId === courseSessionId)) {
    isAbsent.value = false
  }
  else {
    isAbsent.value = true
  }
}

</script>

<style scoped>
.card {
  transition: transform 0.2s ease-in-out;
}

.card:hover {
  transform: scale(1.03);
}

.text-center {
  color: var(--dark-blue);
}
</style>
