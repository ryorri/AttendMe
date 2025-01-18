<!-- TestPage1.vue -->
<template>
  <div>
    <div v-if="course">
      <p><strong>Nazwa kursu:</strong> {{ course.courseName }}</p>
      <p><strong>Grupa:</strong> {{ course.courseGroupName }}</p>
      <p><strong>Miejsce:</strong> {{ course.locationName }}</p>
      <p><strong>Rozpoczęcie:</strong> {{ formatDate(course.dateStart) }}</p>
      <p><strong>Zakończenie:</strong> {{ formatDate(course.dateEnd) }}</p>

      <h3>Lista obecności</h3>

      <table class="table table-striped">
        <thead class="thead-dark">
          <tr>
            <th scope="col">Nazwisko</th>
            <th scope="col">Imię</th>
            <th scope="col">Numer albumu</th>
            <th scope="col">Obecność</th>

          </tr>
        </thead>
        <tbody>
          <tr v-for="student in studentList" :key="student.id">
            <td>{{ student.userSurname }} </td>
            <td>{{ student.userName }} </td>
            <td>{{ student.studentAlbumIdNumber }} </td>
            <td>{{ student.wasUserPresent }} </td>


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
import { defineProps } from 'vue';
import { Backend } from '@/main'
import { ref, onMounted } from 'vue'
import { formatDate } from '@/lib/Extensions/dateFormatter'


const props = defineProps({
  selectedCourseId: {
    type: Number,
    required: true
  }
});


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const course = ref<any>();
const studentList = ref()
const courseId = props.selectedCourseId


onMounted(async () => {
  try {
    course.value = await Backend.courseTeacherSessionGet(courseId).then(
      (result) => (course.value = result))

    studentList.value = await Backend.courseSessionAttendanceListGet(courseId).then(
      (result) => (studentList.value = result))
  } catch (error) {
    console.error('Błąd podczas ładowania sesji:', error)
  }
})
</script>
