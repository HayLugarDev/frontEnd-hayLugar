<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
    <div class="bg-white p-8 rounded-xl shadow-xl w-full max-w-md border border-gray-200">
      <h1 class="text-2xl font-bold text-center text-primary mb-6">Confirmar Acceso</h1>

      <form @submit.prevent="confirmAccess" class="space-y-4">
        <div>
          <label class="block text-gray-700 font-medium">Legajo</label>
          <input
            v-model="legajo"
            type="text"
            placeholder="Ej: 123456"
            class="input-field"
            required
          />
        </div>

        <div>
          <label class="block text-gray-700 font-medium">Patente del Vehículo</label>
          <input
            v-model="patente"
            type="text"
            placeholder="Ej: ABC123"
            class="input-field"
            required
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          {{ loading ? 'Confirmando...' : 'Confirmar Acceso' }}
        </button>

        <p v-if="error" class="text-red-600 mt-2 text-sm">{{ error }}</p>
        <p v-if="success" class="text-green-600 mt-2 text-sm">{{ success }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { confirmUniversityAccess } from '../services/universityService';

const legajo = ref('');
const patente = ref('');
const loading = ref(false);
const error = ref(null);
const success = ref(null);
const router = useRouter();

const confirmAccess = async () => {
  loading.value = true;
  error.value = null;
  success.value = null;
  try {
    const res = await confirmUniversityAccess({ legajo: legajo.value, patente: patente.value });
    success.value = 'Acceso confirmado con éxito';
    setTimeout(() => router.push(`/mi-espacio`), 2000);
  } catch (err) {
    error.value = err?.response?.data?.message || 'Ocurrió un error al confirmar el acceso';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.input-field {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  font-size: 16px;
  outline: none;
  transition: border 0.2s;
}
.input-field:focus {
  border-color: #ffaa00;
  background-color: #fff;
}
</style>
