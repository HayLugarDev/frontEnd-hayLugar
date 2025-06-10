<template>
    <div class="flex flex-col w-1/2 mx-auto p-4 gap-2">
        <h1 class="text-4xl font-semibold mb-8">Completá los detalles de tu espacio</h1>

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
                <label class="block text-sm font-semibold text-gray-900">Cargar imágenes</label>
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
            <button @click="emit('prev')" class="px-4 py-2 border-2 rounded-xl hover:border-gray-900">Anterior</button>
            <button @click="name && parking_type && description ? $emit('next') : (showErrorModal = true)"
                class="px-4 py-2 border-2 rounded-xl hover:border-gray-900">
                Siguiente
            </button>
        </div>
        <StatusModal :visible="showErrorModal" type="error" title="¡Atención!"
            message="Por favor, completá todos los campos antes de continuar." icon="/src/assets/logo.png"
            @close="showErrorModal = false" />
    </div>
</template>

<script setup>
import StatusModal from "../components/StatusModal.vue";
import { computed, ref } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';

const showErrorModal = ref(false);
const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue', 'next', 'prev']);
const selectedFiles = ref([]);
const previewImages = ref([]);
const price_unit = ref('hour');

const handleFileUpload = (event) => {
    selectedFiles.value = [...event.target.files];

    const filesArray = Array.from(event.target.files);
    emit('update:modelValue', { ...props.modelValue, images: filesArray });

    const fileReaders = filesArray.map(file => {
        return new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(file);
        });
    });

    Promise.all(fileReaders).then(results => {
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
