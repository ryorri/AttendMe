<template>
  <div class="container">
    <div class="d-flex justify-content-between align-items-center my-3 p-3 border rounded shadow-sm">
      <h5 class="mb-0">{{ userStore.name }} {{ userStore.surname }}</h5>
      <button class="btn btn-danger" @click="LogOut()">Wyloguj</button>
    </div>
    <h1 class="text-center my-4">Kursy</h1>

    <div class="row justify-content-center">
      <div class="col-md-6">
        <input v-model="searchQuery" type="text" placeholder="Wyszukaj kurs..." class="form-control mb-3" />

        <select v-model="dateFilter" class="form-control mb-4">
          <option value="all">Wszystko</option>
          <option value="past">Minione</option>
          <option value="future">Przyszłe</option>
        </select>
      </div>
    </div>

    <ul class="list-unstyled">
      <li v-for="session in filteredSessions" :key="session.id" class="mb-3">
        <div class="card shadow-sm cursor-pointer hover-effect" @click="goToCourse(session.courseSessionId)">
          <div class="card-body">
            <h4 class="card-title text-primary">{{ session.courseName }}</h4>
            <h5 class="text-secondary">Grupa: {{ session.courseGroupName }}</h5>
            <p class="mb-1"><strong>Sala:</strong> {{ session.locationName }}</p>
            <p class="mb-0">
              <strong>Data:</strong> {{ onlyDate(session.dateStart) }} |
              {{ onlyHours(session.dateStart) }} - {{ onlyHours(session.dateEnd) }}
            </p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.hover-effect {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.hover-effect:hover {
  transform: scale(1.03);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.cursor-pointer {
  cursor: pointer;
}
</style>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/User';
import { Backend } from '@/main';
import { onlyDate, onlyHours } from '@/lib/Extensions/dateFormatter';

const router = useRouter();
const userStore = useUserStore();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sessions = ref<any[]>([]);
const searchQuery = ref('');
const dateFilter = ref('all');
const currentDate = new Date();

onMounted(() => {
  userStore.initializeStore();
  userStore.setTokenExpiration();

  getSessions();
});

const LogOut = () => {
  userStore.logout();
  router.push({ name: 'LoginPage' });
}

const getSessions = async () => {
  try {
    sessions.value = await Backend.courseTeacherSessionsGet({ pageNumber: 1, pageSize: 99999 }).then(
      (result) => result.items
    );
  } catch (error) {
    console.error('Błąd podczas ładowania sesji:', error);
  }
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

const goToCourse = (courseId: number) => {
  router.push({ name: 'SelectedCourse', params: { id: courseId } });
}
</script>
