<template>
  <div class="flex items-center justify-center min-h-screen bg-light px-4 py-10">
    <div class="bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full border border-gray-300">
      <h1 class="text-4xl font-bold text-center text-primary mb-8">Registrar Nuevo Espacio</h1>
      <form @submit.prevent="addSpace" class="space-y-6">
        <!-- Nombre del Espacio -->
        <label class="block">
          <span class="text-lg font-semibold text-black">Nombre del espacio:</span>
          <input v-model="name" type="text" class="input-field" required />
        </label>

        <!-- Ubicación con Autocomplete -->
        <label class="block">
          <span class="text-lg font-semibold text-black">Ubicación:</span>
          <GMapAutocomplete class="input-field" @place_changed="setPlace" />
        </label>
        <!-- Se almacenan los datos básicos de ubicación -->
        <input v-model="latitude" type="hidden" />
        <input v-model="longitude" type="hidden" />
        <input v-model="location" type="hidden" />

        <!-- Detalles Adicionales de Ubicación -->
        <label class="block">
          <span class="text-lg font-semibold text-black">
            Detalles de Ubicación (edificio, piso, número, subsuelo, etc.):
          </span>
          <input
            v-model="locationDetails"
            type="text"
            class="input-field"
            placeholder="Ej: Edificio A, 3er piso, subsuelo, Nº 15"
          />
        </label>

        <!-- Tipo de Vehículo -->
        <label class="block">
          <span class="text-lg font-semibold text-black">Tipo de vehículo:</span>
          <select v-model="type" class="input-field">
            <option value="Auto">🚗 Auto</option>
            <option value="Bicicleta">🚲 Bicicleta</option>
            <option value="Camioneta">🚙 Camioneta</option>
          </select>
        </label>

        <!-- Capacidad -->
        <label class="block">
          <span class="text-lg font-semibold text-black">Capacidad:</span>
          <input v-model.number="capacity" type="number" min="1" class="input-field" placeholder="Ej: 4" required />
        </label>

        <!-- Tipo de Estacionamiento -->
        <label class="block">
          <span class="text-lg font-semibold text-black">Tipo de estacionamiento:</span>
          <select v-model="parking_type" class="input-field">
            <option disabled value="">Seleccione una opción</option>
            <option value="Cubierto">Cubierto</option>
            <option value="Descubierto">Descubierto</option>
            <option value="Ninguno">Ninguno</option>
          </select>
        </label>

        <!-- Descripción -->
        <label class="block">
          <span class="text-lg font-semibold text-black">Descripción del espacio:</span>
          <textarea v-model="description" class="input-field" rows="3" placeholder="Ingrese una descripción detallada"></textarea>
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
            <label>
              <input type="checkbox" v-model="paymentMethods" value="Efectivo" /> 💵 Efectivo
            </label>
            <label>
              <input type="checkbox" v-model="paymentMethods" value="Mercado Pago" @change="updatePaymentFields" /> 💳 Mercado Pago
            </label>
          </div>
        </fieldset>

        <!-- Datos de Wallet para Mercado Pago -->
        <fieldset v-if="paymentMethods.includes('Mercado Pago')" class="border p-4 rounded-lg">
          <legend class="text-lg font-semibold text-black">Datos de Wallet (Mercado Pago)</legend>
          <label class="block">
            <span class="text-lg font-semibold text-black">Correo de Mercado Pago:</span>
            <input v-model="walletDetails.mpEmail" type="email" class="input-field" placeholder="correo@ejemplo.com" required />
          </label>
        </fieldset>

        
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
            <img v-for="(img, index) in previewImages" :key="index" :src="img" class="w-20 h-20 object-cover rounded-lg shadow-md" />
          </div>
        </label>

        <!-- Botón de envío -->
        <button type="submit" class="btn-primary">Guardar Espacio</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import api from '../services/apiService';


const name = ref('');
const location = ref('');
const locationDetails = ref('');
const latitude = ref(null);
const longitude = ref(null);
const price = ref(0);
const price_unit = ref('hour');
const availability = ref({ start: '', end: '', dateRange: [] });
const capacity = ref(0);
const type = ref('Auto');
const parking_type = ref('');
const description = ref('');
const paymentMethods = ref([]);
const previewImages = ref([]);

// Datos de la wallet 
const walletDetails = ref({
  mpEmail: ''
});

// Toggle
const isActive = ref(true);


const owner_id = ref(1); // Se asigna según el usuario logueado
const status = ref('active');

const router = useRouter();


const handleFileUpload = (event) => {
  const files = event.target.files;
  for (let file of files) {
    const reader = new FileReader();
    reader.onload = (e) => previewImages.value.push(e.target.result);
    reader.readAsDataURL(file);
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

};


const addSpace = async () => {
  let price_per_hour = price.value;
  if (price_unit.value === 'day') {
    price_per_hour = price.value / 24;
  } else if (price_unit.value === 'week') {
    price_per_hour = price.value / (24 * 7);
  } else if (price_unit.value === 'month') {
    price_per_hour = price.value / (24 * 30);
  }
  

  status.value = isActive.value ? 'active' : 'paused';
  
  const newSpace = {
    owner_id: owner_id.value,
    location: location.value,
    location_details: locationDetails.value,
    latitude: latitude.value,
    longitude: longitude.value,
    price_per_hour: price_per_hour,
    capacity: capacity.value,
    type: type.value,
    parking_type: parking_type.value,
    description: description.value,
    images: previewImages.value,
    availability: availability.value,
    status: status.value,
    name: name.value,
    paymentMethods: paymentMethods.value,
    walletDetails: paymentMethods.value.includes('Mercado Pago') ? walletDetails.value : null,
  };

  try {
    await api.post('/spaces/create', newSpace);
    router.push('/add-space');
  } catch (error) {
    console.error('Error en el registro del espacio:', error);
  }
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
input:checked + .slider {
  background-color: #007bff;
}
input:checked + .slider:before {
  transform: translateX(26px);
}
.slider.round {
  border-radius: 34px;
}
.slider.round:before {
  border-radius: 50%;
}
</style>
