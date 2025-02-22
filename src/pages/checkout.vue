<template>
    <div class="flex flex-col md:flex-row min-h-screen bg-secondary p-6 gap-6">
      <!-- Sección Izquierda: Resumen del Espacio -->
      <div class="w-full md:w-2/3 space-y-6">
        <h1 class="text-3xl font-bold text-primary">Finalizar Reserva</h1>
        
        <div class="bg-white p-6 rounded-lg shadow-md flex items-center">
          <img :src="espacio.image" alt="Espacio" class="w-32 h-32 object-cover rounded-lg shadow-md mr-6" />
          <div>
            <h2 class="text-xl font-bold">{{ espacio.ubicacion }}</h2>
            <p class="text-gray-600">{{ espacio.descripcion }}</p>
            <p class="text-lg text-primary font-semibold mt-2">💰 ${{ espacio.precio }}/{{ rangoTiempo }}</p>
          </div>
        </div>
        
        <!-- Formulario de Selección -->
        <div class="bg-white p-6 rounded-lg shadow-md">
          <label class="text-lg font-semibold">Duración de la Reserva</label>
          <div class="flex gap-4 mt-2">
            <input v-model="cantidad" type="number" min="1" class="border p-2 rounded w-1/3" />
            <select v-model="rangoTiempo" class="border p-2 rounded w-2/3">
              <option value="hora">Por Hora</option>
              <option value="dia">Por Día</option>
              <option value="semana">Por Semana</option>
              <option value="mes">Por Mes</option>
            </select>
          </div>
        </div>
        
        <!-- Precio Total -->
        <div class="bg-white p-6 rounded-lg shadow-md flex justify-between items-center">
          <p class="text-xl font-semibold">Total a Pagar:</p>
          <p class="text-2xl font-bold text-primary">${{ calcularTotal() }}</p>
        </div>
        
        <!-- Botón para Pagar -->
        <button @click="procesarPago" class="w-full bg-accent text-white p-4 rounded-lg text-lg font-bold shadow-md">
          Ir a Pagar
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  const cantidad = ref(1);
  const rangoTiempo = ref("hora");
  
  const espacio = ref({
    ubicacion: "Calle 123, San Miguel de Tucumán",
    descripcion: "Amplio estacionamiento con seguridad las 24 horas.",
    precio: 500,
    image: "https://source.unsplash.com/400x300/?parking,garage"
  });
  
  const tarifas = { hora: 1, dia: 24, semana: 168, mes: 720 };
  const calcularTotal = () => espacio.value.precio * cantidad.value * tarifas[rangoTiempo.value];
  
  const procesarPago = () => {
    router.push("/pago");
  };
  </script>