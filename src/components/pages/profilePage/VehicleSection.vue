<template>
  <section
    class="pt-20 sm:p-8 sm:bg-white/10 text-white sm:rounded-2xl sm:shadow-xl mb-8 w-full md:w-2/3">

    <div class="flex items-center justify-between mb-4">
      <div>
        <h2 class="hidden text-2xl font-bold text-gray-200 md:flex items-center gap-2">
          <font-awesome-icon :icon="['fas', 'car']" />
          Vehículos
        </h2>
        <p class="text-md text-gray-200 px-6">Gestioná tus vehículos para poder realizar reseras en HayLugar</p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="cargando" class="space-y-4">
      <ItemSkeleton />
      <ItemSkeleton />
    </div>

    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div class="flex flex-wrap gap-2 md:gap-3 justify-end">
        <button v-if="vehiculos.length" @click="router.push('/add-vehicle')"
          class="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl shadow hover:bg-primary/90 transition-all">
          <font-awesome-icon :icon="['fas', 'circle-plus']" />
          Agregar
        </button>
        <button v-if="!modoEdicion && vehiculos.length" @click="editVehicles"
          class="flex items-center gap-2 bg-newgreen/30 hover:bg-newgreen/40 text-white px-4 py-2 rounded-xl shadow transition-all">
          <font-awesome-icon :icon="['fas', 'pen-to-square']" />
          Editar
        </button>
        <button v-else-if="modoEdicion" @click="guardarVehiculos"
          class="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl shadow hover:bg-green-700 transition-all">
          <font-awesome-icon :icon="['fas', 'floppy-disk']" />
          Guardar
        </button>
      </div>
    </div>

    <!-- Lista de Vehículos -->
    <div v-if="vehiculos.length" class="space-y-2">
      <div v-for="(vehiculo, index) in vehiculos" :key="index"
        class="rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 bg-white/5 backdrop-blur-sm">
        <!-- Vista normal -->
        <div v-if="!modoEdicion" class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
          <div v-for="(item, i) in [
            { icon: 'car-side', label: 'Tipo', value: vehicleLabel(vehiculo.type) },
            { icon: 'rectangle-list', label: 'Modelo', value: vehiculo.model || 'No especificado' },
            { icon: 'palette', label: 'Color', value: vehiculo.color || 'No especificado' },
            { icon: 'id-card', label: 'Patente', value: vehiculo.license_plate || 'No aplica' }
          ]" :key="i" class="flex items-center gap-3 p-3 bg-white/10 border-white/10 rounded-xl border transition-all">
            <div class="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-full">
              <font-awesome-icon :icon="item.icon" class="text-newgreen text-md" />
            </div>
            <div class="flex flex-col ">
              <span class="text-sm text-gray-200 font-medium">{{ item.label }}</span>
              <span class="text-base font-semibold text-gray-100">{{ item.value }}</span>
            </div>
          </div>
        </div>

        <!-- Modo edición -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div class="flex flex-col">
            <label class="text-md font-semibold text-gray-700 mb-1">Tipo</label>
            <select v-model="vehiculo.type"
              class="border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-primary/50 focus:outline-none">
              <option disabled value="">Seleccione un tipo</option>
              <option v-for="option in vehicleTypes" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
          <FormFieldVehicle v-model="vehiculo.model" label="Modelo" class="mt-0" />
          <FormFieldVehicle v-model="vehiculo.color" label="Color" class="mt-0" />
          <FormFieldVehicle v-model="vehiculo.license_plate" label="Patente" class="mt-0" />
        </div>
      </div>
    </div>

    <!-- Sin vehículos -->
    <div v-else class="text-center text-gray-500 mt-10 flex flex-col items-center justify-center">
      <div class="bg-primary/10 p-4 rounded-full mb-3">
        <font-awesome-icon icon="car" class="text-primary text-3xl" />
      </div>
      <p class="text-lg font-medium">No tienes ningún vehículo registrado aún.</p>
      <button v-if="!vehiculos.length" @click="router.push('/add-vehicle')"
        class="flex items-center gap-2 text-primary font-semibold bg-white/10 px-4 py-2 rounded-xl shadow hover:bg-white/20 transition-all mt-4">
        <font-awesome-icon :icon="['fas', 'circle-plus']" />
        ¡Agregá tu primer vehículo!
      </button>
    </div>


    <!-- Modales (éxito y error) -->
    <transition name="fade">
      <div v-if="showSuccessModal || showErrorModal"
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full transform transition-all scale-95">
          <div class="flex flex-col items-center">
            <img src="/src/assets/logo.jpeg" alt="Logo" class="w-20 h-20 mb-4" />
            <h2 :class="showSuccessModal ? 'text-3xl font-bold text-primary' : 'text-3xl font-bold text-red-600'"
              class="mb-2">
              {{ showSuccessModal ? '¡Éxito!' : '¡Error!' }}
            </h2>
            <p class="text-lg text-gray-700 text-center mb-6">
              {{ showSuccessModal ? 'Los cambios se han guardado correctamente.' : errorMessage }}
            </p>
            <button @click="showSuccessModal ? closeSuccessModal() : closeErrorModal()"
              :class="showSuccessModal ? 'bg-primary hover:bg-primary/90' : 'bg-red-600 hover:bg-red-800'"
              class="text-white px-6 py-3 rounded-lg transition">
              Continuar
            </button>
          </div>
        </div>
      </div>
    </transition>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getAllVehicles } from '../../../services/vehicleService';
import vehicleLabel from '../../../logic/useVehicleLabel';
import { useRouter } from 'vue-router';
import api from '../../../services/apiService';
import FormFieldVehicle from '../../forms/FormFieldVehicle.vue';
import ItemSkeleton from '../../layout/skeletons/ItemSkeleton.vue';

const vehiculos = ref([]);
const cargando = ref(true);
const router = useRouter();

const showSuccessModal = ref(false);
const showErrorModal = ref(false);
const errorMessage = ref('');

const modoEdicion = ref(false);

const vehicleTypes = [
  { value: 'car', label: 'Auto' },
  { value: 'van', label: 'Camioneta' },
  { value: 'motorcycle', label: 'Moto' },
  { value: 'bicycle', label: 'Bicicleta' }
];

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

const editVehicles = async () => {
  return modoEdicion.value = true;
}
const guardarVehiculos = async () => {

  // Validación personalizada
  const vehiculosInvalidos = vehiculos.value.filter((v) => {
    const requierePatente = v.type === 'car' || v.type === 'van' || v.type === 'motorcycle';
    return requierePatente && (!v.license_plate || v.license_plate.trim() === '');
  });

  if (vehiculosInvalidos.length > 0) {
    errorMessage.value = 'Debes registrar la patente del tipo de vehículo que estas seleccionando';
    showErrorModal.value = true;
    return;
  }

  try {
    await Promise.all(
      vehiculos.value.map((vehiculo) =>
        api.put(`/vehicles/${vehiculo.id}`, vehiculo, { withCredentials: true })
      )
    );
    modoEdicion.value = false;
    showSuccessModal.value = true;
  } catch (error) {
    if (error.response && error.response?.data) {
      console.error('Error al guardar los vehículos', error);
      errorMessage.value = error.response.data.message;
      showErrorModal.value = true;
    } else {
      console.error('Error al guardar los vehículos', error);
      errorMessage.value = 'Error al actualizar el vehículo.';
      showErrorModal.value = true;
    }
  }
};


const closeSuccessModal = () => {
  showSuccessModal.value = false;

};

const closeErrorModal = () => {
  showErrorModal.value = false;
};
</script>

<style scoped>
section {
  animation: fadeIn 0.4s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
