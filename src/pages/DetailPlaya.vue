<template>

  <MainHeader />

  <!-- BOTÓN ATRÁS MOBILE -->
  <div class="w-full flex justify-end p-4 sm:hidden fixed top-0 left-0 z-50">

    <!-- SAFE AREA -->
    <div class="safe-top"></div>

    <!-- CONTENIDO REAL -->
    <div class="px-6 py-3 sm:py-4 xl:px-16
           flex items-center justify-between gap-6 text-white">

      <BackButton />
    </div>
  </div>

  <div class="px-4 sm:px-8 py-6 bg-secondary min-h-screen">
    <template v-if="loading">
      <div class="text-center py-10 text-gray-500">Cargando datos...</div>
    </template>

    <template v-else-if="!lot">
      <div class="text-center py-10 text-red-500">Playa no encontrada</div>
    </template>

    <template v-else>
      <!-- Título y dirección -->
      <div class="mb-6">
        <h1 class="text-4xl font-bold text-primary drop-shadow-sm mb-2">{{ lot.name }}</h1>
        <p class="text-gray-700 text-lg"><strong>Dirección:</strong> {{ lot.address }}</p>
        <p class="text-gray-700 text-lg"><strong>Capacidad:</strong> {{ lot.capacity }} lugares</p>
        <p class="text-gray-700 text-lg mb-4"><strong>Precio por hora:</strong> ${{ lot.hourly_rate }}</p>

        <!-- Mapa -->
        <div class="w-full h-64 sm:h-80 lg:h-96 rounded-xl overflow-hidden shadow-lg mb-6">
          <GoogleMap :center="mapCenter" :zoom="17" class="w-full h-full" />
        </div>

        <!-- Leyenda -->
        <div class="flex items-center gap-4 flex-wrap mb-8 text-sm">
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 bg-green-400 rounded"></div> Libre
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 bg-yellow-300 rounded"></div> Reservado
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 bg-red-500 rounded"></div> Ocupado
          </div>
        </div>
      </div>

      <!-- Sectores -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div v-for="sector in sectores" :key="sector.nombre"
          class="rounded-2xl bg-white shadow-xl border border-gray-200 transition hover:shadow-2xl">
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h3 class="text-xl font-semibold text-accent">Sector {{ sector.nombre }}</h3>
            <span class="text-sm text-gray-500">{{ sector.spots.length }} lugares</span>
          </div>

          <div class="grid grid-cols-5 sm:grid-cols-6 gap-3 p-4">
            <div v-for="spot in sector.spots" :key="spot.id"
              class="aspect-square rounded-lg flex items-center justify-center text-sm font-bold border shadow-inner transition-transform transform hover:scale-105 cursor-pointer"
              :class="{
                'bg-green-400 text-white border-green-600': spot.estado === 'libre',
                'bg-red-500 text-white border-red-600 animate-pulse': spot.estado === 'ocupado',
                'bg-yellow-300 text-black border-yellow-500': spot.estado === 'reservado',
              }" @click="seleccionarSpot(spot)">
              {{ spot.spot_number }}
            </div>
          </div>
        </div>
      </div>

      <!-- Botón Reservar -->
      <div v-if="hayDisponibles" class="mt-10 text-center">
        <button
          class="bg-accent hover:bg-accent-dark text-white text-lg font-semibold px-8 py-3 rounded-full shadow-lg transition"
          @click="mostrarModal = true">
          Reservar un lugar ahora
        </button>
      </div>

      <div v-else class="text-center text-gray-500 mt-10">
        No hay lugares disponibles por el momento.
      </div>
    </template>

    <!-- Modal de Reserva -->
    <div v-if="mostrarModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
        <h2 class="text-xl font-semibold text-primary mb-4">Confirmar Reserva</h2>

        <div class="mb-4">
          <label class="block mb-1 text-sm font-medium text-gray-700">Seleccioná tu vehículo</label>
          <select v-model="selectedVehicle" class="w-full border border-gray-300 rounded px-3 py-2">
            <option v-for="v in vehiculos" :key="v.id" :value="v.id">
              {{ v.brand }} - {{ v.license_plate }}
            </option>
          </select>
        </div>

        <div class="flex justify-end gap-3">
          <button class="text-gray-500 hover:underline" @click="mostrarModal = false">Cancelar</button>
          <button class="bg-accent text-white font-semibold px-4 py-2 rounded" @click="confirmarReserva">
            Confirmar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getParkingLotById, reservarSpotEnPlaya } from '../services/playaService.ts';
import { getAllVehicles } from '../services/vehicleService.ts';
import GoogleMap from '../components/layout/GoogleMap.vue';
import { useUserStore } from '../store/userStore';
import MainHeader from '../components/layout/header/MainHeader.vue';
import MainHeader from '../components/layout/header/MainHeader.vue';
import BackButton from '../components/common/BackButton.vue';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const lot = ref(null);
const loading = ref(true);
const sectores = ref([]);
const mostrarModal = ref(false);
const selectedSpot = ref(null);
const vehiculos = ref([]);
const selectedVehicle = ref(null);

const userId = computed(() => userStore.user?.id || null);

const agruparPorSector = (spots) => {
  const agrupado = {};
  spots.forEach((spot) => {
    const sector = spot.spot_number.charAt(0).toUpperCase();
    if (!agrupado[sector]) agrupado[sector] = [];
    agrupado[sector].push({
      ...spot,
      estado: spot.is_available ? 'libre' : 'ocupado',
    });
  });
  return Object.entries(agrupado).map(([nombre, spots]) => ({ nombre, spots }));
};

const mapCenter = computed(() => {
  if (!lot.value) return { lat: 0, lng: 0 };
  return {
    lat: parseFloat(lot.value.lat),
    lng: parseFloat(lot.value.lng),
  };
});

const hayDisponibles = computed(() => {
  return lot.value?.spots?.some(s => s.is_available) ?? false;
});

const seleccionarSpot = (spot) => {
  if (!spot.is_available) return;
  selectedSpot.value = spot;
  mostrarModal.value = true;
};

const confirmarReserva = async () => {
  if (!selectedVehicle.value || !selectedSpot.value || !lot.value?.id || !userId.value) {
    alert('Datos incompletos para reservar.');
    return;
  }

  const now = new Date();
  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

  const payload = {
    parking_lot_id: lot.value.id,
    parking_spot_id: selectedSpot.value.id,
    vehicle_id: selectedVehicle.value,
    user_id: userId.value,
    start_time: now.toISOString(),
    end_time: oneHourLater.toISOString(),
    total: lot.value.hourly_rate,
    payment_method: null,
    payment_data: null
  };

  try {
    await reservarSpotEnPlaya(lot.value.id, payload);

    const updated = await getParkingLotById(lot.value.id);
    lot.value = updated;
    sectores.value = agruparPorSector(updated.spots || []);
    mostrarModal.value = false;
    alert('Reserva confirmada con éxito.');
  } catch (err) {
    alert('Error al reservar: ' + (err.response?.data?.error || err.message));
  }
};

onMounted(async () => {
  try {
    const { id } = route.params;
    const data = await getParkingLotById(id);
    lot.value = data;
    sectores.value = agruparPorSector(data.spots || []);

    const vehiculosUser = await getAllVehicles();
    vehiculos.value = vehiculosUser;
    if (vehiculosUser.length > 0) selectedVehicle.value = vehiculosUser[0].id;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
});
</script>
