<template>
  <section class="shadow-2xl p-8 md:p-10 xl:p-6 md:rounded-xl h-max sm:border border-zinc-700">
    <h2 class="text-2xl font-semibold mb-4">Completá tu reserva</h2>
    <div class="grid grid-cols-2 gap-4">

      <!-- Cartel de horarios disponibles -->
      <div class="col-span-2 mb-2">
        <div
          class="bg-blue-100 border border-blue-300 text-blue-800 rounded-lg px-4 py-2 text-center text-sm font-semibold">
          <div v-if="availability.dateRange && availability.dateRange.length === 2">
            <span class="font-bold">Días disponibles: </span>
            <span>
              {{ availability.dateRange[0] }} al {{ availability.dateRange[1] }}
            </span>
          </div>
          <div>
            <span class="font-bold">Horarios disponibles: </span>
            <span v-if="availability.start && availability.end">
              {{ availability.start }} a {{ availability.end }} hs
            </span>
            <span v-else>
              No especificados
            </span>
          </div>
        </div>
      </div>

      <MenuDropdown :modelValue="tipoVehiculo" @update:modelValue="$emit('update:tipoVehiculo', $event)"
        :options="vehicleOptions" title="Seleccioná tu vehículo" class="border border-gray-700 rounded-xl" />
      <MenuDropdown :modelValue="tipoPlazoReserva" @update:modelValue="$emit('update:tipoPlazoReserva', $event)"
        :options="['Por hora', 'Por día', 'Por mes']" title="¿Por cuánto tiempo?"
        class="border border-gray-500 rounded-xl" />

      <!-- CheckIn -->
      <div class="col-span-1 flex flex-col border border-gray-500 rounded-xl p-2 items-center">
        <label class="font-semibold">CheckIn</label>
        <Datepicker :modelValue="tiempoInicial" @update:modelValue="$emit('update:tiempoInicial', $event)"
          :enable-time-picker="tipoPlazoReserva !== 'Por hora' ? false : true" :is24="true" :model-type="'timestamp'"
          :min-date="getMinDate()"
          :min-time="parseTimeString(availability.start)" :max-time="parseTimeString(availability.end)"
          placeholder="Entrada" />
      </div>

      <!-- CheckOut -->
      <div class="col-span-1 flex flex-col border border-gray-500 rounded-xl p-2 items-center">
        <label class="font-semibold">CheckOut</label>
        <Datepicker :modelValue="tiempoFinal" @update:modelValue="$emit('update:tiempoFinal', $event)"
          :enable-time-picker="tipoPlazoReserva === 'Por hora'" :is24="true" :model-type="'timestamp'"
          :min-date="tipoPlazoReserva === 'Por hora' && tiempoInicial ? new Date(tiempoInicial) : (availability.dateRange ? availability.dateRange[0] : undefined)"
          :max-date="tipoPlazoReserva === 'Por hora' && tiempoInicial ? new Date(tiempoInicial) : (availability.dateRange ? availability.dateRange[1] : undefined)"
          :min-time="tipoPlazoReserva === 'Por hora' && tiempoInicial ? parseTimeString(formatHour(new Date(tiempoInicial))) : parseTimeString(availability.start)"
          :max-time="parseTimeString(availability.end)" placeholder="Salida" />
      </div>

      <!-- Tarifa -->
      <div class="col-span-2 border border-gray-800 rounded-xl px-4 py-2 text-center">
        <span class="block text-sm font-semibold">TARIFA:</span>
        <span class="text-2xl font-bold text-gray-800">${{ totalCalculado }}</span>
      </div>

      <!-- Botón reservar -->
      <button @click="$emit('reservar')"
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
import { computed, watch } from "vue";

const props = defineProps({
  tipoVehiculo: String,
  tipoPlazoReserva: String,
  tiempoInicial: Number,
  tiempoFinal: Number,
  totalCalculado: Number,
  vehicleOptions: Array,
  availability: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits([
  'update:tipoVehiculo',
  'update:tipoPlazoReserva',
  'update:tiempoInicial',
  'update:tiempoFinal',
  'reservar'
]);

function parseTimeString(timeStr) {
  if (!timeStr) return undefined;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return { hours, minutes };
}

const minCheckOut = computed(() => {
  if (tipoPlazoReserva === 'Por hora' && tiempoInicial) {
    // Siguiente minuto después del checkin
    return new Date(tiempoInicial + 60 * 1000);
  }
  return availability.dateRange ? availability.dateRange[0] : undefined;
});

const maxCheckOut = computed(() => {
  if (tipoPlazoReserva === 'Por hora' && tiempoInicial) {
    // Mismo día que checkin, pero con hora máxima del espacio
    const checkInDate = new Date(tiempoInicial);
    const [maxHour, maxMinute] = (availability.end || '23:59').split(':').map(Number);
    const maxDate = new Date(checkInDate);
    maxDate.setHours(maxHour, maxMinute, 0, 0);
    return maxDate;
  }
  return availability.dateRange ? availability.dateRange[1] : undefined;
});

watch(
  () => [props.tipoPlazoReserva, props.tiempoInicial],
  ([plazo, checkIn]) => {
    if (plazo === 'Por hora' && checkIn) {
      // Si el checkout está vacío o es de otro día, lo setea al mismo día
      const checkInDate = new Date(checkIn);
      const defaultCheckOut = new Date(checkInDate.getTime() + 60 * 60 * 1000); // +1h
      emit('update:tiempoFinal', defaultCheckOut.getTime());
    }
  }
);

function getMinDate() {
  const today = new Date();
  today.setHours(0,0,0,0);
  if (props.availability.dateRange && props.availability.dateRange[0]) {
    const start = new Date(props.availability.dateRange[0]);
    return start > today ? start : today;
  }
  return today;
}

function formatHour(date) {
  return date.toTimeString().slice(0,5);
}

</script>
