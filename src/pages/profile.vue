<template>
  <div class="min-h-screen bg-secondary p-6" v-if="!userStore.loading">
    <!-- Encabezado del Perfil -->
    <header class="flex flex-col items-center mb-8">
      <h1 class="text-4xl font-bold text-primary mb-4">
        <font-awesome-icon icon="user-circle" class="mr-2" />
        Mi Perfil
      </h1>
    </header>

    <!-- Información Personal y Datos Financieros -->
    <section class="bg-white p-8 rounded-lg shadow-lg mb-8" v-if="usuario">
      <div class="flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-4">
          <img
            :src="usuario.profile_picture"
            alt="Foto de perfil"
            class="w-24 h-24 object-cover rounded-full shadow-lg"
          />
          <div>
            <h2 class="text-2xl font-bold text-primary">
              {{ usuario.name }} {{ usuario.last_name }}
            </h2>
            <p class="text-gray-600 flex items-center">
              <font-awesome-icon icon="envelope" class="mr-2" />
              {{ usuario.email }}
            </p>
            <p class="text-gray-600 flex items-center">
              <font-awesome-icon icon="id-card" class="mr-2" />
              DNI: {{ usuario.dni }}
            </p>
          </div>
        </div>
        <div>
          <!-- Input de archivo oculto para foto -->
          <input type="file" @change="subirFoto" class="hidden" ref="inputFoto" />
          <button
            @click="cambiarFoto"
            class="flex items-center bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 transition"
          >
            <font-awesome-icon icon="camera" class="mr-2" />
            Cambiar Foto
          </button>
        </div>
      </div>

      <!-- Formulario de Datos Personales -->
      <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input v-model="usuario.name" type="text" placeholder="Nombre" class="border p-3 rounded w-full" />
        <input v-model="usuario.last_name" type="text" placeholder="Apellido" class="border p-3 rounded w-full" />
        <input v-model="usuario.email" type="email" placeholder="Correo Electrónico" class="border p-3 rounded w-full" />
        <input v-model="usuario.dni" type="text" placeholder="DNI" class="border p-3 rounded w-full" />
        <!-- Componente de Autocomplete para Dirección -->
        <GMapAutocomplete 
          class="border p-3 rounded w-full"
          placeholder="Buscar Dirección" 
          @place_changed="setAddress"
        />
        <!-- Muestra la dirección seleccionada en un input readonly -->
        <input v-model="usuario.address" type="text" placeholder="Dirección seleccionada" class="border p-3 rounded w-full" readonly />
        <input v-model="usuario.phone" type="text" placeholder="Teléfono" class="border p-3 rounded w-full" />
      </div>

      <!-- Datos Financieros -->
      <div class="mt-8">
        <h2 class="text-2xl font-bold text-primary mb-4 flex items-center">
          <font-awesome-icon icon="wallet" class="mr-2" />
          Datos Financieros
        </h2>
        <p class="text-gray-600 mb-4">
          Completa tus datos financieros para integrar tu billetera y poder realizar pagos.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="email"
            placeholder="Correo de MercadoPago"
            class="border p-3 rounded"
          />
          <!-- Aquí se pueden agregar más campos financieros si es necesario -->
        </div>
      </div>
    </section>

    <!-- Historial de Reservas -->
    <ReservationHistory :reservations="reservas" />

    <!-- Historial de Publicaciones -->
    <PublicationHistory :publications="publicaciones" />

    <!-- Botón para Guardar Todos los Cambios -->
    <section class="mt-8">
      <button
        @click="guardarTodo"
        class="w-full bg-accent text-white p-4 rounded-lg text-lg font-bold shadow-md hover:shadow-xl transition-all"
      >
        <font-awesome-icon icon="save" class="mr-2" />
        Guardar Cambios
      </button>
    </section>

    <!-- Modal de Éxito -->
    <transition name="fade">
      <div v-if="showSuccessModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="bg-white rounded-lg shadow-xl p-8 max-w-md w-full transform transition-all scale-95">
          <div class="flex flex-col items-center">
            <img src="/src/assets/logo.jpeg" alt="Logo" class="w-20 h-20 mb-4" />
            <h2 class="text-3xl font-bold text-primary mb-2">¡Éxito!</h2>
            <p class="text-lg text-gray-700 text-center mb-6">Los cambios se han guardado correctamente.</p>
            <button @click="closeSuccessModal" class="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
              Continuar
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal de Error -->
    <transition name="fade">
      <div v-if="showErrorModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="bg-white rounded-lg shadow-xl p-8 max-w-md w-full transform transition-all scale-95">
          <div class="flex flex-col items-center">
            <img src="/src/assets/logo.jpeg" alt="Logo" class="w-20 h-20 mb-4" />
            <h2 class="text-3xl font-bold text-red-600 mb-2">¡Error!</h2>
            <p class="text-lg text-gray-700 text-center mb-6">{{ errorMessage }}</p>
            <button @click="closeErrorModal" class="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-800 transition">
              Intentar de Nuevo
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
  <div v-else class="min-h-screen flex items-center justify-center">
    <p>Cargando información...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ReservationHistory from '../components/ReservationHistory.vue';
import PublicationHistory from '../components/PublicationHistory.vue';
import { useUserStore } from '../store/userStore';
import api from '../services/apiService';

const userStore = useUserStore();
const inputFoto = ref<HTMLInputElement | null>(null);


const usuario = computed(() => userStore.user || {
  id: "",
  profile_picture: "https://source.unsplash.com/100x100/?person,avatar",
  name: "",
  last_name: "",
  email: "",
  dni: "",
  address: "",
  phone: "",
  walletEmail: ""
});

const reservas = ref([]);
const publicaciones = ref([]);

const showSuccessModal = ref(false);
const showErrorModal = ref(false);
const errorMessage = ref('');
const router = useRouter();
const fetchReservations = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.get('/reservations/user', {
      headers: { Authorization: `Bearer ${token}` }
    });
    reservas.value = response.data.reservations;
  } catch (error) {
    console.error("Error al cargar las reservas", error);
  }
};

const fetchPublications = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.get('/publications/user', {
      headers: { Authorization: `Bearer ${token}` }
    });
    publicaciones.value = response.data.publications;
  } catch (error) {
    console.error("Error al cargar las publicaciones", error);
  }
};

onMounted(async () => {
  await userStore.fetchUser();
  await fetchReservations();
  await fetchPublications();
});

const cambiarFoto = (): void => {
  inputFoto.value?.click();
};

const subirFoto = (event: Event): void => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    if (userStore.user) {
      userStore.user.profile_picture = URL.createObjectURL(file);
    }
  }
};

const guardarTodo = async (): Promise<void> => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.put(`/users/update/${usuario.value.id}`, usuario.value, {
      headers: { Authorization: `Bearer ${token}` }
    });
    userStore.user = response.data;

    showSuccessModal.value = true;
  } catch (error) {
    console.error("Error al guardar los cambios", error);
    errorMessage.value = "Hubo un error al guardar los cambios. Por favor, inténtalo nuevamente.";
    showErrorModal.value = true;
  }
};

const setAddress = (place: any): void => {
  if (userStore.user) {
    userStore.user.address = place.formatted_address || "";
  }
};

const closeSuccessModal = () => {
  router.push('/dashboard');
  showSuccessModal.value = false;
 
};

const closeErrorModal = () => {
  showErrorModal.value = false;
};
</script>

<style scoped>


/* Transición para el modal */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
