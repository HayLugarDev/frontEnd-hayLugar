<template>
  <div
    class="flex flex-col max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-8 gap-6 min-h-[80vh] animate-fade-in">
    <!-- Título -->
    <h1 class="text-primary text-3xl sm:text-4xl font-bold text-center mb-4">
      Completá los detalles de tu espacio
    </h1>

    <p class="text-gray-500 text-center mb-6">
      Ingresá toda la información para que tus clientes tengan claro tu espacio.
    </p>

    <div class="space-y-6 font-normal">

      <!-- Nombre del espacio -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">Nombre del espacio</label>
        <input type="text" v-model="name" placeholder="Ej: Estacionamiento privado en Palermo"
          class="w-full border border-gray-300 rounded-xl p-4 text-gray-900 focus:ring-2 focus:ring-primary focus:outline-none transition" />
      </div>

      <!-- Tipo de parking -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">Tipo de estacionamiento</label>
        <select v-model="parking_type"
          class="w-full border border-gray-300 rounded-xl p-4 text-gray-900 focus:ring-2 focus:ring-primary focus:outline-none transition">
          <option value="">Selecciona una opción</option>
          <option value="cubierto">Cubierto</option>
          <option value="descubierto">Descubierto</option>
        </select>
      </div>

      <!-- Descripción -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
        <textarea v-model="description" rows="4" placeholder="Escribe una descripción detallada del espacio..."
          class="w-full border border-gray-300 rounded-xl p-4 text-gray-900 focus:ring-2 focus:ring-primary focus:outline-none transition"></textarea>
      </div>

      <!-- Tipo de plazo -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          Tipo de plazo ofrecido
        </label>

        <div
          class="flex items-center justify-between gap-2 bg-gray-50 rounded-2xl p-1 border border-gray-200 shadow-sm">
          <label v-for="unit in priceUnits" :key="unit.value" class="flex-1 cursor-pointer">
            <input type="radio" name="reservation_period" class="hidden peer" :value="unit.value"
              v-model="reservation_period" @change="updateAvailabilityFields" />

            <div class="text-center px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 
               peer-checked:bg-primary peer-checked:text-white 
               peer-checked:shadow-md text-gray-700 hover:bg-gray-100">
              {{ unit.label }}
            </div>
          </label>
        </div>
      </div>


      <!-- Horario de disponibilidad -->
      <fieldset v-if="price_unit === 'hour'" class="border border-gray-200 p-4 rounded-2xl">
        <legend class="text-lg font-semibold text-gray-800">Horario de Disponibilidad</legend>
        <div class="grid grid-cols-2 gap-4 mt-2">
          <div>
            <label class="block text-sm mb-1">Desde:</label>
            <DatePicker v-model:value="availabilityStartRaw" type="time" format="HH:mm" placeholder="Hora inicio"
              class="w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-primary transition" />
          </div>
          <div>
            <label class="block text-sm mb-1">Hasta:</label>
            <DatePicker v-model:value="availabilityEndRaw" type="time" format="HH:mm" placeholder="Hora fin"
              class="w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-primary transition" />
          </div>
        </div>
      </fieldset>

      <!-- Días disponibles -->
      <div class="mt-4">
        <fieldset class="border border-gray-200 p-4 rounded-2xl">
          <legend class="text-lg font-semibold text-gray-800">Días disponibles</legend>
          <p class="text-xs text-gray-500 mb-2">
            Seleccioná los días disponibles o marcá <b>Todos los días</b>.
          </p>
          <div class="mb-2">
            <label class="flex items-center gap-2">
              <input type="checkbox" v-model="allDaysSelected" @change="handleAllDaysChange"
                :disabled="price_unit !== 'hour'" class="h-4 w-4 text-primary" />
              <span><b>Todos los días</b></span>
            </label>
          </div>
          <div v-if="price_unit === 'hour'" class="grid grid-cols-2 gap-2 md:grid-cols-3">
            <label v-for="day in daysOfWeek" :key="day.value" class="flex items-center gap-2">
              <input type="checkbox" :value="day.value" v-model="availabilityDays" @change="handleSpecificDaysChange"
                class="h-4 w-4 text-primary" />
              <span>{{ day.label }}</span>
            </label>
          </div>
        </fieldset>
      </div>

      <div v-if="price_unit" :class="[
        'p-4 rounded-xl text-sm',
        price_unit === 'hour' ? 'bg-blue-50 text-blue-700' : 'bg-yellow-50 text-yellow-700'
      ]">
        <p v-html="currentMessage"></p>
      </div>

      <!-- Resumen -->
      <div v-if="price_unit" class="mt-6 p-5 bg-white rounded-2xl shadow-sm border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span class="inline-block w-2 h-2 bg-primary rounded-full"></span>
          Resumen de disponibilidad
        </h3>

        <div class="space-y-1 text-gray-700 text-sm leading-relaxed">
          <div v-if="reservation_period === 'hour' && availabilityStartRaw && availabilityEndRaw">
            <p><span class="font-medium">Días disponible para reservar:</span> {{ selectedDaysLabels ?
              selectedDaysLabels : 'Todos los días' }}</p>
            <p>
              <span class="font-medium">Franja horaria disponible:</span>
              {{ formatDate(availabilityStartRaw, 'time') }} – {{ formatDate(availabilityEndRaw, 'time') }}
            </p>
          </div>

          <div v-else-if="reservation_period === 'day' || reservation_period === 'week' || reservation_period === 'month'">
            <p><span class="font-medium">Días disponible para reservar:</span> Todos los días</p>
          </div>

          <div v-else class="text-red-600 font-medium">
            Aún no has seleccionado días u horarios de disponibilidad.
          </div>
        </div>
      </div>

      <!-- Imágenes -->
      <div>
        <p class="text-gray-500 mb-4 text-sm">
          <strong>Atención:</strong> Debes subir al menos 5 imágenes de tu espacio.
        </p>
        <input type="file" multiple accept="image/*" @change="handleFileUpload"
          class="w-full border border-gray-300 rounded-xl p-4 text-gray-900 focus:ring-2 focus:ring-primary transition" />
        <div class="mt-3 flex flex-wrap gap-3">
          <img v-for="(img, index) in previewImages" :key="index" :src="img"
            class="w-24 h-24 object-cover rounded-xl shadow-md ring-1 ring-gray-200" />
        </div>
      </div>
    </div>

    <!-- Botones -->
    <div class="flex justify-between mt-6 space-x-4">
      <button @click="emit('prev')"
        class="px-6 py-2 border-2 border-primary text-primary rounded-full font-semibold hover:bg-primary hover:text-white transition">
        Anterior
      </button>
      <button @click="handleNext"
        class="px-8 py-2 bg-primary text-white rounded-full font-bold shadow-md hover:bg-primary/90 active:scale-95 transition-all">
        Siguiente ➜
      </button>
    </div>

    <!-- Modal de error -->
    <StatusModal :visible="showErrorModal" type="error" title="¡Atención!" :message="errorMessage"
      icon="/src/assets/logo.png" @confirm="showErrorModal = false" />
  </div>

</template>

<script setup lang="ts">
import StatusModal from "../addSpacePage/StatusModal.vue";
import { computed, ref, watch } from 'vue';
import DatePicker from 'vue-datepicker-next';
import 'vue-datepicker-next/index.css';
import { getAllDays, WeekDay } from "../../../utils/daysTraslation";
import { formatDate } from "../../../utils/FormatDate";

const errorMessage = ref("");
const showErrorModal = ref(false);

const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue', 'next', 'prev']);

const selectedFiles = ref([]);
const previewImages = ref([]);

const price_unit = computed({
  get: () => props.modelValue.reservation_period || 'hour',
  set: (val) => {
    emit('update:modelValue', {
      ...props.modelValue,
      reservation_period: val
    });
  }
});

const daysOfWeek = getAllDays();
const allDaysSelected = ref(false);

const availabilityStartRaw = ref<Date | null>(null);
const availabilityEndRaw = ref<Date | null>(null);

// 👉 Opciones de plazo
const priceUnits = [
  { value: "hour", label: "Por Hora" },
  { value: "day", label: "Por Día" },
  { value: "week", label: "Por Semana" },
  { value: "month", label: "Por Mes" },
] as const;

// 👉 Mensajes informativos según el plazo seleccionado
const availabilityMessages: Record<string, string> = {
  hour: `
    ⏱️ <strong>Reservas por hora</strong><br/>
    El usuario podrá alquilar tu espacio por <strong>cantidad de horas</strong> dentro del horario que definas como disponible.
    <br/><br/>
    📍 Podrá elegir hora de inicio y fin, siempre <strong>dentro del mismo día</strong>.
    <br/><br/>
    💡 <strong>Consejo:</strong> Indicá claramente en qué horarios estarás disponible para recibir al cliente y facilitar el <em>check-in</em> y <em>check-out</em>.
  `,

  day: `
    📅 <strong>Reservas por día</strong><br/>
    El usuario podrá seleccionar un <strong>rango de fechas</strong>, eligiendo un día de inicio y uno de finalización.
    <br/><br/>
    📍 Cada día reservado equivale a <strong>24 horas</strong>. 
    <br/>El rango puede ser desde <strong>1 hasta 30 días consecutivos</strong>, siempre que tu espacio esté disponible.
    <br/><br/>
    🔑 <strong>Importante:</strong> El usuario debe poder ingresar y salir libremente durante el período reservado.
  `,

  week: `
    🗓️ <strong>Reservas por semana</strong><br/>
    El usuario podrá alquilar tu espacio por <strong>períodos de 7 días consecutivos</strong>, a partir de la fecha de inicio seleccionada.
    <br/><br/>
    📍 El sistema verificará que la disponibilidad cubra la semana completa.
    <br/><br/>
    🔑 <strong>Importante:</strong> Asegurate de que el usuario pueda ingresar y salir libremente durante toda la semana reservada.
  `,

  month: `
    📆 <strong>Reservas por mes</strong><br/>
    Cada reserva corresponde a un período de <strong>30 días corridos</strong> desde la fecha de inicio seleccionada.
    <br/><br/>
    📍 El sistema verificará que el espacio esté disponible durante todo el mes.
    <br/><br/>
    🔑 <strong>Importante:</strong> El usuario debe poder ingresar y salir libremente durante el mes de la reserva.
  `
};

// 👉 Computed para el mensaje dinámico según el plazo seleccionado
const currentMessage = computed(() => {
  return availabilityMessages[price_unit.value] || "";
});

// 👉 Computed para mostrar los días seleccionados como etiquetas
const selectedDaysLabels = computed(() => {
  return availabilityDays.value
    .map(dayValue => {
      const found = daysOfWeek.find(d => d.value === dayValue);
      return found ? found.label : dayValue;
    })
    .join(', ');
});

// computed para conectar TimeRangePicker
// const availability = computed({
//     get: () => props.modelValue.availability || { start: '', end: '' },
//     set: (val: { start: string; end: string }) => {
//         emit('update:modelValue', { ...props.modelValue, availability: val });
//     },
// });

const handleAllDaysChange = () => {
  if (allDaysSelected.value) {
    // Si se marca "Todos los días", vaciamos los días individuales
    availabilityDays.value = [];
  }
};

// Si el usuario marca días individuales, se desmarca "Todos los días"
const handleSpecificDaysChange = () => {
  if (availabilityDays.value.length > 0) {
    allDaysSelected.value = false;
  }
};

const handleNext = () => {
  if (!name.value || !parking_type.value || !description.value) {
    errorMessage.value = "Por favor, completá todos los campos antes de continuar.";
    showErrorModal.value = true;
    return;
  }

  if (selectedFiles.value.length < 5) {
    errorMessage.value = "Debes cargar al menos 5 imágenes de tu espacio antes de continuar.";
    showErrorModal.value = true;
    return;
  }

  if ((!availabilityStartRaw.value || !availabilityEndRaw.value) && reservation_period.value === "hour") {
    errorMessage.value = "Debes definir un horario de disponibilidad (inicio y fin).";
    showErrorModal.value = true;
    return;
  }

  if (!allDaysSelected.value && availabilityDays.value.length === 0) {
    errorMessage.value = "Debes seleccionar al menos un día o marcar 'Todos los días'.";
    showErrorModal.value = true;
    return;
  }

  emit("next"); // pasa a la siguiente etapa
};

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files) return;

  const filesArray = Array.from(input.files);
  selectedFiles.value = filesArray;

  emit("update:modelValue", { ...props.modelValue, images: filesArray });

  const fileReaders = filesArray.map(
    (file) =>
      new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      })
  );
  Promise.all(fileReaders).then((results) => {
    previewImages.value = results;
  });
};

const updateAvailabilityFields = () => {
  emit('update:modelValue', {
    ...props.modelValue,
    availability: { start: '', end: '', dateRange: [] }
  });
};

const reservation_period = computed({
  get: () => props.modelValue.reservation_period,
  set: (val) => emit('update:modelValue', { ...props.modelValue, reservation_period: val })
});

const name = computed({
  get: () => props.modelValue.name,
  set: (val) => emit('update:modelValue', { ...props.modelValue, name: val })
});
const parking_type = computed({
  get: () => props.modelValue.parking_type,
  set: (val) => emit('update:modelValue', { ...props.modelValue, parking_type: val })
});
const description = computed({
  get: () => props.modelValue.description,
  set: (val) => emit('update:modelValue', { ...props.modelValue, description: val })
});

const availabilityStart = computed({
  get: () => props.modelValue.availability?.start || '',
  set: (val) => {
    emit('update:modelValue', {
      ...props.modelValue,
      availability: {
        ...props.modelValue.availability,
        start: val,
      },
    });
  },
});

const availabilityEnd = computed({
  get: () => props.modelValue.availability?.end || '',
  set: (val) => {
    emit('update:modelValue', {
      ...props.modelValue,
      availability: {
        ...props.modelValue.availability,
        end: val,
      },
    });
  },
});

// Lógica para sincronizar DatePicker -> HH:mm
watch(availabilityStartRaw, (val) => {
  if (!val) return;
  const h = val.getHours().toString().padStart(2, '0');
  const m = val.getMinutes().toString().padStart(2, '0');
  availabilityStart.value = `${h}:${m}`;
});

watch(availabilityEndRaw, (val) => {
  if (!val) return;
  const h = val.getHours().toString().padStart(2, '0');
  const m = val.getMinutes().toString().padStart(2, '0');
  availabilityEnd.value = `${h}:${m}`;
});


const availabilityDays = computed<WeekDay[]>({
  get: () => props.modelValue.availability?.days || [],
  set: (val) => {
    emit("update:modelValue", {
      ...props.modelValue,
      availability: {
        ...props.modelValue.availability,
        days: val,
      },
    });
  },
});

watch(price_unit, (newUnit) => {

  // Ajustes para disponibilidad de días
  if (newUnit !== 'hour') {
    allDaysSelected.value = true;
    availabilityDays.value = [];
  } else {
    allDaysSelected.value = false;
  }
}, { immediate: true });

watch(
  () => [availabilityDays.value, price_unit.value],
  ([newDays, unit]) => {
    // Si es por hora, todos los días bloqueados
    if (unit === "hour") {
      if (newDays.length > 0) {
        allDaysSelected.value = false;
      }
      if (newDays.length === 0) {
        allDaysSelected.value = true;
      }
      return;
    }
  },
  { immediate: true }
);


const availabilityDateRange = computed({
  get: () => props.modelValue.availability?.dateRange || [],
  set: (val) => {
    emit('update:modelValue', {
      ...props.modelValue,
      availability: {
        ...props.modelValue.availability,
        dateRange: val,
      },
    });
  },
});

const availabilityTimeRange = computed({
  get: () => {
    const start = props.modelValue.availability?.start;
    const end = props.modelValue.availability?.end;
    return start && end ? [start, end] : [];
  },
  set: (val: string[]) => {
    emit('update:modelValue', {
      ...props.modelValue,
      availability: {
        ...props.modelValue.availability,
        start: val[0] || '',
        end: val[1] || '',
      },
    });
  },
});

</script>

<style scoped>
.input-field {
  @apply w-full mt-2 p-2 border border-gray-300 rounded;
}

.alert {
  @apply mt-4 p-4 border-l-4 rounded text-sm;
}

.alert-info {
  @apply border-blue-400 text-blue-800 bg-blue-50;
}

.alert-warning {
  @apply border-yellow-500 text-yellow-800 bg-yellow-50;
}
</style>
