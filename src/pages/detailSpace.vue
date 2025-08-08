<template>
  <MainHeader />
  <div class="flex flex-col bg-secondary xl:w-11/12 mx-auto md:gap-4 mt-16 md:mt-0">


    <main class="relative flex flex-col lg:rounded-lg overflow-hidden lg:px-10 w-full xl:w-11/12 mx-auto">
      <div v-if="espacio?.images?.length">
        <!-- Carrusel en móviles -->
        <Carousel :images="espacio.images" class="lg:hidden" :controls="false" />

        <!-- Info del anfitrión -->
        <section v-if="espacio?.host" class="col-span-3 bg-secondary p-6 px-10 rounded-xl shadow-md mt-6 font-normal">
          <div class="flex flex-row items-center gap-4">
            <img :src="hostImage" alt="Imagen del anfitrión" class="w-16 h-16 rounded-full shadow-md" />
            <div class="flex flex-col pl-8 md:pl-0 md:flex-row sm:justify-around w-full text-gray-800">
              <div class="flex flex-row gap-1 items-center">
                <p class="text-lg font-semibold">Anfitrión: </p><span>{{ espacio.host.name }} {{ espacio.host.last_name
                }}</span>
              </div>
              <div class="flex flex-row gap-1 items-center">
                <p v-if="espacio.host.phone" class="text-xl">
                  <font-awesome-icon :icon="['fab', 'whatsapp']" class="text-2xl text-green-800" />
                  <span>+549{{ espacio.host.phone }}</span>
                </p>
              </div>
              <div class="flex flex-row gap-1 items-center">
                <p class="font-semibold">Email: </p><span>{{ espacio.host.email }}</span>
              </div>
            </div>
            <BackButton class="md:hidden" />
          </div>
        </section>

        <!-- Título + Favorito -->
        <div class="flex flex-row items-center justify-between mt-4 px-2">
          <h1 class="text-4xl sm:text-3xl font-bold p-2 text-primary">{{ espacio.name }}</h1>
          <font-awesome-icon :icon="[activedFavouriteIcon ? 'fas' : 'far', 'heart']" :class="[
            activedFavouriteIcon ? 'text-red-500 scale-110' : 'text-gray-700',
            'text-3xl cursor-pointer transition-transform duration-300 ease-in-out',
            isAnimating ? 'animate-ping-once' : ''
          ]" @click="toggleFavourite" />
        </div>

        <!-- Galería de imágenes grande -->
        <div class="hidden lg:grid grid-cols-8 grid-rows-8 gap-2 py-4 h-[400px]">
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
          <div class="col-span-6 grid grid-cols-3 grid-rows-2 gap-1 sm:gap-4 p-10">
            <div class="col-span-2">
              <p v-if="espacio.location" class="text-xl font-bold text-gray-800">
                {{ espacio.location.split(',')[1] || '' }}
              </p>
              <p class="text-lg md:text-2xl text-gray-500 font-semibold">{{ espacio.location.split(',')[0] }}</p>
              <div class="my-4">
                <div v-for="v in espacio.vehicle_capacities" :key="v.type" class="p-2 px-6 border-2 shadow-xl">
                  <p class="font-semibold text-2xl">{{ vehicleTypeTranslations[v.type] || v.type }}</p>
                  <p v-if="v.price_per_hour" class="font-normal">Precio por hora: ${{
                    v.price_per_hour.toLocaleString() }}</p>
                </div>
              </div>
            </div>

            <div class="col-start-3 flex flex-col items-end text-2xl">
              <span class="text-gray-800 font-semibold">
                <span class="text-yellow-600">★</span> 4,70
              </span>
              <span class="font-serif cursor-pointer hover:underline text-sm sm:text-md">62 Opiniones</span>
            </div>

            <section class="col-span-3 border border-gray-300 p-4 rounded-lg text-xl">
              <p class="font-semibold">Descripción:</p>
              <p class="text-gray-600 font-medium">{{ espacio.description }}</p>
            </section>

            <div class="col-span-3 flex justify-center items-center h-[350px]">
              <CustomGoogleMap :center="{ lat: Number(espacio.latitude), lng: Number(espacio.longitude) }"
                class="w-full h-full rounded-lg overflow-hidden shadow-md">
                <GMapMarker :position="{ lat: Number(espacio.latitude), lng: Number(espacio.longitude) }" :icon="{
                  url: carMarker,
                  scaledSize: { width: 40, height: 40 }
                }" />
              </CustomGoogleMap>
            </div>
          </div>

          <!-- Formulario reserva -->
          <section class="col-span-4 shadow-2xl p-8 md:p-4 xl:p-6 md:rounded-xl h-max sm:border border-zinc-700">
            <h2 class="text-2xl font-semibold mb-4">Completá tu reserva</h2>
            <div class="grid grid-cols-2 gap-4">
              <MenuDropdown v-model="tipoVehiculo" :options="vehicleOptions" title="Seleccioná tu vehículo"
                class="border border-gray-700 rounded-xl" />
              <MenuDropdown v-model="tipoPlazoReserva" :options="['Por hora', 'Por día', 'Por mes']"
                title="¿Por cuánto tiempo?" class="border border-gray-500 rounded-xl" />

              <!-- CheckIn -->
              <div class="col-span-1 flex flex-col border border-gray-500 rounded-xl p-2 items-center">
                <label class="font-semibold">CheckIn</label>
                <Datepicker v-model="tiempoInicial" :enable-time-picker="tipoPlazoReserva !== 'Por hora' ? false : true" :is24="true" :model-type="'timestamp'"
                  :min-date="new Date()" placeholder="Entrada" />
              </div>

              <!-- CheckOut -->
              <div class="col-span-1 flex flex-col border border-gray-500 rounded-xl p-2 items-center">
                <label class="font-semibold">CheckOut</label>
                <Datepicker v-model="tiempoFinal" :enable-time-picker="tipoPlazoReserva !== 'Por hora' ? false : true" :is24="true" :model-type="'timestamp'"
                  :min-date="tiempoInicial" placeholder="Salida" />
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
  </div>
  <SessionExpired :sessionExpired="isSessionInvalid" />

  <VehicleSelectModal :show="showVehicleModal" :vehicles="vehiculosUsuario"
    :vehicleType="reverseVehicleTypeTranslations[tipoVehiculo]" @selected="onSelectedVehicle"
    @close="showVehicleModal = false" />

</template>


<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import CustomGoogleMap from '../components/layout/GoogleMap.vue';
import MainHeader from "../components/layout/header/MainHeader.vue";
import carMarker from '../assets/logo.png';
import user_icon_primary from "../assets/user_icon_primary.png";
import { getSpaceById } from '../services/spaceService';
import MenuDropdown from "../components/layout/MenuDropdown.vue";
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import Carousel from '../components/common/Carousel.vue';
import { useReservationStore } from '../store/reservationStore';
import BackButton from "../components/common/BackButton.vue";
import { useVerifyToken } from '../logic/useVerifyToken';
import SessionExpired from '../components/common/SessionExpired.vue';
import { useUserStore } from '../store/userStore';
import { baseURL } from '../services/apiService';
import vehicleLabel from '../logic/useVehicleLabel';
import { getAllVehicles } from '../services/vehicleService';
import VehicleSelectModal from '../components/pages/detailSpacePage/VehicleSelectModal.vue';

const userStore = useUserStore();
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
const fetchImages = ref([]);
const paymentMethods = ref([]);
const getImageUrl = (img) => `${baseURL}${img}`;

const showVehicleModal = ref(false);
const vehiculosUsuario = ref([]);
const vehiculoSeleccionado = ref(null);

const { verifyToken, isSessionInvalid } = useVerifyToken();

const obtenerEspacio = async () => {
  try {
    const id = route.params.id;
    const space = await getSpaceById(id);
    console.log(space.images)
    return espacio.value = space;
  } catch (error) {
    console.error("Error al obtener el espacio:", error);
  }
};

onMounted(async () => {
  await obtenerEspacio();
  await userStore.fetchUser();
});

// const markerIcon = computed(() => {
//   const tipo = espacio.value?.vehicle_types?.[0]?.toLowerCase?.();
//   switch (tipo) {
//     case 'car':
//       return { url: carMarker, scaledSize: { width: 40, height: 40 } };
//     case 'van':
//       return { url: truckMarker, scaledSize: { width: 40, height: 40 } };
//     case 'bicycle':
//       return { url: bicycleMarker, scaledSize: { width: 40, height: 40 } };
//     case 'motorcycle':
//       return { url: truckMarker, scaledSize: { width: 40, height: 40 } };
//     default:
//       return null;
//   }
// });

const reservar = async () => {
  if (!espacio.value || !tiempoInicial.value || !tiempoFinal.value || !tipoVehiculo.value) {
    return alert('Faltan completar campos para la reserva');
  }

  await verifyToken();
  if (isSessionInvalid.value) return;

  try {
    const vehiculos = await getAllVehicles();
    vehiculosUsuario.value = vehiculos.filter(v => v.type === reverseVehicleTypeTranslations[tipoVehiculo.value]);

    if (vehiculosUsuario.value.length === 0) {
      return alert('No tenés vehículos registrados para este tipo.');
    }

    showVehicleModal.value = true;
  } catch (error) {
    console.error('Error al traer vehículos', error);
  }
};

const onSelectedVehicle = (vehicle) => {
  vehiculoSeleccionado.value = vehicle;
  console.log(vehicle);
  const payload = {
    owner_id: espacio.value.owner_id,
    space_id: espacio.value.id,
    vehicle_id: vehiculoSeleccionado.value.id,
    vehicle_type: reverseVehicleTypeTranslations[tipoVehiculo.value],
    start_time: new Date(tiempoInicial.value).toISOString(),
    end_time: new Date(tiempoFinal.value).toISOString(),
    dead_line: deadLine.value,
    total: totalCalculado.value,
    user_vehicle_id: vehicle.id
  };

  reservationStore.setReservationData(payload);
  router.push('/pago');
};

const totalCalculado = computed(() => {
  if (!tiempoInicial.value || !tiempoFinal.value || !espacio.value || !tipoVehiculo.value) return 0;

  const inicio = new Date(tiempoInicial.value);
  const fin = new Date(tiempoFinal.value);

  if (isNaN(inicio.getTime()) || isNaN(fin.getTime()) || fin <= inicio) return 0;

  // Buscar la tarifa del vehículo seleccionado
  let precioHora = 0;
  if (Array.isArray(espacio.value.vehicle_capacities)) {
    const tipoOriginal = reverseVehicleTypeTranslations[tipoVehiculo.value];
    const vehicle = espacio.value.vehicle_capacities.find(v => v.type === tipoOriginal);
    if (vehicle) {
      precioHora = Number(vehicle.price_per_hour);
    }
  }

  if (precioHora === 0) return 0;

  const diferenciaMs = fin - inicio;

  switch (tipoPlazoReserva.value) {
    case 'Por hora': {
      const horas = diferenciaMs / (1000 * 60 * 60);
      deadLine.value = horas;
      return Math.ceil(horas) * precioHora;
    }
    case 'Por día': {
      const dias = diferenciaMs / (1000 * 60 * 60 * 24);
      deadLine.value = dias;
      return Math.ceil(dias) * precioHora * 24;
    }
    case 'Por mes': {
      const meses = diferenciaMs / (1000 * 60 * 60 * 24 * 30);
      deadLine.value = meses;
      return Math.ceil(meses) * precioHora * 24 * 30;
    }
    default:
      return 0;
  }
});

const vehicleOptions = computed(() => {
  if (!espacio.value?.vehicle_capacities) return [];

  return espacio.value.vehicle_capacities.map(v => (vehicleLabel(v.type)));
});

const vehicleTypeTranslations = {
  car: 'Auto',
  motorcycle: 'Moto',
  van: 'Camioneta',
  bicycle: 'Bicicleta',
  // truck: 'Camión',
  // suv: 'SUV',
};

const reverseVehicleTypeTranslations = Object.fromEntries(
  Object.entries(vehicleTypeTranslations).map(([en, es]) => [es, en])
);

const hostImage = computed(() => {
  console.log("Host:", espacio.value.host);
  return espacio.value.host?.profile_picture || user_icon_primary;
});

const imageGridPosition = (index) => {
  const positions = [
    'col-start-5 row-start-1',
    'col-start-7 row-start-1',
    'col-start-5 row-start-5',
    'col-start-7 row-start-5'
  ];
  return `col-span-4 md:col-span-2 row-span-4 ${positions[index] || ''}`;
};

const toggleFavourite = async () => {
  await verifyToken();
  if (isSessionInvalid.value) return;

  activedFavouriteIcon.value = !activedFavouriteIcon.value;
  isAnimating.value = true;

  setTimeout(() => {
    isAnimating.value = false;
  }, 400);
};

</script>

<style scoped></style>
