<template>
  <div class="flex flex-col md:flex-row min-h-screen bg-secondary p-6 gap-6">
    <!-- Sección Izquierda: Resumen y Formulario de Reserva -->
    <section class="w-full md:w-2/3 space-y-6">
      <h1 class="text-3xl font-bold text-primary">Finalizar Reserva</h1>
      
      <!-- Resumen del Espacio -->
      <div class="bg-white p-6 rounded-lg shadow-md flex items-center">
        <img 
          :src="espacio?.image || 'https://source.unsplash.com/400x300/?parking,garage'" 
          alt="Imagen del espacio" 
          class="w-32 h-32 object-cover rounded-lg shadow-md mr-6" 
        />
        <div>
          <h2 class="text-xl font-bold">{{ espacio?.location }}</h2>
          <p class="text-gray-600">{{ espacio?.description }}</p>
          <p class="text-lg text-primary font-semibold mt-2">
            <font-awesome-icon icon="money-bill-wave" class="mr-1" />
            ${{ espacio?.price_per_hour }} / Por Hora
          </p>
        </div>
      </div>
      
      <!-- Formulario de Reserva -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <label class="text-lg font-semibold block mb-2">Duración de la Reserva</label>
        <div class="flex gap-4">
          <input 
            v-model.number="cantidad" 
            type="number" 
            min="1" 
            class="border p-2 rounded w-1/3" 
            placeholder="Cantidad" 
          />
          <!-- Como el espacio se ofrece por hora, se fija la unidad y se muestra de forma no editable -->
          <div class="border p-2 rounded w-2/3 flex items-center bg-gray-100">
            <font-awesome-icon icon="clock" class="mr-2" />
            <span class="font-semibold">Por Hora</span>
          </div>
        </div>
      </div>
      
      <!-- Precio Total -->
      <div class="bg-white p-6 rounded-lg shadow-md flex justify-between items-center">
        <p class="text-xl font-semibold">Total a Pagar:</p>
        <p class="text-2xl font-bold text-primary">${{ totalPagar }}</p>
      </div>
      
      <!-- Botón para Procesar Pago -->
      <button 
        @click="procesarPago" 
        class="w-full bg-accent text-white p-4 rounded-lg text-lg font-bold shadow-md hover:shadow-xl transition-all"
      >
        <font-awesome-icon icon="credit-card" class="mr-2" />
        Ir a Pagar
      </button>
    </section>
    
    <!-- Sección Derecha: Imagen Opcional -->
    <aside class="w-full md:w-1/3 flex justify-center items-center">
      <img 
        :src="espacio?.image || 'https://source.unsplash.com/400x300/?parking,garage'" 
        alt="Imagen del espacio" 
        class="rounded-lg shadow-lg max-w-full" 
      />
    </aside>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '../services/apiService';


const tarifas = { hour: 1 };

const router = useRouter();
const route = useRoute();

// Variables reactivas
const cantidad = ref(1);
const rangoTiempo = ref("hour"); // Se fija en "hour"
const espacio = ref(null);


const totalPagar = computed(() => {
  if (!espacio.value) return 0;
  return espacio.value.price_per_hour * cantidad.value * tarifas[rangoTiempo.value];
});


const obtenerEspacio = async () => {
  try {
    const id = route.params.id; // Se espera una ruta como /checkout/:id
    const response = await api.get(`/spaces/getbyid/${id}`);
    
    rangoTiempo.value = "hour";
  } catch (error) {
    console.error("Error al obtener el espacio:", error);
  }
};

onMounted(obtenerEspacio);


const procesarPago = () => {
  if (espacio.value) {
    router.push({
      path: '/pago',
      query: {
        id: espacio.value.id,
        cantidad: cantidad.value,
        unidad: rangoTiempo.value, 
        total: totalPagar.value
      }
    });
  }
};
</script>

<style scoped>

</style>
