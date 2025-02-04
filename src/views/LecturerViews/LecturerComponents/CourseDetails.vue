<template>
  <div>
    <div v-if="course">
      <p><strong>Nazwa kursu:</strong> {{ course.courseName }}</p>
      <p><strong>Grupa:</strong> {{ course.courseGroupName }}</p>
      <p><strong>Miejsce:</strong> {{ course.locationName }}</p>
      <p><strong>Rozpoczęcie:</strong> {{ formatDate(course.dateStart) }}</p>
      <p><strong>Zakończenie:</strong> {{ formatDate(course.dateEnd) }}</p>


      <button @click="goToScan()">asdas</button>

      <h3>Lista obecności</h3>

      <table class="table table-striped">
        <thead class="thead-dark">
          <tr>
            <th scope="col">Nazwisko</th>
            <th scope="col">Imię</th>
            <th scope="col">Numer albumu</th>
            <th scope="col">Obecność</th>
            <th scope="col">Rejestracja urządzenia</th>
            <th scope="col">Aktywne urządzenie</th>

          </tr>
        </thead>
        <tbody>
          <tr v-for="student in studentList" :key="student.id">
            <td>{{ student.attenderUserId }} </td>
            <td>{{ student.userSurname }} </td>
            <td>{{ student.userName }} </td>
            <td>{{ student.studentAlbumIdNumber }} </td>
            <td>
              <button v-if="student.wasUserPresent" type="button" class="btn btn-success">Obecny</button>
              <button v-else type="button" class="btn btn-warning">Nieobecny</button>
            </td>
            <td><button type="button" class="btn btn-secondary" @click="registerDevice(student.attenderUserId)">Skopiuj
                link</button></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <p>Ładowanie kursu...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Backend } from '@/main'
import { defineProps, ref, onMounted, onUnmounted } from 'vue'
import { formatDate } from '@/lib/Extensions/dateFormatter'


const props = defineProps({
  selectedCourseId: {
    type: Number,
    required: true
  }
});

const router = useRouter()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const course = ref<any>();
const studentList = ref()
const courseId = props.selectedCourseId
const refreshInterval = 30000;
const registerDeviceToken = ref()
const registerDeviceLink = ref()
const interval = ref()

const fetchStudentList = async () => {
  try {
    studentList.value = await Backend.courseSessionAttendanceListGet(courseId).then(
      (result) => result);
  } catch (error) {
    console.error('Błąd podczas odświeżania listy studentów:', error);
  }
};

onMounted(async () => {
  try {
    course.value = await Backend.courseTeacherSessionGet(courseId).then(
      (result) => result);

    await fetchStudentList();

    interval.value = setInterval(fetchStudentList, refreshInterval);
  } catch (error) {
    console.error('Błąd podczas ładowania sesji:', error);
  }
});

onUnmounted(() => {
  if (interval.value) {
    clearInterval(interval.value);
  }
});


const registerDevice = async (id: number) => {
  registerDeviceToken.value = await Backend.userDeviceRegisterTokenGet(id);

  const token = registerDeviceToken.value?.token;
  if (token) {
    registerDeviceLink.value = `${window.location.origin}/registerdevice/${token}`
    navigator.clipboard.writeText(registerDeviceLink.value)
  } else {
    console.error("Token nie został znaleziony w odpowiedzi.");
  }
};

const goToScan = () => {
  router.push({ name: "ScanningPage", params: { id: courseId } })
}
</script>
