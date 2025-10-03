<template>
  <section class="shadow-xl p-8 xl:p-10 md:rounded-2xl h-max border border-gray-200 bg-white space-y-2">
    <!-- Título -->
    <h2 class="text-2xl font-bold text-primary mb-2">📅 Reservá tu espacio</h2>
    <p class="text-sm text-gray-600">Completá los siguientes pasos para confirmar tu reserva</p>

    <!-- Disponibilidad -->
    <div class="bg-blue-50 border border-blue-300 text-blue-800 rounded-lg px-4 py-3 text-sm font-medium">
      <div v-if="availability.dateRange?.length === 2">
        <span class="font-semibold">📆 Fechas disponibles:</span>
        {{ formatDate(availability.dateRange[0]) }} - {{ formatDate(availability.dateRange[1]) }}
      </div>
      <div>
        <span class="font-semibold">⏰ Horarios disponibles:</span>
        <span v-if="availability.start && availability.end">
          {{ availability.start }} - {{ availability.end }} hs
        </span>
        <span v-else>No especificados</span>
      </div>
    </div>

    <!-- Selección vehículo y plazo -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <MenuDropdown :modelValue="tipoVehiculo" @update:modelValue="$emit('update:tipoVehiculo', $event)"
        :options="vehicleOptions" title="🚗 Seleccioná tu vehículo" class="border border-gray-300 rounded-xl" />
      <MenuDropdown :modelValue="tipoPlazoReserva" @update:modelValue="$emit('update:tipoPlazoReserva', $event)"
        :options="plazoOptions" title="⏳ ¿Por cuánto tiempo?" class="border border-gray-300 rounded-xl" />
    </div>

    <!-- Selección de fechas -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <!-- CheckIn -->
      <div class="flex flex-col border border-gray-200 rounded-xl p-3 bg-gray-50">
        <label class="font-semibold mb-1">Entrada</label>
        <Datepicker :modelValue="tiempoInicial" @update:modelValue="$emit('update:tiempoInicial', $event)"
          :enable-time-picker="tipoPlazoReserva === 'Por hora'" :is24="true" :model-type="'timestamp'"
          :min-date="getMinDate()" :max-date="availability.dateRange ? availability.dateRange[1] : undefined"
          :min-time="parseTimeString(availability.start)" :max-time="parseTimeString(availability.end)"
          placeholder="Seleccioná fecha y hora" />
      </div>

      <!-- CheckOut -->
      <div class="flex flex-col border border-gray-200 rounded-xl p-3 bg-gray-50">
        <label class="font-semibold mb-1">Salida</label>
        <Datepicker :modelValue="tiempoFinal" @update:modelValue="$emit('update:tiempoFinal', $event)"
          :enable-time-picker="tipoPlazoReserva === 'Por hora'" :is24="true" :model-type="'timestamp'"
          :min-date="minCheckOut" :max-date="maxCheckOut"
          :min-time="tipoPlazoReserva === 'Por hora' ? parseTimeString(formatHour(new Date(tiempoInicial))) : parseTimeString(availability.start)"
          :max-time="parseTimeString(availability.end)" placeholder="Seleccioná fecha y hora" />
      </div>
    </div>

    <!-- Tarifa -->
    <div class="border border-gray-300 rounded-xl px-6 py-4 text-center bg-gray-50">
      <span class="block text-sm font-semibold text-gray-600">Total estimado</span>
      <span class="text-3xl font-extrabold text-primary">${{ totalCalculado }}</span>
      <p class="text-xs text-gray-500 mt-1">El precio puede variar según el plazo y vehículo seleccionado</p>
    </div>

    <!-- Botón reservar -->
    <button @click="$emit('reservar')"
      class="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-indigo-500 to-primary text-white px-6 py-3 rounded-xl text-lg font-bold shadow-md hover:shadow-xl transition-all">
      <font-awesome-icon icon="calendar-check" class="text-xl" />
      Reservar Ahora
    </button>
  </section>
</template>

<script setup>
import MenuDropdown from "../layout/MenuDropdown.vue";
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { computed } from "vue";

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
  "update:tipoVehiculo",
  "update:tipoPlazoReserva",
  "update:tiempoInicial",
  "update:tiempoFinal",
  "reservar"
]);

// Helpers
function parseTimeString(timeStr) {
  if (!timeStr) return undefined;
  const [hours, minutes] = timeStr.split(":").map(Number);
  return { hours, minutes };
}

function formatHour(date) {
  return date.toTimeString().slice(0, 5);
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" });
}

function getMinDate() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (props.availability.dateRange?.[0]) {
    const start = new Date(props.availability.dateRange[0]);
    return start > today ? start : today;
  }
  return today;
}

// Lógica checkOut
const minCheckOut = computed(() => {
  if (props.tipoPlazoReserva === "Por hora" && props.tiempoInicial) {
    return new Date(props.tiempoInicial + 60 * 1000); // +1 minuto
  }
  return props.availability.dateRange?.[0] ? new Date(props.availability.dateRange[0]) : undefined;
});

const maxCheckOut = computed(() => {
  if (props.tipoPlazoReserva === "Por hora" && props.tiempoInicial) {
    const checkInDate = new Date(props.tiempoInicial);
    const [maxHour, maxMinute] = (props.availability.end || "23:59").split(":").map(Number);
    const maxDate = new Date(checkInDate);
    maxDate.setHours(maxHour, maxMinute, 0, 0);
    return maxDate;
  }
  return props.availability.dateRange?.[1] ? new Date(props.availability.dateRange[1]) : undefined;
});

const plazoOptions = computed(() => {
  // Si no viene availability.term, usamos "Por hora" por defecto
  if (!props.availability?.term) return ['Por hora'];
  return [props.availability.term];
});


</script>

<style scoped>
/* Opcional: mejorar UX al enfocar */
:deep(.dp__input) {
  @apply border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary rounded-lg;
}
</style>
