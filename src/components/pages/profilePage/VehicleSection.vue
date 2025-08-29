<template>
  <section class="md:bg-white bg-secondary p-8 rounded-2xl shadow-xl w-full md:w-2/3 md:min-h-full min-h-screen">
    <!-- Encabezado -->
    <div class="flex flex-col items-start md:flex-row md:items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-primary flex items-center gap-2 w-full">
        <font-awesome-icon :icon="['fas', 'car']" />
        Vehículos Registrados
      </h2>
      <div class="flex space-x-2 w-full flex-row justify-between md:justify-end mt-4">
        <button @click="router.push('/add-vehicle')"
          class="md:bg-primary text-primary md:text-white px-4 py-2 rounded-lg shadow hover:text-white hover:bg-primary/90 transition-all flex items-center gap-2 w-1/2 md:w-auto">
          <font-awesome-icon :icon="['fas', 'circle-plus']" />
          Agregar
        </button>
        <div class="flex gap-2 w-auto flex-row justify-end">
          <button v-if="!modoEdicion" @click="editVehicles"
            class="md:bg-yellow-300 text-yellow-500 md:text-white px-4 py-2 rounded-lg shadow hover:bg-yellow-400 transition-all flex items-center gap-2 w-full md:w-auto">
            <font-awesome-icon :icon="['fas', 'pen-to-square']" />
            Editar
          </button>
          <button v-else @click="guardarVehiculos"
            class="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition-all flex items-center gap-2">
            <font-awesome-icon :icon="['fas', 'floppy-disk']" />
            Guardar
          </button>
        </div>
      </div>
    </div>

    <!-- Lista de Vehículos -->
    <div v-if="vehiculos.length" class="space-y-6">
      <div v-for="(vehiculo, index) in vehiculos" :key="index"
        class="border border-gray-200 rounded-xl p-5 shadow-md hover:shadow-lg transition-all bg-gray-50">
        <div v-if="!modoEdicion" class="grid grid-cols-1 sm:grid-cols-2 text-gray-800">
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
            <span><strong>Patente:</strong> {{ vehiculo.license_plate === null ? 'No aplica' : vehiculo.license_plate
            }}</span>
          </div>
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 text-gray-800 gap-x-2">
          <!-- <FormField v-model="vehiculo.type" label="Tipo" class="mt-0" /> -->
          <div class="flex flex-col">
            <label class="text-md font-semibold text-black">Tipo</label>
            <select v-model="vehiculo.type" class="border border-gray-300 rounded-md px-4 py-2">
              <option disabled value="">Seleccione un tipo</option>
              <option v-for="option in vehicleTypes" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
          <FormFieldVehicle v-model="vehiculo.model" label="Modelo" class="mt-0" allowNull="false"/>
          <FormFieldVehicle v-model="vehiculo.color" label="Color" class="mt-0" allowNull="false"/>
          <FormFieldVehicle v-model="vehiculo.license_plate" label="Patente" class="mt-0" allowNull="false"/>
        </div>
      </div>
    </div>
    <!-- Sin vehículos -->
    <div v-else class="text-center text-gray-500 mt-6">
      <p>No tienes ningún vehículo registrado aún.</p>
    </div>
    <!-- Modal de Éxito -->
    <transition name="fade">
      <div v-if="showSuccessModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="bg-white rounded-lg shadow-xl p-8 max-w-md w-full transform transition-all scale-95">
          <div class="flex flex-col items-center">
            <img src="/src/assets/logo.jpeg" alt="Logo" class="w-20 h-20 mb-4" />
            <h2 class="text-3xl font-bold text-primary mb-2">¡Éxito!</h2>
            <p class="text-lg text-gray-700 text-center mb-6">Los cambios se han guardado correctamente.</p>
            <button @click="closeSuccessModal"
              class="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
              Continuar
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal de Error -->
    <transition name="fade">
      <div v-if="showErrorModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="bg-white rounded-lg shadow-xl p-8 max-w-md w-full transform transition-all scale-95">
          <div class="flex flex-col items-center">
            <img src="/src/assets/logo.jpeg" alt="Logo" class="w-20 h-20 mb-4" />
            <h2 class="text-3xl font-bold text-red-600 mb-2">¡Error!</h2>
            <p class="text-lg text-gray-700 text-center mb-6">{{ errorMessage }}</p>
            <button @click="closeErrorModal"
              class="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-800 transition">
              Intentar de Nuevo
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
      console.log(vehiculos.value);
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
  console.log(vehiculos.value);

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
