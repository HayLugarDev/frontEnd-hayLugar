<template>
  <div class="flex items-center justify-center min-h-screen bg-light px-4 py-10">
    <div class="bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full border border-gray-300">
      <h1 class="text-4xl font-bold text-center text-primary mb-8">Registrar Nuevo Espacio</h1>
      <form @submit.prevent="addSpace" class="space-y-6">
        <FormField 
          v-model="name" 
          label="Nombre del espacio:" 
          type="text" 
          placeholder="Ej: Casa centro" 
          required 
        />
        <!-- Ubicación con Autocomplete -->
        <label class="block">
          <span class="text-lg font-semibold text-black">Ubicación:</span>
          <GMapAutocomplete class="input-field" @place_changed="setPlace" />
        </label>
        <!-- Datos básicos de ubicación -->
        <input v-model="latitude" type="hidden" />
        <input v-model="longitude" type="hidden" />
        <input v-model="location" type="hidden" />

        <!-- Detalles Adicionales de Ubicación -->
        <FormField 
          v-model="locationDetails" 
          label="Detalles de Ubicación (edificio, piso, número, subsuelo, etc.):" 
          type="text" 
          placeholder="Ej: Edificio A, 3er piso, subsuelo, Nº 15" 
          required 
        />

        <!-- Tipos de Vehículos -->
        <div>
          <span class="text-lg font-semibold text-black block mb-2">Tipos de vehículos:</span>
          <div class="flex space-x-4">
            <VehicleTypeButton :isSelected="selectedVehicleTypes.includes('car')" vehicleType="Auto" iconType="car"
              @click="toggleParkingType('car')" />
            <VehicleTypeButton :isSelected="selectedVehicleTypes.includes('motorcycle')" vehicleType="Motocicleta"
              iconType="motorcycle" @click="toggleParkingType('motorcycle')" />
            <VehicleTypeButton :isSelected="selectedVehicleTypes.includes('bicycle')" vehicleType="Bicicleta"
              iconType="bicycle" @click="toggleParkingType('bicycle')" />
            <VehicleTypeButton :isSelected="selectedVehicleTypes.includes('van')" vehicleType="Camioneta"
              iconType="truck" @click="toggleParkingType('van')" />
          </div>
        </div>

        <!-- Capacidad -->
        <FormField 
          v-model.number="capacity" 
          label="Capacidad:" 
          type="number" 
          placeholder="Ej: 4"
          required 
        />

        <!-- Tipo de Estacionamiento -->
        <label class="block">
          <span class="text-lg font-semibold text-black">Tipo de estacionamiento:</span>
          <select v-model="type" class="input-field">
            <option disabled value="">Seleccione una opción</option>
            <option value="garage">Garage propio</option>
            <option value="large_space">Espacio grande</option>
            <option value="private_parking">Estacionamiento privado</option>
          </select>
        </label>

        <!-- Superficie de Estacionamiento -->
        <label class="block">
          <span class="text-lg font-semibold text-black">Superficie de estacionamiento:</span>
          <select v-model="parking_type" class="input-field">
            <option disabled value="">Seleccione una opción</option>
            <option value="cubierto">Cubierto</option>
            <option value="descubierto">Descubierto</option>
            <option value="ninguno">Ninguno</option>
          </select>
        </label>

        <!-- Descripción -->
        <label class="block">
          <span class="text-lg font-semibold text-black">Descripción del espacio:</span>
          <textarea v-model="description" class="input-field" rows="3"
            placeholder="Ingrese una descripción detallada"></textarea>
        </label>

        <!-- Tarifa y Duración -->
        <label class="block">
          <span class="text-lg font-semibold text-black">Tarifa y duración (ARS):</span>
          <div class="grid grid-cols-2 gap-4">
            <div class="relative">
              <span class="absolute left-3 top-3 text-gray-600">$</span>
              <input v-model.number="price" type="number" class="input-field pl-7" placeholder="Ej: 1500" required />
            </div>
            <select v-model="price_unit" class="input-field" @change="updateAvailabilityFields">
              <option value="hour">Por Hora</option>
              <option value="day">Por Día</option>
              <option value="week">Por Semana</option>
              <option value="month">Por Mes</option>
            </select>
          </div>
        </label>

        <!-- Disponibilidad (por hora) -->
        <fieldset v-if="price_unit === 'hour'" class="border p-4 rounded-lg">
          <legend class="text-lg font-semibold text-black">Horario de Disponibilidad</legend>
          <div class="grid grid-cols-2 gap-4">
            <label>
              <span>Desde:</span>
              <input v-model="availability.start" type="time" class="input-field" required />
            </label>
            <label>
              <span>Hasta:</span>
              <input v-model="availability.end" type="time" class="input-field" required />
            </label>
          </div>
        </fieldset>

        <!-- Disponibilidad (por semana o mes) -->
        <fieldset v-if="price_unit === 'week' || price_unit === 'month'" class="border p-4 rounded-lg">
          <legend class="text-lg font-semibold text-black">Selecciona un período</legend>
          <VueDatePicker v-model="availability.dateRange" range class="input-field" />
        </fieldset>

        <!-- Métodos de Pago Aceptados -->
        <fieldset class="border p-4 rounded-lg">
          <legend class="text-lg font-semibold text-black">Métodos de Pago Aceptados</legend>
          <div class="grid grid-cols-2 gap-2">
            <!-- <label class="flex items-center space-x-1">
              <input type="checkbox" v-model="paymentMethods" value="Efectivo" />
              <font-awesome-icon :icon="['fas', 'money-bill-wave']" />
              <span>Efectivo</span>
            </label> -->
            <label class="flex items-center space-x-1">
              <input type="checkbox" v-model="paymentMethods" value="Mercado Pago" @change="updatePaymentFields" />
              <font-awesome-icon :icon="['fas', 'credit-card']" />
              <span>Mercado Pago</span>
            </label>
          </div>
        </fieldset>

        <!-- Datos de Wallet para Mercado Pago -->
        <fieldset v-if="paymentMethods.includes('Mercado Pago')" class="border p-4 rounded-lg">
          <legend class="text-lg font-semibold text-black">Datos de Wallet (Mercado Pago)</legend>
          <label class="block">
            <span class="text-lg font-semibold text-black">Correo de Mercado Pago:</span>
            <input v-model="walletDetails.mpEmail" type="email" class="input-field" placeholder="correo@ejemplo.com"
              required />
          </label>
        </fieldset>

        <!-- Toggle para Publicación Activa -->
        <div class="flex items-center space-x-4">
          <span class="text-lg font-semibold text-black">Publicación Activa</span>
          <label class="switch">
            <input type="checkbox" v-model="isActive" />
            <span class="slider round"></span>
          </label>
        </div>

        <!-- Imágenes -->
        <label class="block">
          <span class="text-lg font-semibold text-black">Imágenes del Espacio:</span>
          <input type="file" multiple @change="handleFileUpload" class="input-field" />
          <div class="flex flex-wrap mt-2 gap-2">
            <img v-for="(img, index) in previewImages" :key="index" :src="img"
              class="w-20 h-20 object-cover rounded-lg shadow-md" />
          </div>
        </label>

        <!-- Botón de envío -->
        <button type="submit" class="btn-primary">Guardar Espacio</button>
      </form>
    </div>

    <!-- Modal de Éxito -->
    <transition name="fade">
      <div v-if="showSuccessModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="bg-white rounded-lg shadow-xl p-8 max-w-md w-full transform transition-all scale-95">
          <div class="flex flex-col items-center">
            <img src="/src/assets/logo.jpeg" alt="Logo" class="w-20 h-20 mb-4" />
            <h2 class="text-3xl font-bold text-primary mb-2">¡Éxito!</h2>
            <p class="text-lg text-gray-700 text-center mb-6">El espacio se ha guardado correctamente.</p>
            <button @click="closeSuccesModal"
              class="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
              Continuar
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import api from '../services/apiService';
import VehicleTypeButton from "../components/VehicleTypeButton.vue";
import FormField from '../components/FormField.vue';

const name = ref('');
const location = ref('');
const locationDetails = ref('');
const latitude = ref(null);
const longitude = ref(null);
const price = ref(0);
const price_unit = ref('hour');
const availability = ref({ start: '', end: '', dateRange: [] });
const capacity = ref(0);
const type = ref(''); // Valor inicial
const parking_type = ref('');
const description = ref('');
const paymentMethods = ref([]);
const previewImages = ref([]);

const selectedFiles = ref([]);

// Datos de la wallet para Mercado Pago
const walletDetails = ref({
  mpEmail: ''
});


const isActive = ref(true);

const owner_id = ref(1);
const status = ref('active');

const router = useRouter();
const showSuccessModal = ref(false);

const selectedVehicleTypes = ref([]);

const toggleParkingType = (type) => {
  console.log(selectedVehicleTypes.value);
  if (selectedVehicleTypes.value.includes(type)) {
    selectedVehicleTypes.value = selectedVehicleTypes.value.filter(t => t !== type);
  } else {
    selectedVehicleTypes.value.push(type);
  }
};

const handleFileUpload = (event) => {
  selectedFiles.value = [...event.target.files];
  previewImages.value = [];
  for (let file of selectedFiles.value) {
    const reader = new FileReader();
    reader.onload = (e) => previewImages.value.push(e.target.result);
    reader.readAsDataURL(file);
    console.log(file);
  }
};

const setPlace = (place) => {
  location.value = place.formatted_address || '';
  latitude.value = place.geometry.location.lat();
  longitude.value = place.geometry.location.lng();
};

const updateAvailabilityFields = () => {
  availability.value = { start: '', end: '', dateRange: [] };
};

const updatePaymentFields = () => {
  // Aquí  realizar validaciones o ajustes al cambiar métodos de pago
};

const addSpace = async () => {
  console.log(selectedVehicleTypes.value);
  let price_per_hour = price.value;
  if (price_unit.value === 'day') {
    price_per_hour = price.value / 24;
  } else if (price_unit.value === 'week') {
    price_per_hour = price.value / (24 * 7);
  } else if (price_unit.value === 'month') {
    price_per_hour = price.value / (24 * 30);
  }

  status.value = isActive.value ? 'active' : 'paused';

  const formData = new FormData();

  formData.append('owner_id', owner_id.value);
  formData.append('location', location.value);
  formData.append('location_details', locationDetails.value);
  formData.append('latitude', latitude.value);
  formData.append('longitude', longitude.value);
  formData.append('price_per_hour', price_per_hour);
  formData.append('capacity', capacity.value);
  formData.append('type', type.value);
  formData.append('parking_type', parking_type.value);
  formData.append('description', description.value);
  formData.append('status', status.value);
  formData.append('name', name.value);

  formData.append('paymentMethods', JSON.stringify(paymentMethods.value));

  selectedVehicleTypes.value.forEach((type, index) => {
  formData.append(`vehicle_types[${index}]`, type);
});

  
  if (paymentMethods.value.includes('Mercado Pago')) {
    formData.append('walletDetails', JSON.stringify(walletDetails.value));
  }

  // Agregar imágenes al FormData
  selectedFiles.value.forEach((file, _index) => {
    formData.append('images', file);
  });
  console.log(parking_type.value);

  try {
    const response = await api.post('/spaces/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    showSuccessModal.value = true;
    console.log(response);
  } catch (error) {
    console.error('Error en el registro del espacio:', error);
  }
};

const closeSuccesModal = () => {
  showSuccessModal.value = false;
  router.push('/dashboard');
};
</script>

<style>
.bg-light {
  background-color: #f8f9fa;
}

.input-field {
  width: 100%;
  padding: 12px;
  border: 2px solid #007bff;
  border-radius: 8px;
  background-color: #ffffff;
  font-size: 16px;
}

.btn-primary {
  width: 100%;
  background-color: #007bff;
  color: #fff;
  padding: 12px;
  border-radius: 8px;
  font-weight: bold;
  text-align: center;
  transition: background 0.3s ease;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.text-primary {
  color: #007bff;
}

.text-black {
  color: #000;
}

/* Estilos para el toggle switch */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
}

input:checked+.slider {
  background-color: #007bff;
}

input:checked+.slider:before {
  transform: translateX(26px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

/* Modal transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
