<template>
  <div class="min-h-screen bg-secondary p-6">
    <!-- Encabezado del Perfil -->
    <header class="flex flex-col items-center mb-8">
      <h1 class="text-4xl font-bold text-primary mb-4">
        <font-awesome-icon icon="user-circle" class="mr-2" />
        Mi Perfil
      </h1>
    </header>

    <!-- Información Personal y Datos Financieros -->
    <section class="bg-white p-8 rounded-lg shadow-lg mb-8">
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
            v-model="usuario.walletEmail"
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
    <section>
      <button
        @click="guardarTodo"
        class="w-full bg-accent text-white p-4 rounded-lg text-lg font-bold shadow-md hover:shadow-xl transition-all"
      >
        <font-awesome-icon icon="save" class="mr-2" />
        Guardar Cambios
      </button>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ReservationHistory from '../components/ReservationHistory.vue';
import PublicationHistory from '../components/PublicationHistory.vue';

interface Usuario {
  profile_picture: string;
  name: string;
  last_name: string;
  email: string;
  dni: string;
  address: string;
  phone: string;
  walletEmail: string;
}

const usuario = ref<Usuario>({
  profile_picture: "https://source.unsplash.com/100x100/?person,avatar",
  name: "Juan",
  last_name: "Pérez",
  email: "juanperez@email.com",
  dni: "12345678",
  address: "Av. Principal 123",
  phone: "+54 9 11 1234 5678",
  walletEmail: ""
});


const reservas = ref([
  { location: "Calle 123, San Miguel", start_time: "2025-03-10T08:00:00Z", total: 500 },
  { location: "Av. Siempre Viva", start_time: "2025-04-01T09:00:00Z", total: 750 }
]);


const publicaciones = ref([
  { location: "Calle 456, Centro", created_at: "2025-02-15T10:00:00Z" },
  { location: "Av. Siempre Viva", created_at: "2025-03-01T11:30:00Z" }
]);

const router = useRouter();
const inputFoto = ref<HTMLInputElement | null>(null);

const cambiarFoto = (): void => {
  inputFoto.value?.click();
};

const subirFoto = (event: Event): void => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    // En producción, subir la foto al servidor y actualizar la URL
    usuario.value.profile_picture = URL.createObjectURL(file);
  }
};

const guardarTodo = (): void => {

  alert("Cambios guardados exitosamente.");
};

const setAddress = (place: any): void => {
  usuario.value.address = place.formatted_address || "";
};
</script>

<style scoped>

</style>
