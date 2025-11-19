<template>
  <section
    class="p-8 xl:p-10 rounded-2xl bg-[#1B263B]/60 backdrop-blur-xl border border-white/10 shadow-2xl space-y-6 text-white"
  >
    <!-- Título -->
    <div>
      <h2 class="text-3xl font-bold text-[#00B4D8] tracking-wide">Reservá tu espacio</h2>
      <p class="text-sm text-gray-300 mt-1">Completá los siguientes pasos para confirmar tu reserva</p>
    </div>

    <!-- Disponibilidad -->
    <div
      class="bg-[#00B4D8]/10 border border-[#00B4D8]/20 rounded-xl px-5 py-4 text-sm font-medium shadow-lg"
    >
      <div v-if="availability.dateRange?.length === 2">
        <span class="font-semibold text-[#06D6A0]">📆 Fechas disponibles:</span>
        <span class="text-gray-200 ml-1">
          {{ availability.dateRange[0] }} → {{ availability.dateRange[1] }}
        </span>
      </div>

      <div class="mt-1">
        <span class="font-semibold text-[#06D6A0]">⏰ Horarios:</span>
        <span class="text-gray-200 ml-1">
          {{ availability.start && availability.end
            ? `${availability.start} - ${availability.end} hs`
            : "No especificados" }}
        </span>
      </div>
    </div>

    <!-- Selección vehículo y plazo -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <MenuDropdown
        :modelValue="tipoVehiculo"
        @update:modelValue="$emit('update:tipoVehiculo', $event)"
        :options="vehicleOptions"
        title="🚗 Seleccioná tu vehículo"
        class="rounded-xl bg-white/5 border border-white/10 text-white"
      />
      <MenuDropdown
        :modelValue="tipoPlazoReserva"
        @update:modelValue="$emit('update:tipoPlazoReserva', $event)"
        :options="plazoOptions"
        title="⏳ ¿Por cuánto tiempo?"
        class="rounded-xl bg-white/5 border border-white/10 text-white"
      />
    </div>

    <!-- Selección fechas -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <!-- CheckIn -->
      <div
        class="flex flex-col rounded-xl p-4 bg-white/5 border border-white/10 shadow-md"
      >
        <label class="font-semibold text-gray-200 mb-2">Check-in</label>

        <Datepicker
          :modelValue="tiempoInicial"
          @update:modelValue="$emit('update:tiempoInicial', $event)"
          :enable-time-picker="tipoPlazoReserva === 'Por hora'"
          :is24="true"
          model-type="timestamp"
          :min-date="getMinDate()"
          :max-date="availability.dateRange?.[1]"
          :min-time="parseTimeString(availability.start)"
          :max-time="parseTimeString(availability.end)"
          placeholder="Seleccionar entrada"
        />
      </div>

      <!-- CheckOut -->
      <div
        class="flex flex-col rounded-xl p-4 bg-white/5 border border-white/10 shadow-md"
      >
        <label class="font-semibold text-gray-200 mb-2">Check-out</label>

        <Datepicker
          :modelValue="tiempoFinal"
          @update:modelValue="$emit('update:tiempoFinal', $event)"
          :enable-time-picker="tipoPlazoReserva === 'Por hora'"
          :is24="true"
          model-type="timestamp"
          :min-date="tipoPlazoReserva === 'Por hora' && tiempoInicial
            ? new Date(tiempoInicial)
            : availability.dateRange?.[0]"
          :max-date="availability.dateRange?.[1]"
          :min-time="tipoPlazoReserva === 'Por hora' && tiempoInicial
            ? parseTimeString(formatHour(new Date(tiempoInicial)))
            : parseTimeString(availability.start)"
          :max-time="parseTimeString(availability.end)"
          placeholder="Seleccionar salida"
        />
      </div>
    </div>

    <!-- Tarifa -->
    <div
      class="rounded-xl px-6 py-5 bg-white/5 border border-white/10 text-center shadow-lg"
    >
      <span class="block text-sm text-gray-300 mb-1">Total estimado</span>
      <span class="text-4xl font-extrabold text-[#06D6A0]">
        ${{ totalCalculado }}
      </span>
      <p class="text-xs text-gray-400 mt-1">
        El precio puede variar según el plazo y vehículo seleccionado
      </p>
    </div>

    <!-- Botón reservar -->
    <button
      @click="$emit('reservar')"
      class="w-full flex justify-center items-center gap-3 bg-gradient-to-r from-[#00B4D8] to-[#06D6A0] text-[#0D1B2A] px-6 py-3 rounded-xl text-xl font-bold shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all"
    >
      <font-awesome-icon icon="calendar-check" class="text-xl" />
      Reservar Ahora
    </button>
  </section>
</template>


<script setup>
import MenuDropdown from "../layout/MenuDropdown.vue";
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
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
  "update:tipoVehiculo",
  "update:tipoPlazoReserva",
  "update:tiempoInicial",
  "update:tiempoFinal",
  "reservar"
]);

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

// Helpers
function parseTimeString(timeStr) {
  if (!timeStr) return undefined;
  const [hours, minutes] = timeStr.split(":").map(Number);
  return { hours, minutes };
}

function formatHour(date) {
  return date.toTimeString().slice(0, 5);
}

function getMinDate() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (props.availability.dateRange && props.availability.dateRange?.[0]) {
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
