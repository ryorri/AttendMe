<template>
  <div>
    <div v-if="course">
      <button class="back_buttons" @click="$emit('go-back')">Powrót do listy</button>
      <p><strong>Nazwa kursu:</strong> {{ course.courseName }}</p>
      <p><strong>Grupa:</strong> {{ course.courseGroupName }}</p>
      <p><strong>Miejsce:</strong> {{ course.locationName }}</p>
      <p><strong>Rozpoczęcie:</strong> {{ formatDate(course.dateStart) }}</p>
      <p><strong>Zakończenie:</strong> {{ formatDate(course.dateEnd) }}</p>
      <p><strong>Frekwencja:</strong> {{ attendenceList }}/{{ coursesList }}</p>
      <button class="back_buttons" @click="goToScan()">Skanuj obecność</button>
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

const courseId = props.selectedCourseId
const course = props.courseData

const isScan = ref(false)
const coursesList = ref()
const attendenceList = ref()

onMounted(async () => {
  try {
    const courses = await Backend.courseStudentGroupSessionsGet(courseId);

    const attendence = await Backend.courseStudentAttendanceGet(courseId)

    attendenceList.value = attendence.length
    coursesList.value = courses.length


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
