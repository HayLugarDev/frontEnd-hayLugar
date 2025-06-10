<template>
  <MainHeader />
  <div class="flex flex-col bg-secondary xl:w-11/12 mx-auto md:gap-4">
    <BackButton class="md:hidden" />

    <main class="relative flex flex-col lg:rounded-lg overflow-hidden lg:px-10 w-full xl:w-11/12 mx-auto">
      <div v-if="espacio?.images?.length">
        <!-- Carrusel en móviles -->
        <Carousel :images="espacio.images" class="lg:hidden" :controls="false" />

        <!-- Título + Favorito -->
        <div class="flex flex-row items-center justify-between mt-4 px-4">
          <h1 class="text-4xl sm:text-3xl font-bold p-2 text-gray-700">{{ espacio.name }}</h1>
          <font-awesome-icon :icon="[activedFavouriteIcon ? 'fas' : 'far', 'heart']" :class="[
            activedFavouriteIcon ? 'text-red-500 scale-110' : 'text-gray-700',
            'text-3xl cursor-pointer transition-transform duration-300 ease-in-out',
            isAnimating ? 'animate-ping-once' : ''
          ]" @click="toggleFavourite" />
        </div>

        <!-- Galería de imágenes grande -->
        <div class="hidden lg:grid grid-cols-8 grid-rows-8 gap-2 py-2 h-[400px]">
          <div class="col-span-4 row-span-8">
            <img :src="getImageUrl(espacio.images[0])" alt="Principal"
              class="h-full w-full object-cover rounded-lg shadow-md border" />
          </div>
          <template v-for="(img, index) in espacio.images.slice(1, 5)" :key="index">
            <div :class="imageGridPosition(index)">
              <img :src="getImageUrl(img)" alt="Espacio"
                class="h-full w-full object-cover rounded-lg shadow-md border" />
            </div>
          </template>
        </div>

        <!-- Info general + Formulario -->
        <div class="w-full mx-auto grid grid-cols-1 lg:grid-cols-10 lg:gap-10">
          <!-- Información del espacio -->
          <div class="col-span-6 grid grid-cols-3 grid-rows-2 gap-1 sm:gap-4 p-4 sm:p-10">
            <div class="col-span-2">
              <p class="text-lg sm:text-xl font-bold text-gray-800">
                <font-awesome-icon icon="map-marker-alt" class="mr-1" />
                {{ espacio.location.split(',')[1] }}
              </p>
              <p class="text-xl sm:text-2xl text-gray-500 font-semibold">{{ espacio.location.split(',')[0] }}</p>
              <p class="text-gray-900 font-semibold">
                <font-awesome-icon icon="money-bill-wave" class="mr-1" /> ${{ espacio.price_per_hour }}/hora
              </p>
            </div>

            <div class="col-start-3 flex flex-col items-end text-2xl">
              <span class="text-gray-800 font-semibold">
                <span class="text-yellow-600">★</span> 4,70
              </span>
              <span class="font-serif cursor-pointer hover:underline text-sm sm:text-md">62 Opiniones</span>
            </div>

            <section class="col-span-3 row-start-2 border border-gray-300 p-4 rounded-lg">
              <p class="font-semibold">Descripción:</p>
              <p class="text-gray-600 font-medium">{{ espacio.description }}</p>
            </section>

            <div class="col-span-3 w-80 h-90 flex justify-center items-center bg-red-500">
              <CustomGoogleMap :center="{ lat: Number(espacio.latitude), lng: Number(espacio.longitude) }"
                class="w-full h-full rounded-lg overflow-hidden shadow-md">
                <Marker
                  :options="{ position: { lat: Number(espacio.latitude), lng: Number(espacio.longitude) }, icon: carMarker }" />
              </CustomGoogleMap>
            </div>
          </div>

          <!-- Formulario reserva -->
          <section class="col-span-4 shadow-2xl p-4 xl:p-6 rounded-xl h-max sm:border border-zinc-700">
            <h2 class="text-2xl font-semibold mb-4">Completá tu reserva</h2>
            <div class="grid grid-cols-2 gap-4">
              <MenuDropdown v-model="tipoVehiculo" :options="['Camioneta', 'Auto', 'Motocicleta', 'Bicicleta']"
                title="Seleccioná tu vehículo" class="border border-gray-700 rounded-xl" />
              <MenuDropdown v-model="tipoPlazoReserva" :options="['Por hora', 'Por día', 'Por mes']"
                title="¿Por cuánto tiempo?" class="border border-gray-500 rounded-xl" />

              <!-- CheckIn -->
              <div class="col-span-1 flex flex-col border border-gray-500 rounded-xl p-2 items-center">
                <label class="font-semibold">CheckIn</label>
                <Datepicker v-model="tiempoInicial" :enable-time-picker="true" :is24="true" :model-type="'timestamp'" />
              </div>

              <!-- CheckOut -->
              <div class="col-span-1 flex flex-col border border-gray-500 rounded-xl p-2 items-center">
                <label class="font-semibold">CheckOut</label>
                <Datepicker v-model="tiempoFinal" :enable-time-picker="true" :is24="true" :model-type="'timestamp'" />
              </div>

              <!-- Tarifa -->
              <div class="col-span-2 border border-gray-800 rounded-xl px-4 py-2 text-center">
                <span class="block text-sm font-semibold">TARIFA:</span>
                <span class="text-2xl font-bold text-gray-800">${{ totalCalculado }}</span>
              </div>

              <!-- Botón reservar -->
              <button @click="reservar"
                class="col-span-2 bg-accent text-white px-6 py-3 rounded-lg text-lg font-bold shadow-md hover:shadow-xl">
                <font-awesome-icon icon="calendar-check" class="mr-2" />
                Reservar Ahora
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>

    <!-- Info del anfitrión -->
    <section v-if="espacio?.host" class="bg-secondary p-6 px-10 rounded-xl shadow-md mt-6">
      <div class="flex flex-row items-center gap-4">
        <img :src="getHostImage()" alt="Imagen del anfitrión" class="w-16 h-16 rounded-full shadow-md" />
        <div class="flex flex-col sm:flex-row sm:justify-around w-full text-gray-800">
          <p class="text-lg font-semibold">Anfitrión: {{ espacio.host.name }} {{ espacio.host.last_name }}</p>
          <p class="text-xl"><font-awesome-icon :icon="['fab', 'whatsapp']" class="text-2xl text-green-800" /> +549{{
            espacio.host.phone }}</p>
          <p>Email: {{ espacio.host.email }}</p>
        </div>
      </div>
    </section>
  </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Marker } from 'vue3-google-map';
import CustomGoogleMap from '../components/GoogleMap.vue';
import MainHeader from "../components/MainHeader.vue";
import carMarker from '../assets/logo.png';
import bicycleMarker from '../assets/logo.png';
import user_icon_primary from "../assets/user_icon_primary.png";
import truckMarker from '../assets/logo.png';
import { getSpaceById } from '../services/spaceService';
import MenuDropdown from "../components/MenuDropdown.vue";
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import Carousel from '../components/Carousel.vue';
import { useReservationStore } from '../store/reservationStore';
import BackButton from "../components/BackButton.vue";

const router = useRouter();
const route = useRoute();
const reservationStore = useReservationStore();
const tiempoInicial = ref(null);
const tiempoFinal = ref(null);
const tipoVehiculo = ref('');
const tipoPlazoReserva = ref('Por hora');
const espacio = ref(null);
const deadLine = ref(null);
const activedFavouriteIcon = ref(false);
const isAnimating = ref(false);
const getImageUrl = (img) => `http://localhost:3000${img}`;

const obtenerEspacio = async () => {
  try {
    const id = route.params.id;
    const space = await getSpaceById(id);
    return espacio.value = space;
  } catch (error) {
    console.error("Error al obtener el espacio:", error);
  }
};

onMounted(obtenerEspacio);

const markerIcon = computed(() => {
  if (espacio.value && espacio.value.vehicle_types) {
    const tipo = espacio.value.vehicle_types.toLowerCase().split('"')[1]
    console.log(tipo)
    let iconUrl = null;
    if (tipo === "car") {
      iconUrl = carMarker;
    } else if (tipo === "van") {
      iconUrl = markerIcon;
    } else if (tipo === "bicycle") {
      iconUrl = bicycleMarker;
    } else if (tipo === "motorcycle") {
      iconUrl = truckMarker;
    }
    return { url: iconUrl, scaledSize: { width: 40, height: 40 } };
  }
  return null;
});

const reservar = async () => {
  if (!espacio.value || !tiempoInicial.value || !tiempoFinal.value) {
    alert('Faltan completar campos para la reserva');
    return;
  }

  const payload = {
    owner_id: espacio.value.owner_id,
    space_id: espacio.value.id,
    start_time: new Date(tiempoInicial.value).toISOString(),
    end_time: new Date(tiempoFinal.value).toISOString(),
    dead_line: deadLine.value,
    total: totalCalculado.value,
  };

  reservationStore.setReservationData(payload);
  router.push('/pago');
};

const totalCalculado = computed(() => {
  if (!tiempoInicial.value || !tiempoFinal.value || !espacio.value) return 0;

  const inicio = new Date(tiempoInicial.value);
  console.log('Inicio: ', inicio);
  const fin = new Date(tiempoFinal.value);
  console.log('Final: ', fin);

  if (isNaN(inicio.getTime()) || isNaN(fin.getTime()) || fin <= inicio) return 0;

  const precioHora = Number(espacio.value.price_per_hour);
  const diferenciaMs = fin - inicio;

  switch (tipoPlazoReserva.value) {
    case 'Por hora':
      const horas = diferenciaMs / (1000 * 60 * 60);
      deadLine.value = horas;
      return Math.ceil(horas) * precioHora;

    case 'Por día':
      const dias = diferenciaMs / (1000 * 60 * 60 * 24);
      deadLine.value = dias;
      return Math.ceil(dias) * precioHora * 24;
    case 'Por mes':
      const meses = diferenciaMs / (1000 * 60 * 60 * 24 * 30);
      deadLine.value = meses;
      return Math.ceil(meses) * precioHora * 24 * 30;

    default:
      return 0;
  }
});

const getHostImage = () => {
  return espacio.host?.profile_picture || user_icon_primary;
};

const imageGridPosition = (index) => {
  const positions = [
    'col-start-5 row-start-1',
    'col-start-7 row-start-1',
    'col-start-5 row-start-5',
    'col-start-7 row-start-5'
  ];
  return `col-span-4 md:col-span-2 row-span-4 ${positions[index] || ''}`;
};

const toggleFavourite = () => {
  activedFavouriteIcon.value = !activedFavouriteIcon.value;
  isAnimating.value = true;

  // Detener la animación después de que termine (400ms)
  setTimeout(() => {
    isAnimating.value = false;
  }, 400);
};
</script>

<style scoped></style>
