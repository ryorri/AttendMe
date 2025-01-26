<template>
  <div>
    <div v-if="course">
      <p><strong>Nazwa kursu:</strong> {{ course.courseName }}</p>
      <p><strong>Grupa:</strong> {{ course.courseGroupName }}</p>
      <p><strong>Miejsce:</strong> {{ course.locationName }}</p>
      <p><strong>Rozpoczęcie:</strong> {{ formatDate(course.dateStart) }}</p>
      <p><strong>Zakończenie:</strong> {{ formatDate(course.dateEnd) }}</p>
      <button @click="goToScan()">Skanuj obecność</button>
      <div v-if="isScan">
        <RegisterAttendence />
      </div>

    </div>
    <div v-else>
      <p>Ładowanie kursu...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Backend } from '@/main'
import { defineProps, ref, onMounted } from 'vue'
import { formatDate } from '@/lib/Extensions/dateFormatter'
import RegisterAttendence from './RegisterAttendence.vue';

const props = defineProps({
  selectedCourseId: {
    type: Number,
    required: true
  },

  courseData: {
    type: Object,
    required: true
  }
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const courses = ref<any>();
const courseId = props.selectedCourseId
const course = props.courseData
const attendence = ref()
const isScan = ref(false)


onMounted(async () => {
  try {
    await Backend.courseStudentGroupSessionsGet(courseId).then(
      (result) => courses.value = result);
    console.log(courses.value)

    await Backend.courseStudentAttendanceGet(courseId).then((result) => attendence.value = result)
    console.log(attendence.value)

  } catch (error) {
    console.error('Błąd podczas ładowania sesji:', error);
  }
});

function goToScan() {
  if (isScan.value == false) {
    isScan.value = true
  }
  else {
    isScan.value = false
  }

}



</script>
