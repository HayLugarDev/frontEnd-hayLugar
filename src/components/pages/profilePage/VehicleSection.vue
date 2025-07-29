<template>
  <section class="bg-white p-8 rounded-2xl shadow-xl mb-10 w-full md:w-2/3">
    <!-- Encabezado -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-semibold text-primary flex items-center gap-2">
        <font-awesome-icon :icon="['fas', 'car']" />
        Vehículos Registrados
      </h2>
      <button
        @click="router.push('/add-vehicle')"
        class="bg-primary text-white px-4 py-2 rounded-lg shadow hover:bg-primary/90 transition-all flex items-center gap-2"
      >
        <font-awesome-icon :icon="['fas', 'circle-plus']" />
        Agregar
      </button>
    </div>

    <!-- Lista de Vehículos -->
    <div v-if="vehiculos.length" class="space-y-6">
      <div
        v-for="(vehiculo, index) in vehiculos"
        :key="index"
        class="border border-gray-200 rounded-xl p-5 shadow-md hover:shadow-lg transition-all bg-gray-50"
      >
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800">
          <div class="flex items-center gap-2">
            <font-awesome-icon icon="car-side" class="text-primary" />
            <span><strong>Tipo:</strong> {{ vehicleLabel(vehiculo.type) }}</span>
          </div>
          <div class="flex items-center gap-2">
            <font-awesome-icon icon="palette" class="text-primary" />
            <span><strong>Color:</strong> {{ vehiculo.color || 'No especificado' }}</span>
          </div>
          <div class="flex items-center gap-2">
            <font-awesome-icon icon="rectangle-list" class="text-primary" />
            <span><strong>Modelo:</strong> {{ vehiculo.model || 'No especificado' }}</span>
          </div>
          <div class="flex items-center gap-2">
            <font-awesome-icon icon="id-card" class="text-primary" />
            <span><strong>Patente:</strong> {{ vehiculo.license_plate }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Sin vehículos -->
    <div v-else class="text-center text-gray-500 mt-6">
      <p>No tienes ningún vehículo registrado aún.</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getAllVehicles } from '../../../services/vehicleService';
import vehicleLabel from '../../../logic/useVehicleLabel';
import { useRouter } from 'vue-router';

const vehiculos = ref([]);
const cargando = ref(true);
const errorMessage = ref('');
const router = useRouter();

const fetchVehicles = async () => {
  try {
    const vehicles = await getAllVehicles();

    if (!vehicles || vehicles.length < 1) {
      vehiculos.value = [];
      errorMessage.value = 'Aún no hay vehículos cargados.';
    } else {
      vehiculos.value = vehicles;
    }
  } catch (err) {
    errorMessage.value = 'No se pudieron cargar los vehículos.';
    console.error(err);
  } finally {
    cargando.value = false;
  }
};

onMounted(fetchVehicles);
</script>
