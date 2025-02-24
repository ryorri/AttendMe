<template>
    <div class="container d-flex justify-content-center align-items-center vh-100">
        <div class="card shadow-lg p-4 w-50">
            <h1 class="text-center mb-4">Zarejestruj swoje urządzenie</h1>

            <form @submit.prevent="registerDevice">
                <div class="mb-3">
                    <label for="deviceName" class="form-label">Nazwa urządzenia</label>
                    <input type="text" class="form-control" v-model="formData.deviceName" id="deviceName" required />
                </div>

                <div class="mb-3">
                    <label for="studentName" class="form-label">Imię</label>
                    <input type="text" class="form-control" v-model="formData.studentName" id="studentName" required />
                </div>

                <div class="mb-3">
                    <label for="studentSurname" class="form-label">Nazwisko</label>
                    <input type="text" class="form-control" v-model="formData.studentSurname" id="studentSurname"
                        required />
                </div>

                <div class="mb-3">
                    <label for="albumIdNumber" class="form-label">Nr albumu</label>
                    <input type="number" class="form-control" v-model="formData.albumIdNumber" id="albumIdNumber"
                        required />
                </div>

                <div class="text-center">
                    <button type="submit" class="btn btn-primary w-100">Zarejestruj urządzenie</button>
                </div>
            </form>

            <div v-if="successMessage" class="alert alert-success text-center mt-3">{{ successMessage }}</div>
            <div v-else-if="errorMessage" class="alert alert-danger text-center mt-3">{{ errorMessage }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { Backend } from '@/main';
import { ref } from 'vue';

const formData = ref({
    deviceName: '',
    studentName: '',
    studentSurname: '',
    albumIdNumber: 0,
});

const route = useRoute();
const errorMessage = ref('');
const successMessage = ref('');
const token = route.params.token.toString();

const registerDevice = async () => {
    try {
        await Backend.userDeviceRegisterWithToken(token, formData.value);
        successMessage.value = '✅ Zarejestrowano! Możesz zamknąć okno.';
        errorMessage.value = '';
    } catch {
        errorMessage.value = '❌ Nie udało się zarejestrować. Sprawdź dane.';
        successMessage.value = '';
    }
};
</script>

<style scoped>
.card {
    border-radius: 12px;
}

.btn {
    font-size: 1.1rem;
    padding: 10px;
}
</style>