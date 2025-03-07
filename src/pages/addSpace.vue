<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 px-4 py-10">
    <div class="bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full border border-gray-300">
      <h1 class="text-4xl font-bold text-center text-primary mb-8">Registrar Nuevo Espacio</h1>
      <form @submit.prevent="addSpace" class="space-y-6">
        <!-- Nombre del Espacio -->
        <label class="block">
          <span class="text-lg font-semibold text-black">Nombre del espacio:</span>
          <input v-model="name" type="text" class="input-field" required />
        </label>

        <!-- Ubicación -->
        <label class="block">
          <span class="text-lg font-semibold text-black">Ubicación:</span>
          <GMapAutocomplete class="input-field" @place_changed="setPlace" />
        </label>
        <input v-model="latitude" type="hidden" />
        <input v-model="longitude" type="hidden" />

        <!-- Tipo de Vehículo -->
        <label class="block">
          <span class="text-lg font-semibold text-black">Tipo de vehículo:</span>
          <select v-model="type" class="input-field">
            <option value="Auto">🚗 Auto</option>
            <option value="Bicicleta">🚲 Bicicleta</option>
            <option value="Camioneta">🚙 Camioneta</option>
          </select>
        </label>

        <!-- Precio y Unidad de Tiempo -->
        <label class="block">
          <span class="text-lg font-semibold text-black">Tarifa y duración (Pesos Argentinos - ARS):</span>
          <div class="grid grid-cols-2 gap-4">
            <div class="relative">
              <span class="absolute left-3 top-3 text-gray-600">$</span>
              <input v-model="price" type="number" class="input-field pl-7" placeholder="Ej: 1500" required />
            </div>
            <select v-model="price_unit" class="input-field" @change="updateAvailabilityFields">
              <option value="hour">Por Hora</option>
              <option value="day">Por Día</option>
              <option value="week">Por Semana</option>
              <option value="month">Por Mes</option>
            </select>
          </div>
        </label>

        <!-- Horario de disponibilidad dinámico -->
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

        <fieldset v-if="price_unit !== 'hour'" class="border p-4 rounded-lg">
          <legend class="text-lg font-semibold text-black">Días Disponibles</legend>
          <div class="grid grid-cols-2 gap-2">
            <label v-for="day in days" :key="day">
              <input type="checkbox" v-model="availability.days" :value="day" /> {{ day }}
            </label>
          </div>
        </fieldset>

        <!-- Métodos de Pago -->
        <fieldset class="border p-4 rounded-lg">
          <legend class="text-lg font-semibold text-black">Métodos de Pago Aceptados</legend>
          <div class="grid grid-cols-3 gap-2">
            <label>
              <input type="checkbox" v-model="paymentMethods" value="Tarjeta" @change="updatePaymentFields" /> 💳 Tarjeta
            </label>
            <label>
              <input type="checkbox" v-model="paymentMethods" value="Efectivo" /> 💵 Efectivo
            </label>
            <label>
              <input type="checkbox" v-model="paymentMethods" value="Transferencia" @change="updatePaymentFields" /> 🔄 Transferencia
            </label>
          </div>
        </fieldset>

        <!-- Datos financieros adicionales -->
        <label v-if="paymentMethods.includes('Tarjeta')" class="block">
          <span class="text-lg font-semibold text-black">Procesador de Pagos:</span>
          <input v-model="paymentDetails.processor" type="text" class="input-field" placeholder="Ej: MercadoPago" />
        </label>
        <label v-if="paymentMethods.includes('Transferencia')" class="block">
          <span class="text-lg font-semibold text-black">CBU / CVU:</span>
          <input v-model="paymentDetails.cbu" type="text" class="input-field" placeholder="Clave Bancaria" />
        </label>

        <!-- Carga de Imágenes -->
        <label class="block">
          <span class="text-lg font-semibold text-black">Imágenes del Espacio:</span>
          <input type="file" multiple @change="handleFileUpload" class="input-field" />
          <div class="flex flex-wrap mt-2 gap-2">
            <img v-for="(img, index) in previewImages" :key="index" :src="img" class="w-20 h-20 object-cover rounded-lg shadow-md" />
          </div>
        </label>

        <!-- Botón de Enviar -->
        <button type="submit" class="btn-primary">Guardar Espacio</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const name = ref('');
const price = ref(0);
const price_unit = ref('hour');
const availability = ref({ start: '', end: '', days: [] });
const paymentMethods = ref([]);
const paymentDetails = ref({ processor: '', cbu: '' });
const previewImages = ref([]);
const router = useRouter();

const handleFileUpload = (event) => {
  const files = event.target.files;
  for (let file of files) {
    const reader = new FileReader();
    reader.onload = (e) => previewImages.value.push(e.target.result);
    reader.readAsDataURL(file);
  }
};
</script>

<style>
.input-field {
  width: 100%;
  padding: 12px;
  border: 2px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  font-size: 16px;
}

.btn-primary {
  width: 100%;
  background-color: #ffcc00;
  color: #333;
  padding: 12px;
  border-radius: 8px;
  font-weight: bold;
  text-align: center;
  transition: background 0.3s ease;
}
.btn-primary:hover {
  background-color: #e6b800;
}

.text-primary {
  color: #0056b3;
}
.text-black {
  color: #000;
}

fieldset {
  border: 2px solid #ddd;
  padding: 10px;
  border-radius: 8px;
}

label {
  display: block;
  margin-bottom: 5px;
}
</style>