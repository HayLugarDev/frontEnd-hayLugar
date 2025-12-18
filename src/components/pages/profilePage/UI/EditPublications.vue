<template>
  <transition name="fade">
    <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div
        class="bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] w-full max-w-3xl rounded-2xl shadow-xl p-8 relative overflow-y-auto max-h-[90vh]">

        <!-- Botón cerrar -->
        <button @click="close" class="absolute top-4 right-4 text-gray-400 hover:text-white">✖</button>

        <!-- Encabezado -->
        <h2 class="text-3xl font-bold text-primary mb-6">Editá tu espacio</h2>

        <!-- Formulario básico -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField v-model="formData.name" label="Nombre del espacio" type="text" required />
          <FormFieldAutocomplete v-model="formData.location" label="Ubicación" class="md:col-span-2" />
          <FormField v-model="formData.type" label="Tipo de espacio" type="text" required />
          <FormField v-model="formData.parking_type" label="Tipo de estacionamiento" type="text" required />
          <FormField v-model="formData.description" label="Descripción" type="textarea" class="md:col-span-2" />
        </div>

        <!-- Tipo de plazo -->
        <div class="mt-6">
          <label class="block text-sm font-semibold text-gray-200 mb-2">Tipo de plazo ofrecido</label>
          <div
            class="flex items-center justify-between gap-2 bg-white/10 border-white/10 rounded-2xl p-1 border border-gray-200 shadow-sm">
            <label v-for="unit in priceUnits" :key="unit.value" class="flex-1 cursor-pointer">
              <input type="radio" name="reservation_period" class="hidden peer" :value="unit.value"
                v-model="formData.reservation_period" @change="updateAvailabilityFields" />
              <div class="text-center px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200
                          peer-checked:bg-primary peer-checked:text-white
                          peer-checked:shadow-md text-gray-200 hover:bg-primary/50">
                {{ unit.label }}
              </div>
            </label>
          </div>
        </div>

        <!-- Horario de disponibilidad -->
        <fieldset v-if="formData.reservation_period === 'hour'" class="border border-gray-200 p-4 rounded-2xl mt-4">
          <legend class="text-lg font-semibold text-gray-200">Horario de Disponibilidad</legend>
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
        <div v-if="formData.reservation_period === 'hour'" class="mt-4">
          <fieldset class="border border-gray-200 p-4 rounded-2xl">
            <legend class="text-lg font-semibold text-gray-800">Días disponibles</legend>
            <div class="mb-2">
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="allDaysSelected" @change="handleAllDaysChange"
                  class="h-4 w-4 text-primary" />
                <span><b>Todos los días</b></span>
              </label>
            </div>
            <div class="grid grid-cols-2 gap-2 md:grid-cols-3">
              <label v-for="day in daysOfWeek" :key="day.value" class="flex items-center gap-2">
                <input type="checkbox" :value="day.value" v-model="availabilityDays" @change="handleSpecificDaysChange"
                  class="h-4 w-4 text-primary" />
                <span>{{ day.label }}</span>
              </label>
            </div>
          </fieldset>
        </div>

        <!-- Mensaje informativo -->
        <div v-if="formData.reservation_period"
          class="mt-4 p-4 rounded-xl text-sm bg-white/10 border-white/10 text-newgreen" v-html="currentMessage">
        </div>

        <!-- Vehículos aceptados -->
        <div class="mt-6">
          <h3 class="text-xl font-semibold text-primary mb-4">Vehículos aceptados</h3>
          <div class="flex flex-col gap-3">
            <VehicleFormOption v-for="type in vehicleTypes" :key="type.value" :value="type.value" :title="type.title"
              :text="type.description" :configured="!!vehicleMap[type.value]" :configuration="vehicleMap[type.value]"
              @configure="openConfig(type.value)" @save="saveConfiguration" />
          </div>
          <VehicleModal v-if="selectedType" :type="selectedType" :existing="vehicleMap[selectedType]"
            @save="saveConfiguration" @close="selectedType = null" />
        </div>

        <!-- Imágenes -->
        <div class="mt-6">
          <h3 class="text-xl font-semibold text-primary mb-2">Modificar imágenes actuales</h3>
          <input type="file" multiple @change="onFileChange" class="border-2 shadow-xl rounded-full p-2" />
          <div class="flex gap-2 mt-2 flex-wrap">
            <div v-for="(img, i) in previewImages" :key="i" class="relative">
              <img :src="img.src" class="w-24 h-24 rounded-lg object-cover" />

              <button @click="removeImage(i)"
                class="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 text-xs">
                ✖
              </button>
            </div>

          </div>
        </div>

        <!-- Botones -->
        <div class="mt-8 flex justify-end gap-4">
          <button @click="close" class="px-6 py-3 bg-newgreen/20 hover:bg-newgreen/30 rounded-lg">Cancelar</button>
          <button @click="guardarCambios" class="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700">Guardar
            Cambios</button>
        </div>

      </div>
    </div>
  </transition>

  <!-- Modales -->
  <StatusModal :visible="showErrorModal" type="error" title="¡Atención!" :message="errorMessage" :icon="logo"
    @confirm="showErrorModal = false" />
  <StatusModal :visible="showSuccessModal" title="¡Éxito!" :message="successMessage" :icon="logo"
    @confirm="closeSuccess" />
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import api from '../../../../services/apiService';
import FormField from '../../../forms/FormField.vue';
import FormFieldAutocomplete from '../../../forms/FormFieldAutocomplete.vue';
import VehicleFormOption from '../../../forms/VehicleFormOption.vue';
import VehicleModal from '../../addSpacePage/VehicleModal.vue';
import StatusModal from '../../addSpacePage/StatusModal.vue';
import DatePicker from 'vue-datepicker-next';
import 'vue-datepicker-next/index.css';
import { getAllDays } from '../../../../utils/daysTraslation';
import { useSpaceStore } from '../../../../store/spaceStore';
import logo from "../../../../assets/logo.png";

// Props y eventos
const props = defineProps<{ visible: boolean, spaceId: number | null }>();
const emit = defineEmits(['close', 'updated']);

const spaceStore = useSpaceStore();


// Formulario
const formData = ref<any>({
  name: '',
  location: '',
  type: '',
  parking_type: '',
  description: '',
  reservation_period: 'hour',
  availability: { start: '', end: '', days: [] },
  vehicle_capacities: [],
  images: []
});

const existingImages = ref<string[]>([]);
const newImages = ref<File[]>([]);
const removedImages = ref<string[]>([]);
const previewImages = ref<{ src: string; isNew: boolean }[]>([]);

const selectedType = ref<string | null>(null);
const showSuccessModal = ref(false);
const showErrorModal = ref(false);
const errorMessage = ref('');

// Tipos de vehículos
const vehicleTypes = [
  { value: 'van', title: 'Camioneta', description: 'Espacio mín. 2.5 x 4 m.' },
  { value: 'car', title: 'Automóvil', description: 'Espacio mín. 2.2 x 3.2 m.' },
  { value: 'motorcycle', title: 'Motocicleta', description: 'Espacio mín. 1 x 1.8 m.' },
  { value: 'bicycle', title: 'Bicicleta / Monopatín', description: 'Espacio seguro para almacenarlas.' }
];

const vehicleMap = ref<Record<string, any>>({});
const successMessage = ref('');

// Disponibilidad
const daysOfWeek = getAllDays();
const allDaysSelected = ref(false);
const availabilityStartRaw = ref<Date | null>(null);
const availabilityEndRaw = ref<Date | null>(null);

const availabilityDays = computed({
  get: () => formData.value.availability?.days || [],
  set: (val) => formData.value.availability.days = val
});

allDaysSelected.value = !formData.value.availability.days.length || formData.value.availability.days.length === daysOfWeek.length;

// Plazos
const priceUnits = [
  { value: "hour", label: "Por Hora" },
  { value: "day", label: "Por Día" },
  { value: "week", label: "Por Semana" },
  { value: "month", label: "Por Mes" }
];

// Mensaje según plazo
const availabilityMessages: Record<string, string> = {
  hour: `⏱️ <strong>Reservas por hora</strong><br/>El usuario podrá alquilar tu espacio por <strong>horas</strong>.`,
  day: `📅 <strong>Reservas por día</strong><br/>El usuario seleccionará días completos.`,
  week: `🗓️ <strong>Reservas por semana</strong><br/>Se reservarán períodos de 7 días consecutivos.`,
  month: `📆 <strong>Reservas por mes</strong><br/>Cada reserva corresponde a 30 días.`
};
const currentMessage = computed(() => availabilityMessages[formData.value.reservation_period] || "");


onMounted(() => {
  existingImages.value = [...(formData.value.images || [])];
  newImages.value = [];
  removedImages.value = [];

  previewImages.value = existingImages.value.map(url => ({
    src: url,
    isNew: false
  }));

})
// Funciones vehículos
function openConfig(type: string) { selectedType.value = type; }

function saveConfiguration(data: any) {
  vehicleMap.value[data.type] = data;
  formData.value.vehicle_capacities = Object.values(vehicleMap.value);
  selectedType.value = null;
}

// Funciones disponibilidad
const handleAllDaysChange = () => {
  if (allDaysSelected.value) {
    availabilityDays.value = []; // Todos los días -> vacíos individualmente
  } else {
    // Si se desmarca "Todos los días", forzamos al menos un día por defecto
    if (availabilityDays.value.length === 0) availabilityDays.value = [daysOfWeek[0].value];
  }
};

const handleSpecificDaysChange = () => { if (availabilityDays.value.length > 0) allDaysSelected.value = false; };
const updateAvailabilityFields = () => { formData.value.availability.start = ''; formData.value.availability.end = ''; };

// Watchers
watch(() => props.visible, async (val) => {
  if (val && props.spaceId) {
    try {
      const res = await api.get(`/spaces/getbyid/${props.spaceId}`);
      formData.value = res.data;

      if (typeof formData.value.availability === 'string') {
        formData.value.availability = JSON.parse(formData.value.availability);
      } else if (!formData.value.availability) {
        formData.value.availability = { start: '', end: '', days: [] };
      }

      vehicleMap.value = {};
      (res.data.vehicle_capacities || []).forEach((v: any) => {
        vehicleMap.value[v.type] = v;
      });

      existingImages.value = [...(formData.value.images || [])];
      newImages.value = [];

      previewImages.value = existingImages.value.map(url => ({
        src: url,
        isNew: false
      }));


      availabilityStartRaw.value = formData.value.availability?.start
        ? new Date(`1970-01-01T${formData.value.availability.start}:00`)
        : null;

      availabilityEndRaw.value = formData.value.availability?.end
        ? new Date(`1970-01-01T${formData.value.availability.end}:00`)
        : null;

      allDaysSelected.value =
        formData.value.availability?.days?.length === 0;
    } catch (e) {
      console.error(e);
    }
  }
});


watch(availabilityStartRaw, (val) => {
  if (val instanceof Date && !isNaN(val.getTime())) {
    formData.value.availability.start = `${val.getHours().toString().padStart(2, '0')}:${val.getMinutes().toString().padStart(2, '0')}`;
  } else {
    formData.value.availability.start = '';
  }
});

watch(availabilityEndRaw, (val) => {
  if (val instanceof Date && !isNaN(val.getTime())) {
    formData.value.availability.end = `${val.getHours().toString().padStart(2, '0')}:${val.getMinutes().toString().padStart(2, '0')}`;
  } else {
    formData.value.availability.end = '';
  }
});

watch(availabilityDays, (val) => {
  allDaysSelected.value = val.length === 0 || val.length === daysOfWeek.length;
}, { immediate: true });


// Imágenes
const onFileChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files;
  if (!files) return;

  const selected = Array.from(files);

  selected.forEach(file => {
    newImages.value.push(file);
    previewImages.value.push({
      src: URL.createObjectURL(file),
      isNew: true
    });
  });
};

const removeImage = (index: number) => {
  const img = previewImages.value[index];

  // Imagen existente
  if (!img.isNew) {
    removedImages.value.push(img.src);
    existingImages.value = existingImages.value.filter(i => i !== img.src);
  }

  // Imagen nueva
  if (img.isNew) {
    newImages.value.splice(
      newImages.value.findIndex(f => URL.createObjectURL(f) === img.src),
      1
    );
  }

  previewImages.value.splice(index, 1);
};

// Guardar cambios con validaciones
const guardarCambios = async () => {

  const total = existingImages.value.length + newImages.value.length;
  if (total < 2) {
    errorMessage.value = 'Debes tener al menos 2 imágenes.';
    showErrorModal.value = true;
    return;
  }

  const form = new FormData();

  // datos normales
  Object.entries(formData.value).forEach(([key, value]) => {
    if (key !== 'images') {
      form.append(
        key,
        typeof value === 'object' ? JSON.stringify(value) : String(value)
      );
    }
  });

  // imágenes
  form.append('existingImages', JSON.stringify(existingImages.value));
  form.append('removedImages', JSON.stringify(removedImages.value));

  // orden final
  const ordered = previewImages.value.map(i => i.src);
  form.append('orderedImages', JSON.stringify(ordered));

  // nuevas
  newImages.value.forEach(img => form.append('images', img));

  if (!formData.value.name || !formData.value.parking_type || !formData.value.description) {
    errorMessage.value = "Por favor, completá todos los campos requeridos.";
    showErrorModal.value = true; return;
  }

  if (formData.value.reservation_period === 'hour') {
    if (!formData.value.availability.start || !formData.value.availability.end) {
      errorMessage.value = "Debes definir horario de disponibilidad (inicio y fin)."; showErrorModal.value = true; return;
    }
    if (!allDaysSelected.value && availabilityDays.value.length === 0) {
      errorMessage.value = "Debes seleccionar al menos un día de disponibilidad."; showErrorModal.value = true; return;
    }
  }
  console.log(formData.value);
  try {
    const response = await api.put(
      `/spaces/update/${props.spaceId}`,
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    successMessage.value = response.data.message || "Cambios guardados con éxito.";
    showSuccessModal.value = true;
  } catch (err) {
    errorMessage.value = "Ocurrió un error al guardar.";
    showErrorModal.value = true;
    console.error(err);
  }
};

const close = () => emit('close');
const closeSuccess = async () => {
  showSuccessModal.value = false;
  emit('updated', formData.value);
  close();
};
</script>
