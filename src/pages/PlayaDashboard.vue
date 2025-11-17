<template>
  <div class="bg-secondary min-h-screen pb-10">
    <div class="p-6">
      <h1 class="text-3xl font-bold text-primary mb-4">
        🅿️ Playas de Estacionamiento Disponibles
      </h1>

      <div v-if="loading" class="text-center text-gray-600 py-10">
        Cargando playas...
      </div>

      <div v-else-if="error" class="text-center text-red-600 py-10">
        {{ error }}
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <router-link
          v-for="playa in playas"
          :key="playa.id"
          :to="`/playa/${playa.id}`"
          class="block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition hover:scale-[1.01]"
        >
          <div class="p-4">
            <h2 class="text-2xl font-semibold text-accent">{{ playa.name }}</h2>
            <p class="text-gray-600 text-sm">{{ playa.address }}</p>
            <p class="text-sm mt-2">
              <span class="font-bold">Capacidad:</span> {{ playa.capacity }} lugares
            </p>
            <p class="text-sm">
              <span class="font-bold">Tarifa:</span> ${{ playa.hourly_rate }} / hora
            </p>
            <p class="text-sm mb-4">
              <span class="font-bold">Horario:</span> {{ formatSchedule(playa.schedule) }}
            </p>

            <!-- Mini mapa -->
            <div class="rounded-lg overflow-hidden shadow-sm">
              <CustomGoogleMap
                :center="{ lat: parseFloat(playa.lat), lng: parseFloat(playa.lng) }"
                :zoom="16"
                style="height: 200px"
              >
                <GMapMarker :options="getMarkerOptions(playa)" />
              </CustomGoogleMap>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import CustomGoogleMap from '../components/layout/GoogleMap.vue';
import { getAllParkingLots } from '../services/playaService.ts';
import logoMarker from '../assets/logo.png';

const playas = ref([]);
const loading = ref(true);
const error = ref(null);

const getMarkerOptions = (playa) => ({
  position: {
    lat: parseFloat(playa.lat),
    lng: parseFloat(playa.lng),
  },
  icon: {
    url: logoMarker,
    scaledSize: { width: 40, height: 40 },
  },
  title: `${playa.name} · $${playa.hourly_rate}/h`,
});

const formatSchedule = (schedule) => {
  if (!schedule) return '—';
  try {
    const parsed = typeof schedule === 'string' ? JSON.parse(schedule) : schedule;
    return Object.entries(parsed)
      .map(([dia, hora]) => `${capitalize(dia)}: ${hora}`)
      .join(' | ');
  } catch (e) {
    return 'Horario no disponible';
  }
};

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

onMounted(async () => {
  loading.value = true;
  try {
    const response = await getAllParkingLots();
    playas.value = response;
  } catch (err) {
    error.value = 'No se pudieron cargar las playas.';
    console.error(err);
  } finally {
    loading.value = false;
  }
});
</script>
