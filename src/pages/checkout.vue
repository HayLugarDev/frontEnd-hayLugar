<template>
  <div class="flex flex-col md:flex-row min-h-screen bg-secondary p-6 gap-6">
    <!-- Sección Izquierda: Resumen y Formulario de Reserva -->
    <section class="w-full lg:w-2/3 space-y-6">
      <h1 class="text-3xl font-bold text-primary px-2">Finalizar Reserva</h1>
      <!-- Resumen del Espacio -->
      <div class="bg-white p-6 rounded-lg shadow-md flex items-center">
        <img
          :src="`http://localhost:3000${espacio?.images[0]}` || 'https://source.unsplash.com/400x300/?parking,garage'"
          alt="Imagen del espacio" class="w-32 h-32 object-cover rounded-lg shadow-md mr-6" />
        <div>
          <h2 class="text-xl font-bold">{{ espacio?.location }}</h2>
          <p class="text-gray-600">{{ espacio?.description }}</p>
          <p class="text-lg text-primary font-semibold mt-2">
            <font-awesome-icon icon="money-bill-wave" class="mr-1" />
            ${{ espacio?.price_per_hour }} / Por Hora
          </p>
        </div>
      </div>

      <!-- Formulario de Reserva -->
      <div class="bg-white p-6 rounded-lg shadow-md space-y-4">
        <label class="text-lg font-semibold block">Duración de la Reserva (horas)</label>
        <div class="flex gap-4">
          <input v-model.number="cantidad" type="number" min="1" class="border p-2 rounded w-1/3"
            placeholder="Cantidad de horas" />
          <div class="border p-2 rounded w-2/3 flex items-center bg-gray-100">
            <font-awesome-icon icon="clock" class="mr-2" />
            <span class="font-semibold">Por Hora</span>
          </div>
        </div>

        <!-- Input para Fecha y Hora de Inicio -->
        <div>
          <label class="text-lg font-semibold block mb-2">Fecha y Hora de Inicio</label>
          <input v-model="startTime" type="datetime-local" class="border p-2 rounded w-full" />
        </div>

        <!-- Visualización de la Fecha y Hora de Finalización (calculada) -->
        <div v-if="startTime">
          <label class="text-lg font-semibold block mb-2">Fecha y Hora de Finalización</label>
          <div class="border p-2 rounded w-full bg-gray-100">
            <span class="font-semibold">{{ endTime }}</span>
          </div>
        </div>
      </div>

      <!-- Precio Total -->
      <div class="bg-white p-6 rounded-lg shadow-md flex justify-between items-center">
        <p class="text-xl font-semibold">Total a Pagar:</p>
        <p class="text-2xl font-bold text-primary">${{ totalPagar }}</p>
      </div>

      <!-- Botón para Procesar Pago -->
      <button @click="procesarPago"
        class="w-full bg-accent text-white p-4 rounded-lg text-lg font-bold shadow-md hover:shadow-xl transition-all">
        <font-awesome-icon icon="credit-card" class="mr-2" />
        Ir a Pagar
      </button>
    </section>

    <!-- Sección Derecha: Imagen Opcional -->
    <aside class="w-full lg:w-1/3 lg:flex flex-col justify-center items-center hidden gap-4">
      <img v-for="(img, index) in espacio?.images?.slice(1, 4)" :key="index" :src="`http://localhost:3000${img}`"
        alt="Imagen del espacio" class="rounded-lg shadow-lg max-w-full" />
    </aside>
  </div>
  <SessionExpired :sessionExpired="activedSession" />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useReservationStore } from '../store/reservationStore';
import { verifyActiveSession } from '../middleware/verifyToken';
import { useUserStore } from '../store/userStore';
import SessionExpired from '../components/SessionExpired.vue';
import { getSpaceById } from '../services/spaceService';

const userStore = useUserStore();
const activedSession = ref(false);

const tarifas = { hour: 1 };

const router = useRouter();
const route = useRoute();
const reservationStore = useReservationStore();

// Variables reactivas
const cantidad = ref(1);
const rangoTiempo = ref("hour");
const startTime = ref("");
const espacio = ref(null);

// Función para formatear la fecha en hora local ("YYYY-MM-DD HH:mm")
const formatLocalDateTime = (date) => {
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

// Computed: Total a Pagar
const totalPagar = computed(() => {
  if (!espacio.value) return 0;
  return espacio.value.price_per_hour * cantidad.value * tarifas[rangoTiempo.value];
});

// Computed: Fecha y Hora de Finalización
const endTime = computed(() => {
  if (!startTime.value) return "";
  const inicio = new Date(startTime.value);
  const fin = new Date(inicio.getTime() + cantidad.value * 60 * 60 * 1000);
  return formatLocalDateTime(fin);
});

// obtener datos del espacio mediante API
const obtenerEspacio = async () => {
  try {
    const id = route.params.id;
    const space = await getSpaceById(id);
    espacio.value = space;
    rangoTiempo.value = "hour";
    return space;
  } catch (error) {
    console.error("Error al obtener el espacio:", error);
  }
};

onMounted(obtenerEspacio);


const procesarPago = async () => {
  try {
    if (!startTime.value) {
      throw new Error("Por favor, ingresa la fecha y hora de inicio de la reserva.");
    }
    if (!espacio.value) {
      throw new Error("No se ha seleccionado un espacio válido.");
    }

    const route = '/pago';
    const { id, owner_id } = espacio.value;
    const queryParams = {
      id,
      owner_id,
      total: totalPagar.value,
      start_time: startTime.value,
      end_time: endTime.value
    };

    const sessionValid = await verifyActiveSession(route, userStore.sessionExpired);
    if (!sessionValid) {
      userStore.clearUser();
      activedSession.value = true;
      return;
    }

    reservationStore.setReservationData({
      space_id: id,
      owner_id,
      start_time: startTime.value,
      end_time: endTime.value,
      total: totalPagar.value,
    });

    if (!userStore.isAuthenticated) {
      activedSession.value = true;
      return;
    }

    router.push({ path: route, query: queryParams });
  } catch (error) {
    console.error("Error:", error);
    alert(error.message);
  }
};
</script>

<style scoped></style>
