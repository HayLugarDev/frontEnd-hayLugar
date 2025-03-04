<template>
  <div class="flex items-center justify-center min-h-screen bg-secondary px-4">
    <div class="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
      <h1 class="text-3xl font-bold text-center text-dark mb-6">Registrar Nuevo Espacio</h1>
      <form @submit.prevent="addSpace" class="space-y-4">
        <input v-model="name" type="text" placeholder="Nombre del espacio"
          class="w-full p-3 border rounded-lg shadow-sm" required />

        <input v-model="ubicacion" class="w-full p-3 border rounded-lg shadow-sm" placeholder="Ubicación"
          @place_changed="setPlace" />

        <select v-model="tipo" class="w-full p-3 border rounded-lg shadow-sm">
          <option value="car">🚗 Auto</option>
          <option value="bicycle">🚲 Bicicleta</option>
          <option value="van">🚙 Camioneta</option>
        </select>

        <input v-model="precio" type="number" placeholder="Precio por hora ($)"
          class="w-full p-3 border rounded-lg shadow-sm" required />

        <fieldset class="border p-4 rounded-lg shadow-sm">
          <legend class="font-semibold text-lg">Métodos de Pago Aceptados</legend>
          <label class="block mt-2"><input type="checkbox" v-model="metodosPago" value="credit_card" /> 💳
            Tarjeta</label>
          <label class="block mt-2"><input type="checkbox" v-model="metodosPago" value="effective" /> 💵
            Efectivo</label>
          <label class="block mt-2"><input type="checkbox" v-model="metodosPago" value="transfer" /> 🔄
            Transferencia</label>
        </fieldset>

        <textarea v-model="descripcion" placeholder="Descripción del espacio"
          class="w-full p-3 border rounded-lg shadow-sm resize-none" rows="3"></textarea>

        <button type="submit"
          class="w-full bg-accent text-dark py-3 rounded-lg font-semibold shadow-lg hover:bg-yellow-500">Guardar
          Espacio</button>
      </form>
      <p class="mt-6 text-center">
        <router-link to="/dashboard" class="text-primary font-bold hover:underline">⬅️ Volver al Dashboard</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
//import { GMapAutocomplete } from 'vue3-google-map';

const name = ref('');
const ubicacion = ref('');
const tipo = ref('Auto');
const precio = ref('');
const metodosPago = ref([]);
const descripcion = ref('');
const ownerId = ref(null);
const router = useRouter();

const setPlace = (place) => {
  ubicacion.value = place.formatted_address;
  console.log(place.formatted_address);
};

const addSpace = async () => {
  try {
    const spaceData = {
      name: name.value,
      location: ubicacion.value,
      latitude: 45.55357848,
      longitude: 47.665656,
      type: tipo.value,
      price_per_hour: precio.value,
      paymentMethods: metodosPago.value,
      description: descripcion.value,
    };
    console.log(spaceData);
    const response = await axios.post('http://localhost:3000/api/spaces/create', spaceData, {
      withCredentials: true
    });
    if (response.request.statusText === 'Created') {
      alert('Espacio agregado correctamente');
      router.push('/dashboard');
    } else {
      alert('Error al agregar el espacio. Inténtalo de nuevo.');
    }
  } catch (error) {
    console.error('Error al agregar el espacio:', error);
    alert('Ocurrió un error. Inténtalo de nuevo.');
  }
};
</script>