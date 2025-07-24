<template>
    <div class="flex flex-col md:w-1/2 mx-auto p-6 gap-2">
        <h1 class="text-4xl font-semibold mb-8">¿Dónde está ubicado tu espacio?</h1>

        <!-- Ubicación con Autocomplete -->
        <div class="">
            <label class="block text-sm font-semibold text-gray-900">Calle</label>
            <GMapAutocomplete class="input-field" @place_changed="handlePlaceChanged"
                placeholder="Ingresá tu dirección" />
        </div>

        <!-- Detalles de dirección -->
        <div v-if="location">
            <label class="block text-sm font-semibold text-gray-900">Referencias adicionales</label>
            <input type="text" v-model="locationDetails"
                class="text-gray-500 mt-1 block w-full border border-gray-900 rounded-md p-4"
                placeholder="Ej: Edificio A, Planta Baja, 3er piso, subsuelo, etc." />
        </div>

        <!-- Botones de navegación -->
        <div class="flex justify-between space-x-4">
            <button @click="emit('prev')" class="px-4 py-2 border-2 rounded-xl hover:border-gray-900">
                Anterior
            </button>
            <button @click="nextStep" class="px-4 py-2 border-2 rounded-xl hover:border-gray-900">
                Siguiente
            </button>
        </div>

        <!-- Modal de error -->
        <StatusModal :visible="showErrorModal" type="error" title="Dirección faltante"
            message="Por favor, seleccioná una dirección antes de continuar." icon="/src/assets/logo.png"
            @close="showErrorModal = false" />
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import StatusModal from '../addSpacePage/StatusModal.vue';

const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue', 'next', 'prev']);

const showErrorModal = ref(false);

const handlePlaceChanged = (place) => {
    const components = place.address_components || [];

    const streetNumber = components.find(c => c.types.includes('street_number'))?.long_name || '';
    const route = components.find(c => c.types.includes('route'))?.long_name || '';
    const locality = components.find(c => c.types.includes('locality') || c.types.includes('sublocality'))?.long_name || '';
    const province = components.find(c => c.types.includes('administrative_area_level_1'))?.long_name || '';
    const country = components.find(c => c.types.includes('country'))?.long_name || '';

    const street = [route, streetNumber].filter(Boolean).join(' ');
    const parts = [street, locality, province, country].filter(Boolean);

    props.modelValue.location = parts.join(', ');
    props.modelValue.latitude = place.geometry.location.lat();
    props.modelValue.longitude = place.geometry.location.lng();
};

const nextStep = () => {
    // if (!props.modelValue.location) {
    //     showErrorModal.value = true;
    //     return;
    // }
    emit('next');
};

const locationDetails = computed({
    get: () => props.modelValue.locationDetails,
    set: (val) => emit('update:modelValue', { ...props.modelValue, locationDetails: val })
});

</script>

<style scoped>
.input-field {
    @apply w-full p-6 border border-gray-300 rounded-full text-2xl text-gray-700;
}
</style>
