<template>
  <section class="shadow-2xl p-8 md:p-10 xl:p-6 md:rounded-xl h-max sm:border border-zinc-700">
    <h2 class="text-2xl font-semibold mb-4">Completá tu reserva</h2>
    <div class="grid grid-cols-2 gap-4">
      <MenuDropdown 
        :modelValue="tipoVehiculo" 
        @update:modelValue="$emit('update:tipoVehiculo', $event)" 
        :options="vehicleOptions" 
        title="Seleccioná tu vehículo"
        class="border border-gray-700 rounded-xl" 
      />
      <MenuDropdown 
        :modelValue="tipoPlazoReserva" 
        @update:modelValue="$emit('update:tipoPlazoReserva', $event)" 
        :options="['Por hora', 'Por día', 'Por mes']"
        title="¿Por cuánto tiempo?" 
        class="border border-gray-500 rounded-xl" 
      />

      <!-- CheckIn -->
      <div class="col-span-1 flex flex-col border border-gray-500 rounded-xl p-2 items-center">
        <label class="font-semibold">CheckIn</label>
        <Datepicker 
          :modelValue="tiempoInicial" 
          @update:modelValue="$emit('update:tiempoInicial', $event)"
          :enable-time-picker="tipoPlazoReserva !== 'Por hora' ? false : true" 
          :is24="true" 
          :model-type="'timestamp'"
          :min-date="new Date()" 
          placeholder="Entrada" 
        />
      </div>

      <!-- CheckOut -->
      <div class="col-span-1 flex flex-col border border-gray-500 rounded-xl p-2 items-center">
        <label class="font-semibold">CheckOut</label>
        <Datepicker 
          :modelValue="tiempoFinal" 
          @update:modelValue="$emit('update:tiempoFinal', $event)"
          :enable-time-picker="tipoPlazoReserva !== 'Por hora' ? false : true" 
          :is24="true" 
          :model-type="'timestamp'"
          :min-date="tiempoInicial" 
          placeholder="Salida" 
        />
      </div>

      <!-- Tarifa -->
      <div class="col-span-2 border border-gray-800 rounded-xl px-4 py-2 text-center">
        <span class="block text-sm font-semibold">TARIFA:</span>
        <span class="text-2xl font-bold text-gray-800">${{ totalCalculado }}</span>
      </div>

      <!-- Botón reservar -->
      <button 
        @click="$emit('reservar')" 
        class="col-span-2 bg-accent text-white px-6 py-3 rounded-lg text-lg font-bold shadow-md hover:shadow-xl">
        <font-awesome-icon icon="calendar-check" class="mr-2" />
        Reservar Ahora
      </button>
    </div>
  </section>
</template>

<script setup>
import MenuDropdown from "../layout/MenuDropdown.vue";
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

defineProps({
  tipoVehiculo: String,
  tipoPlazoReserva: String,
  tiempoInicial: Number,
  tiempoFinal: Number,
  totalCalculado: Number,
  vehicleOptions: Array
});

defineEmits([
  'update:tipoVehiculo',
  'update:tipoPlazoReserva',
  'update:tiempoInicial',
  'update:tiempoFinal',
  'reservar'
]);
</script>
