<template>
  <div
    class="flex flex-col max-w-3xl mx-auto p-6 sm:p-10 gap-10 md:min-h-[80vh] animate-fade-in"
  >
    <!-- Título -->
    <div class="text-center space-y-2">
      <h1 class="text-primary text-3xl sm:text-4xl font-bold">
        Completá los detalles de tu espacio
      </h1>
      <p class="text-gray-300 max-w-lg mx-auto">
        Ingresá toda la información para que tus clientes conozcan tu espacio antes de reservar.
      </p>
    </div>

    <!-- FORM -->
    <div class="space-y-10">

      <!-- 📌 Información Básica -->
      <section class="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5 shadow-lg">
        <h2 class="text-lg font-semibold text-primary flex items-center gap-2">
          <i class="i-lucide-info text-primary"></i> Información básica
        </h2>

        <!-- Nombre -->
        <div>
          <label class="block text-sm font-medium text-gray-200 mb-2">
            Nombre del espacio
          </label>
          <input
            v-model="name"
            type="text"
            placeholder="Ej: Estacionamiento privado en Palermo"
            class="input-primary"
          />
        </div>

        <!-- Tipo de espacio -->
        <div>
          <label class="block text-sm font-medium text-gray-200 mb-2">
            Tipo de espacio
          </label>
          <select v-model="parking_type" class="input-primary bg-gray-900 text-gray-600">
            <option value="">Selecciona una opción</option>
            <option value="cubierto">Cubierto</option>
            <option value="descubierto">Descubierto</option>
          </select>
        </div>

        <!-- Descripción -->
        <div>
          <label class="block text-sm font-medium text-gray-200 mb-2">
            Descripción
          </label>
          <textarea
            v-model="description"
            rows="4"
            placeholder="Escribe una descripción detallada del espacio..."
            class="input-primary"
          ></textarea>
        </div>
      </section>

      <!-- 💰 Tipo de plazo -->
      <section class="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 shadow-lg">
        <h2 class="text-lg font-semibold text-primary flex items-center gap-2">
          <i class="i-lucide-calendar-range"></i> Tipo de plazo ofrecido
        </h2>

        <div
          class="flex items-center justify-between gap-2 bg-white/10 rounded-2xl p-1 border border-white/10 text-gray-200"
        >
          <label
            v-for="unit in priceUnits"
            :key="unit.value"
            class="flex-1 cursor-pointer"
          >
            <input
              type="radio"
              name="reservation_period"
              class="hidden peer"
              :value="unit.value"
              v-model="reservation_period"
              @change="updateAvailabilityFields"
            />

            <div
              class="text-center px-4 py-2 rounded-xl font-semibold text-sm transition-all 
                peer-checked:bg-primary peer-checked:text-white hover:bg-primary/20"
            >
              {{ unit.label }}
            </div>
          </label>
        </div>
      </section>

      <!-- ⏰ Disponibilidad por hora -->
      <section
        v-if="price_unit === 'hour'"
        class="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg space-y-4"
      >
        <h2 class="text-lg font-semibold text-primary flex items-center gap-2">
          <i class="i-lucide-clock"></i> Horario de disponibilidad
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm text-gray-200 mb-1">Desde:</label>
            <DatePicker
              v-model:value="availabilityStartRaw"
              type="time"
              format="HH:mm"
              class="datepicker-primary"
            />
          </div>
          <div>
            <label class="block text-sm text-gray-200 mb-1">Hasta:</label>
            <DatePicker
              v-model:value="availabilityEndRaw"
              type="time"
              format="HH:mm"
              class="datepicker-primary"
            />
          </div>
        </div>
      </section>

      <!-- 📅 Días disponibles -->
      <section class="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg space-y-4">
        <h2 class="text-lg font-semibold text-primary flex items-center gap-2">
          <i class="i-lucide-calendar-days"></i> Días disponibles
        </h2>

        <label class="flex items-center gap-2">
          <input
            type="checkbox"
            v-model="allDaysSelected"
            @change="handleAllDaysChange"
            class="accent-primary"
            :disabled="price_unit !== 'hour'"
          />
          <span class="text-gray-200 font-medium">Todos los días</span>
        </label>

        <div
          v-if="price_unit === 'hour'"
          class="grid grid-cols-2 sm:grid-cols-3 gap-2"
        >
          <label
            v-for="day in daysOfWeek"
            :key="day.value"
            class="flex items-center gap-2"
          >
            <input
              type="checkbox"
              class="accent-primary"
              :value="day.value"
              v-model="availabilityDays"
              @change="handleSpecificDaysChange"
            />
            <span class="text-gray-300">{{ day.label }}</span>
          </label>
        </div>
      </section>

      <!-- 📌 Resumen -->
      <section
        v-if="price_unit"
        class="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg"
      >
        <h3 class="text-lg font-semibold text-gray-200 mb-3 flex items-center gap-2">
          <i class="i-lucide-list-checks text-primary"></i> Resumen de disponibilidad
        </h3>

        <div class="text-gray-300 space-y-1 text-sm leading-relaxed">
          <div
            v-if="reservation_period === 'hour' && availabilityStartRaw && availabilityEndRaw"
          >
            <p>
              <span class="font-medium text-white">Días disponibles:</span>
              {{ selectedDaysLabels || "Todos los días" }}
            </p>
            <p>
              <span class="font-medium text-white">Horario:</span>
              {{ formatDate(availabilityStartRaw, "time") }} –
              {{ formatDate(availabilityEndRaw, "time") }}
            </p>
          </div>

          <div
            v-else-if="
              reservation_period === 'day' ||
              reservation_period === 'week' ||
              reservation_period === 'month'
            "
          >
            <p>
              <span class="font-medium text-white">Días disponibles:</span> Todos
              los días
            </p>
          </div>

          <p v-else class="text-red-400 font-medium">
            Aún no has seleccionado horarios o días.
          </p>
        </div>
      </section>

      <!-- 🖼️ Imágenes -->
      <section class="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg space-y-3">
        <h2 class="text-lg font-semibold text-primary flex items-center gap-2">
          <i class="i-lucide-images"></i> Imágenes del espacio
        </h2>

        <p class="text-gray-300 text-sm">
          Debes subir al menos <strong>2 imágenes</strong> del espacio.
        </p>

        <input
          type="file"
          multiple
          accept="image/*"
          @change="handleFileUpload"
          class="input-primary cursor-pointer"
        />

        <div class="mt-3 flex flex-wrap gap-3">
          <img
            v-for="(img, index) in previewImages"
            :key="index"
            :src="img"
            class="w-24 h-24 object-cover rounded-xl shadow-md ring-1 ring-gray-200"
          />
        </div>
      </section>
    </div>

    <!-- Botones -->
    <div class="flex justify-between mt-4">
      <button class="btn-secondary" @click="emit('prev')">Anterior</button>
      <button class="btn-primary" @click="handleNext">Siguiente ➜</button>
    </div>

    <!-- Modal error -->
    <StatusModal
      :visible="showErrorModal"
      type="error"
      :message="errorMessage"
      title="¡Atención!"
      :icon="logo"
      @confirm="showErrorModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import StatusModal from "../addSpacePage/StatusModal.vue";
import { computed, ref, watch } from 'vue';
import DatePicker from 'vue-datepicker-next';
import 'vue-datepicker-next/index.css';
import { getAllDays, WeekDay } from "../../../utils/daysTraslation";
import { formatDate } from "../../../utils/FormatDate";
import logo from "../../../assets/logo.png";

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

  if (selectedFiles.value.length < 2) {
    errorMessage.value = "Debes cargar al menos 2 imágenes de tu espacio antes de continuar.";
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

/* INPUTS */
.input-primary {
  @apply w-full bg-white/10 border border-white/10 rounded-xl p-4 
         text-gray-200 focus:ring-2 focus:ring-primary focus:outline-none transition;
}

/* DATE PICKER BASE */
.datepicker-primary {
  @apply w-full rounded-xl border border-white/10 text-gray-200 p-2 
         focus:ring-2 focus:ring-primary bg-white/10;
}

/* BUTTONS */
.btn-primary {
  @apply px-8 py-3 bg-primary text-white rounded-full font-bold 
         shadow-md hover:bg-primary/90 active:scale-95 transition-all;
}
.btn-secondary {
  @apply px-6 py-3 border-2 border-primary text-primary rounded-full font-semibold
         hover:bg-primary hover:text-white transition;
}

</style>
