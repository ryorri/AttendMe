<template>
  <div>
    <div v-if="loading">Ładowanie...</div>
    <div v-if="selectedCourse">
      <CourseDetails :selectedCourseId=selectedCourseId @go-back="goBack" />
    </div>

    <div v-else>
      <div>
        <h1 class="extenderH1">Kursy</h1>
        <input v-model="searchQuery" type="text" placeholder="Wyszukaj..." class="form-control mb-3 filterForm" />

        <select v-model="dateFilter" class="form-control mb-3 filterForm">
          <option value="all">Wszystko</option>
          <option value="past">Minione</option>
          <option value="future">Przyszłe</option>
        </select>
      </div>
      <ul class="list-unstyled">
        <li v-for="session in filteredSessions" :key="session.id" class="course_list">
          <p class="p_in_course_list">Nazwa kursu: </p>
          <h4 class="h_in_course_list">{{ session.courseName }}</h4>
          <p class="p_in_course_list">Grupa: </p>
          <h5 class="h_in_course_list">{{ session.courseGroupName }}</h5>
          <p class="p_in_course_list">Sala: </p>
          <p class="h_in_course_list">{{ session.locationName }}</p>
          <p class="p_in_course_list">Data: </p>
          <p class="h_in_course_list">{{ onlyDate(session.dateStart) }} {{ onlyHours(session.dateStart) }}-{{
            onlyHours(session.dateEnd) }}</p>
          <button class="buttons" id="selected" @click="goToSession(session.courseSessionId)">Zobacz szczegóły</button>

        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Backend } from '@/main'
import CourseDetails from './CourseDetails.vue';
import { onlyDate, onlyHours } from '@/lib/Extensions/dateFormatter'


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sessions = ref<any[]>([]);
const loading = ref(true);
const selectedCourse = ref(false)
const selectedCourseId = ref()
const searchQuery = ref('');
const dateFilter = ref('all');
const currentDate = new Date();



onMounted(async () => {
  try {
    sessions.value = await Backend.courseTeacherSessionsGet({ pageNumber: 1, pageSize: 99999 }).then(
      (result) => (sessions.value = result.items),
    )
  } catch (error) {
    console.error('Błąd podczas ładowania sesji:', error)
  } finally {
    loading.value = false
  }
})



const goToSession = (id: string) => {
  loading.value = false
  selectedCourse.value = true
  selectedCourseId.value = id
}

const filteredSessions = computed(() => {
  let filtered = sessions.value.filter(session => {
    const lowerCaseQuery = searchQuery.value.toLowerCase();
    return (
      session.courseName.toLowerCase().includes(lowerCaseQuery) ||
      session.courseGroupName.toLowerCase().includes(lowerCaseQuery) ||
      session.locationName.toLowerCase().includes(lowerCaseQuery)
    );
  });



  if (dateFilter.value === 'past') {
    filtered = filtered.filter(session => new Date(session.dateStart) < currentDate);
  } else if (dateFilter.value === 'future') {
    filtered = filtered.filter(session => new Date(session.dateStart) > currentDate);
  }

  return filtered;
});

const goBack = () => {
  selectedCourse.value = false;
  selectedCourseId.value = null;
};

</script>
