<template>
    <div class="flex flex-col md:w-1/2 mx-auto p-6 gap-2">
        <h1 class="text-primary text-4xl font-semibold mb-8">Completá los detalles de tu espacio</h1>

        <div class="space-y-6 font-normal">
            <!-- Nombre del espacio -->
            <div>
                <label class="block text-sm font-semibold text-gray-900">Nombre del espacio</label>
                <input type="text" v-model="name"
                    class="text-gray-500 mt-1 block w-full border border-gray-900 rounded-md p-4"
                    placeholder="Ej: Estacionamiento privado en Palermo" />
            </div>

            <!-- Tipo de parking -->
            <div>
                <label class="block text-sm font-semibold text-gray-900">Tipo de estacionamiento</label>
                <select v-model="parking_type"
                    class="text-gray-500 mt-1 block w-full border border-gray-900 rounded-md p-4">
                    <option value="">Selecciona una opción</option>
                    <option value="cubierto">Cubierto</option>
                    <option value="descubierto">Descubierto</option>
                </select>
            </div>

            <!-- Descripción -->
            <div>
                <label class="block text-sm font-semibold text-gray-900">Descripción</label>
                <textarea v-model="description"
                    class="text-gray-500 mt-1 block w-full border border-gray-900 rounded-md p-4" rows="4"
                    placeholder="Escribe una descripción detallada del espacio..."></textarea>
            </div>

            <!-- Plazos -->
            <div>
                <label class="block text-sm font-semibold text-gray-900">Tipo de estacionamiento</label>
                <select v-model="price_unit" @change="updateAvailabilityFields"
                    class="text-gray-500 mt-1 block w-full border border-gray-900 rounded-md p-4">
                    <option value="">Selecciona una opción</option>
                    <option value="hour">Por Hora</option>
                    <option value="day">Por Día</option>
                    <option value="week">Por Semana</option>
                    <option value="month">Por Mes</option>
                </select>
            </div>

            <!-- Días de la semana -->
            <fieldset class="border p-4 rounded-lg">
                <legend class="text-lg font-semibold text-black">Días de disponibilidad</legend>
                <div class="grid grid-cols-2 gap-2 md:grid-cols-3">
                    <label v-for="day in daysOfWeek" :key="day.value" class="flex items-center gap-2">
                        <input type="checkbox" :value="day.value" v-model="availabilityDays"
                            class="h-4 w-4 text-primary border-gray-300 rounded" />
                        <span>{{ day.label }}</span>
                    </label>
                </div>
            </fieldset>


            <!-- Por hora -->
            <fieldset v-if="price_unit === 'hour'" class="border p-4 rounded-lg">
                <legend class="text-lg font-semibold text-black">Horario de Disponibilidad</legend>
                <div class="grid grid-cols-2 gap-4">
                    <label>
                        <span>Desde:</span>
                        <input v-model="availabilityStart" type="time" class="input-field" required />
                    </label>
                    <label>
                        <span>Hasta:</span>
                        <input v-model="availabilityEnd" type="time" class="input-field" required />
                    </label>
                </div>
            </fieldset>

            <!-- Por semana o mes -->
            <fieldset v-if="price_unit === 'week' || price_unit === 'month'" class="border p-4 rounded-lg">
                <legend class="text-lg font-semibold text-black">Selecciona un período</legend>
                <VueDatePicker v-model="availabilityDateRange" range class="input-field" />
            </fieldset>

            <!-- Imágenes -->
            <div>
                <p class="text-gray-700 mb-6 text-sm">
                    <strong>Atención:</strong> Debes subir al menos 5 imágenes que muestren claramente tu espacio.
                    Incluye fotos del
                    frente, el interior, el acceso y cualquier detalle relevante para que los usuarios puedan ubicarlo y
                    estacionar sin inconvenientes.
                </p>
                <input type="file" multiple accept="image/*" @change="handleFileUpload"
                    class="text-gray-500 mt-1 block w-full border border-gray-900 rounded-md p-4" />
                <div class="mt-3 flex flex-wrap gap-3">
                    <img v-for="(img, index) in previewImages" :key="index" :src="img"
                        class="w-24 h-24 object-cover rounded-lg shadow-md ring-1 ring-gray-200" />
                </div>
            </div>
        </div>

        <!-- Botones de navegación -->
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
            icon="/src/assets/logo.png" @close="showErrorModal = false" />

    </div>
</template>

<script setup lang="ts">
import StatusModal from "../addSpacePage/StatusModal.vue";
import { computed, ref } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import { getAllDays, WeekDay } from "../../../utils/daysTraslation";

const errorMessage = ref("");
const showErrorModal = ref(false);

const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue', 'next', 'prev']);

const selectedFiles = ref([]);
const previewImages = ref([]);
const price_unit = ref('hour');
const daysOfWeek = getAllDays();

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

</script>

<style scoped>
.input-field {
    @apply w-full mt-2 p-2 border border-gray-300 rounded;
}
</style>
