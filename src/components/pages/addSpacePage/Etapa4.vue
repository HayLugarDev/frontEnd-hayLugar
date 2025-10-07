<template>
  <div class="flex flex-col md:w-1/2 mx-auto p-6 gap-2">
    <h1 class="text-primary text-4xl font-semibold mb-8">Completá los detalles de tu espacio</h1>

    <div class="space-y-6 font-normal">
      <!-- Nombre del espacio -->
      <div>
        <label class="block text-sm font-semibold text-gray-900">Nombre del espacio</label>
        <input type="text" v-model="name" class="text-gray-500 mt-1 block w-full border border-gray-900 rounded-md p-4"
          placeholder="Ej: Estacionamiento privado en Palermo" />
      </div>

      <!-- Tipo de parking -->
      <div>
        <label class="block text-sm font-semibold text-gray-900">Tipo de estacionamiento</label>
        <select v-model="parking_type" class="text-gray-500 mt-1 block w-full border border-gray-900 rounded-md p-4">
          <option value="">Selecciona una opción</option>
          <option value="cubierto">Cubierto</option>
          <option value="descubierto">Descubierto</option>
        </select>
      </div>

      <!-- Descripción -->
      <div>
        <label class="block text-sm font-semibold text-gray-900">Descripción</label>
        <textarea v-model="description" class="text-gray-500 mt-1 block w-full border border-gray-900 rounded-md p-4"
          rows="4" placeholder="Escribe una descripción detallada del espacio..."></textarea>
      </div>

      <!-- Tipo de plazo -->
      <div>
        <label class="block text-sm font-semibold text-gray-900 mb-2">Tipo de Plazo ofrecido</label>
        <div class="flex gap-2">
          <button v-for="unit in priceUnits" :key="unit.value"
            @click="price_unit = unit.value; updateAvailabilityFields()" class="px-4 py-2 rounded-lg border"
            :class="price_unit === unit.value ? 'bg-primary text-white' : 'bg-gray-100'">
            {{ unit.label }}
          </button>
        </div>
      </div>

      <!-- Horario de disponibilidad -->
      <fieldset v-if="price_unit === 'hour'" class="border p-4 rounded-lg">
        <legend class="text-lg font-semibold text-black">Horario de Disponibilidad</legend>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block mb-1">Desde:</label>
            <DatePicker v-model:value="availabilityStart" type="time" format="HH:mm" placeholder="Hora inicio"
              class="input-field" />
          </div>
          <div>
            <label class="block mb-1">Hasta:</label>
            <DatePicker v-model:value="availabilityEnd" type="time" format="HH:mm" placeholder="Hora fin"
              class="input-field" />
          </div>
        </div>
      </fieldset>

      <!-- Período (semana o mes) -->
      <div v-if="price_unit === 'week' || price_unit === 'month'" class="mt-4">
        <fieldset class="border p-4 rounded-lg">
          <legend class="text-lg font-semibold text-black">Selecciona un período</legend>
          <!--<DatePicker v-model:value="availabilityDateRange" type="daterange" format="YYYY-MM-DD"
            placeholder="Selecciona una fecha de inicio" class="w-full" />-->

            <DatePicker
            v-model:value="availabilityDateRange"
            type="date"
            :range="true"
            format="YYYY-MM-DD"
            placeholder="Selecciona una fecha de inicio"
            class="w-full"
            />
        </fieldset>
      </div>

      <!-- Días disponibles -->
      <div class="mt-4">
        <fieldset class="border p-4 rounded-lg">
          <legend class="text-lg font-semibold text-black">Días disponibles</legend>
          <p class="text-xs text-gray-500 mb-2">
            Seleccioná los días en los que tu espacio está disponible, o marcá <b>Todos los días</b>.
            Debes elegir al menos una opción para continuar.
          </p>

          <!-- Opción "Todos los días" -->
          <div class="mb-2">
            <label class="flex items-center gap-2">
              <input type="checkbox" v-model="allDaysSelected" @change="handleAllDaysChange"
                class="h-4 w-4 text-primary" />
              <span><b>Todos los días</b></span>
            </label>
          </div>

          <!-- Días individuales -->
          <div class="grid grid-cols-2 gap-2 md:grid-cols-3">
            <label v-for="day in daysOfWeek" :key="day.value" class="flex items-center gap-2">
              <input type="checkbox" :value="day.value" v-model="availabilityDays" :disabled="allDaysSelected"
                @change="handleSpecificDaysChange" class="h-4 w-4 text-primary" />
              <span>{{ day.label }}</span>
            </label>
          </div>
        </fieldset>
      </div>

      <!-- Mensaje dinámico -->
      <div v-if="price_unit" :class="['alert', price_unit === 'hour' ? 'alert-info' : 'alert-warning']">
        <p v-html="currentMessage"></p>
      </div>

      <!-- Resumen -->
      <div v-if="price_unit" class="mt-6 p-4 border rounded-lg bg-gray-50 text-sm">
        <p><strong>Resumen:</strong></p>
        <p>Disponible desde {{ formatDate(availabilityStart) }}</p>
        <p>Hasta {{ formatDate(availabilityEnd) }}</p>
        <p v-if="price_unit === 'day'">Días: {{ selectedDaysLabels }}</p>
        <p v-if="price_unit === 'week' || price_unit === 'month'">
          Periodo: {{ availabilityDateRange }}
        </p>
      </div>

      <!-- Imágenes -->
      <div>
        <p class="text-gray-700 mb-6 text-sm">
          <strong>Atención:</strong> Debes subir al menos 5 imágenes...
        </p>
        <input type="file" multiple accept="image/*" @change="handleFileUpload"
          class="text-gray-500 mt-1 block w-full border border-gray-900 rounded-md p-4" />
        <div class="mt-3 flex flex-wrap gap-3">
          <img v-for="(img, index) in previewImages" :key="index" :src="img"
            class="w-24 h-24 object-cover rounded-lg shadow-md ring-1 ring-gray-200" />
        </div>
      </div>
    </div>

    <!-- Botones -->
    <div class="flex justify-between mt-6 space-x-4">
      <button @click="emit('prev')" class="px-4 py-2 border-2 rounded-xl hover:border-gray-900">
        Anterior
      </button>

      <button @click="handleNext"
        class="px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition duration-300">
        Siguiente
      </button>
    </div>

    <!-- Modal de error -->
    <StatusModal :visible="showErrorModal" type="error" title="¡Atención!" :message="errorMessage"
      icon="/src/assets/logo.png" @confirm="showErrorModal = false" />
  </div>
</template>

<script setup lang="ts">
import StatusModal from "../addSpacePage/StatusModal.vue";
import { computed, ref } from 'vue';
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
const price_unit = ref<'hour' | 'day' | 'week' | 'month'>('hour');
const daysOfWeek = getAllDays();
const allDaysSelected = ref(false);

// 👉 Opciones de plazo
const priceUnits = [
  { value: "hour", label: "Por Hora" },
  { value: "day", label: "Por Día" },
  { value: "week", label: "Por Semana" },
  { value: "month", label: "Por Mes" },
] as const;

// 👉 Mensajes informativos según el plazo seleccionado
const availabilityMessages: Record<string, string> = {
  hour: `⏱️ <strong>Por Hora:</strong> La reserva se calcula por <strong>cantidad de horas</strong> 
         dentro del rango horario que definas como disponible. 
         El usuario podrá elegir inicio y fin solo en el mismo día. 
         <br/><br/>🔑 Recordá aclarar los <strong>horarios en los que podrás recibir a los clientes</strong> 
         para realizar <em>check-in</em> y <em>check-out</em>.`,

  day: `📅 <strong>Por Día:</strong> Cada reserva abarca <strong>24 horas exactas</strong> 
        desde el momento en que comienza, aplicando únicamente en los días y horarios que configures. 
        <br/><br/>🔑 Es importante que indiques los <strong>horarios disponibles para recibir a los clientes</strong> 
        y coordinar el <em>check-in</em> y <em>check-out</em>.`,

  week: `🗓️ <strong>Por Semana:</strong> El período contempla <strong>7 días consecutivos</strong> 
         desde la fecha de inicio. El sistema validará que la disponibilidad abarque la semana completa. 
         <br/><br/>🔑 No olvides detallar los <strong>horarios en los que atenderás a los clientes</strong> 
         para facilitar el <em>check-in</em> y <em>check-out</em>.`,

  month: `📆 <strong>Por Mes:</strong> Cada reserva corresponde a un período de <strong>30 días corridos</strong> 
          desde la fecha de inicio, siempre que el espacio esté disponible durante todo el mes seleccionado. 
          <br/><br/>🔑 Asegurate de indicar claramente los <strong>horarios en los que recibirás a los clientes</strong> 
          para realizar el <em>check-in</em> y <em>check-out</em>.`
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

  if (!availabilityStart.value || !availabilityEnd.value) {
    errorMessage.value = "Debes definir un horario de disponibilidad (inicio y fin).";
    showErrorModal.value = true;
    return;
  }

  if (!allDaysSelected.value && availabilityDays.value.length === 0) {
  errorMessage.value = "Debes seleccionar al menos un día o marcar 'Todos los días'.";
  showErrorModal.value = true;
  return;
}

  if ((price_unit.value === "week" || price_unit.value === "month") && !availabilityDateRange.value) {
    errorMessage.value = "Debes seleccionar un rango de fechas de disponibilidad.";
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
  props.modelValue.availability = { start: '', end: '', dateRange: [] };
};

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

// 👉 Aquí conectamos los días seleccionados
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

const availabilityDateRange = computed({
  get: () => props.modelValue.availability?.dateRange || null,
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
