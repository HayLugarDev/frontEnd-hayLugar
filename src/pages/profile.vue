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
const router = useRouter();
const inputFoto = ref<HTMLInputElement | null>(null);

// Se utilizará el usuario proveniente del store. Si aún no se cargó, se usa un objeto vacío por defecto.
const usuario = computed(() => userStore.user || {
  id:"",
  profile_picture: "https://source.unsplash.com/100x100/?person,avatar",
  name: "",
  last_name: "",
  email: "",
  dni: "",
  address: "",
  phone: "",
  walletEmail: ""
});

// Reactive variables para reservas y publicaciones
const reservas = ref([]);
const publicaciones = ref([]);

// Función para obtener reservas del usuario (ajusta el endpoint según tu API)
const fetchReservations = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.get('/reservations/user', {
      headers: { Authorization: `Bearer ${token}` }
    });
    // Se asume que la respuesta trae un array en response.data.reservations
    reservas.value = response.data.reservations;
  } catch (error) {
    console.error("Error al cargar las reservas", error);
  }
};

// Función para obtener publicaciones del usuario (ajusta el endpoint según tu API)
const fetchPublications = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.get('/publications/user', {
      headers: { Authorization: `Bearer ${token}` }
    });
    // Se asume que la respuesta trae un array en response.data.publications
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
    // En producción, se subiría la foto al servidor y se actualizaría la URL
    if (userStore.user) {
      userStore.user.profile_picture = URL.createObjectURL(file);
    }
  }
};

const guardarTodo = async (): Promise<void> => {
  try {
    const token = localStorage.getItem('token');
    // Se envían los datos actualizados del usuario al backend
    const response = await api.put(`/users/update/${usuario.value.id}`, usuario.value, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert("Cambios guardados exitosamente.");
    // Actualiza el store con la respuesta del backend
    userStore.user = response.data;
  } catch (error) {
    console.error("Error al guardar los cambios", error);
    alert("Hubo un error al guardar los cambios.");
  }
};

const setAddress = (place: any): void => {
  if (userStore.user) {
    userStore.user.address = place.formatted_address || "";
  }
};
</script>

<style scoped>
/* Puedes agregar estilos adicionales aquí si lo requieres */
</style>
