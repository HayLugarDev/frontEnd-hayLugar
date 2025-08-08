<template>
  <div class="relative min-h-screen bg-secondary">
    <MainHeader />
    <FloatingButton :text="buttonText" color="white" background="primary" @toggle="toggleMap" />

    <div class="p-4">
      <h2 class="text-3xl font-bold text-primary mb-2">
        Estacionamientos Inteligentes - UTN
      </h2>
      <p class="text-gray-600 mb-4">
        Visualizá y accedé a los espacios en tiempo real dentro del campus universitario.
      </p>

      <div v-if="error" class="text-red-500 mb-4">{{ error }}</div>

      <div v-if="showMap" class="w-full h-[600px] relative">
        <CustomGoogleMap
          class="rounded-lg overflow-hidden shadow-md"
          :center="center"
          :zoom="zoom"
          :options="mapOptions"
        >
          <!-- Zonas visuales -->
          <GMapPolygon
            v-for="(zona, index) in zonas"
            :key="index"
            :paths="zona.paths"
            :options="zona.options"
          />

          <!-- Marcadores de espacios con colores dinámicos -->
          <GMapMarker
            v-for="(espacio, index) in espacios"
            :key="index"
            :position="{ lat: Number(espacio.latitude), lng: Number(espacio.longitude) }"
            :icon="{
              url: espacio.capacity > 0 ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
            }"
            @mouseover="handleMouseOver(espacio)"
            @mouseout="handleMouseOut"
            @click="handleMarkerClick(espacio)"
          />
        </CustomGoogleMap>

        <!-- Countdown reserva activa -->
        <div
          v-if="reservaActiva"
          class="absolute top-4 right-4 bg-white rounded-lg shadow-xl p-4 w-80 border border-gray-200 z-50 animate-fade-in"
        >
          <h3 class="text-lg font-bold text-primary mb-1">⏳ Reserva activa</h3>
          <p class="text-sm text-gray-700">📍 {{ reservaActiva.espacio.name }}</p>
          <p class="text-sm text-gray-700 mb-2">{{ reservaActiva.espacio.location }}</p>
          <p class="text-sm text-gray-600 font-medium">Tiempo restante:</p>
          <p class="text-lg text-primary font-semibold">{{ tiempoRestante }}</p>
          <button
            class="mt-3 w-full bg-red-500 text-white rounded-md py-2 hover:bg-red-600 transition"
            @click="reservaActiva = null"
          >
            Finalizar reserva
          </button>
        </div>

        <!-- Hover info -->
        <div
          v-if="hoveredSpace"
          class="absolute right-4 top-24 bg-white p-4 rounded-xl shadow-lg w-[320px] z-10 animate-fade-in border border-gray-200"
        >
          <h3 class="text-xl font-semibold text-primary mb-2">{{ hoveredSpace.name }}</h3>
          <p class="text-sm text-gray-700 mb-1">📍 {{ hoveredSpace.location }}</p>
          <p class="text-sm text-gray-700 mb-1">🚗 Tipo: {{ hoveredSpace.type }}</p>
          <p class="text-sm text-gray-700 mb-2">💵 ${{ hoveredSpace.price_per_hour }}/hora</p>
          <button
            class="w-full bg-primary text-white rounded-lg py-2 hover:bg-primary-dark transition font-semibold"
            @click="router.push(`/espacio/${hoveredSpace.id}`)"
          >
            Reservar Ahora
          </button>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <SpaceCard
          v-for="espacio in espacios"
          :key="espacio.id"
          :espacio="espacio"
        />
      </div>
    </div>

    <div class="fixed bottom-0 left-0 w-full z-50">
      <MobileMenu @toggle="toggleMap" :showMap="showMap" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import MainHeader from '../components/layout/header/MainHeader.vue';
import CustomGoogleMap from '../components/layout/GoogleMap.vue';
import FloatingButton from '../components/pages/dashboardPage/FloatingButton.vue';
import MobileMenu from '../components/layout/MobileMenu.vue';
import SpaceCard from '../components/pages/dashboardPage/SpaceCard.vue';
import { getUniversitySpaces } from '../services/universityService';
import { useUniversityMap } from '../logic/useUniversityMap';

const router = useRouter();
const cargando = ref(true);
const espacios = ref([]);
const error = ref(null);
const showMap = ref(true);
const buttonText = computed(() => (showMap.value ? 'Ver Lista' : 'Ver Mapa'));

const {
  center,
  zoom,
  hoveredSpace,
  handleMouseOver,
  handleMouseOut,
  mapOptions,
  setCenterToLocation
} = useUniversityMap();

const zonas = ref([
  {
    nombre: 'Sector A',
    paths: [
      { lat: -26.8169, lng: -65.1989 },
      { lat: -26.8169, lng: -65.1981 },
      { lat: -26.8176, lng: -65.1981 },
      { lat: -26.8176, lng: -65.1989 }
    ],
    options: {
      fillColor: '#34d399',
      fillOpacity: 0.3,
      strokeColor: '#10b981',
      strokeOpacity: 0.9,
      strokeWeight: 2
    }
  },
  {
    nombre: 'Sector B',
    paths: [
      { lat: -26.8177, lng: -65.1989 },
      { lat: -26.8177, lng: -65.1981 },
      { lat: -26.8183, lng: -65.1981 },
      { lat: -26.8183, lng: -65.1989 }
    ],
    options: {
      fillColor: '#f59e0b',
      fillOpacity: 0.3,
      strokeColor: '#d97706',
      strokeOpacity: 0.9,
      strokeWeight: 2
    }
  }
]);

const reservaActiva = ref({
  espacio: {
    name: 'Estacionamiento Principal',
    location: 'Av. Independencia 1800'
  },
  endTime: new Date(Date.now() + 30 * 60 * 1000) // termina en 30 minutos
});

const tiempoRestante = ref('');

const actualizarCountdown = () => {
  const now = new Date();
  const end = new Date(reservaActiva.value.endTime);
  const diff = end.getTime() - now.getTime();
  if (diff <= 0) {
    tiempoRestante.value = 'Finalizado';
    return;
  }
  const minutos = Math.floor((diff / 1000 / 60) % 60);
  const segundos = Math.floor((diff / 1000) % 60);
  tiempoRestante.value = `${minutos}m ${segundos}s`;
};

const obtenerEspaciosUniversitarios = async () => {
  try {
    const data = await getUniversitySpaces();
    espacios.value = (data || []).filter(e => e.university_id);
    if (espacios.value.length === 0) error.value = 'No hay espacios registrados para universidades';
  } catch (err) {
    console.error(err);
    error.value = 'Error al cargar los espacios universitarios';
  } finally {
    cargando.value = false;
  }
};

const toggleMap = () => {
  showMap.value = !showMap.value;
};

const handleMarkerClick = (espacio) => {
  router.push(`/espacio/${espacio.id}`);
};

onMounted(async () => {
  setCenterToLocation(-26.81705174784595, -65.19854513954877);
  await obtenerEspaciosUniversitarios();
  setInterval(obtenerEspaciosUniversitarios, 10000);
  setInterval(actualizarCountdown, 1000);
});
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
</style>
