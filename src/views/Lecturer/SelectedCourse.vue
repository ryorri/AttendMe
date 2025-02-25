<template>
  <div v-if="course" class="container mt-4">
    <div class="card shadow p-4">
      <h2 class="text-center mb-4">Szczegóły kursu</h2>

      <ul class="list-group mb-4">
        <li class="list-group-item"><strong>Nazwa kursu:</strong> {{ course.courseName }}</li>
        <li class="list-group-item"><strong>Grupa:</strong> {{ course.courseGroupName }}</li>
        <li class="list-group-item"><strong>Miejsce:</strong> {{ course.locationName }}</li>
        <li class="list-group-item"><strong>Rozpoczęcie:</strong> {{ formatDate(course.dateStart) }}</li>
        <li class="list-group-item"><strong>Zakończenie:</strong> {{ formatDate(course.dateEnd) }}</li>
      </ul>

      <div class="text-center mb-4">
        <button @click="goToScan" class="btn btn-primary btn-lg">
          Rejestruj obecność
        </button>
      </div>

      <div class="table-responsive">
        <table class="table table-hover align-middle">
          <thead class="table-dark">
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
              <td>{{ student.userSurname }}</td>
              <td>{{ student.userName }}</td>
              <td>{{ student.studentAlbumIdNumber }}</td>
              <td>
                <span v-if="student.wasUserPresent" class="badge bg-success">Obecny</span>
                <span v-else class="badge bg-warning text-dark">Nieobecny</span>
              </td>
              <td>
                <button type="button" class="btn btn-outline-secondary btn-sm"
                  @click="registerDevice(student.attenderUserId)">
                  Skopiuj link
                </button>
              </td>
              <td>
                <span>{{ student.deviceName || 'Brak urządzenia' }}</span>
                <button class="btn btn-outline-danger btn-sm ms-2" @click="resetUserDevice(student.attenderUserId)">
                  Reset
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  border-radius: 12px;
}
</style>


<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Backend } from '@/main';
import { formatDate } from '@/lib/Extensions/dateFormatter';

const route = useRoute();
const router = useRouter();

const courseSessionId = Number(route.params.id);
const course = ref();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const studentList = ref<any[]>([]);
const interval = ref();
const registerDeviceToken = ref();
const registerDeviceLink = ref();

onMounted(() => {
  getCourseDetails();
  getStudentList();
  interval.value = setInterval(getStudentList, 30000);

});

onUnmounted(() => {
  if (interval.value) {
    clearInterval(interval.value);
  }
})

const getCourseDetails = async () => {
  try {
    course.value = await Backend.courseTeacherSessionGet(courseSessionId);
  } catch (error) {
    console.error('Błąd podczas ładowania sesji:', error);
  }
};

const getStudentList = async () => {
  try {
    const students = await Backend.courseSessionAttendanceListGet(courseSessionId);
    const studentDevices = await Promise.all(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      students.map(async (student: any) => {
        const user = await Backend.userGet(student.attenderUserId);
        return { ...student, deviceName: user.deviceName ?? '' };
      })
    );

    studentList.value = studentDevices;
  } catch (error) {
    console.error('Błąd podczas ładowania listy studentów:', error);
  }
};

const registerDevice = async (id: number) => {
  registerDeviceToken.value = await Backend.userDeviceRegisterTokenGet(id);
  const token = registerDeviceToken.value?.token;

  if (token) {
    registerDeviceLink.value = `${window.location.origin}/RegisterDevice/${token}`;
    navigator.clipboard.writeText(registerDeviceLink.value);
  } else {
    console.error('Token nie został znaleziony w odpowiedzi.');
  }
};

const resetUserDevice = async (id: number) => {
  await Backend.userDeviceReset(id);
  getStudentList();
};

const goToScan = () => {
  router.push({ name: "ScanningPage", params: { courseId: courseSessionId } });
};
</script>
