<template>
    <div class="flex flex-col md:w-3/4 mx-auto gap-2">
        <div v-if="showSummary"
            class="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 max-w-xl mx-auto animate-fade-in">
            <h2 class="text-2xl font-bold text-primary text-center mb-6">
                Resumen antes de guardar
            </h2>

            <div class="space-y-4">
                <div v-for="(item, index) in [
                    { label: 'Tipo de vehículo', value: modelValue.type },
                    { label: 'Marca', value: modelValue.brand },
                    { label: 'Modelo', value: modelValue.model },
                    { label: 'Color', value: modelValue.color },
                    { label: 'Patente', value: modelValue.type !== 'bicycle' ? modelValue.license_plate : 'No aplica' }
                ]" :key="index"
                    class="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-5 py-3 hover:bg-gray-100 transition-all">
                    <span class="text-gray-500 font-medium">{{ item.label }}</span>
                    <span class="text-gray-800 font-semibold">{{ item.value || '—' }}</span>
                </div>
            </div>

            <div class="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                <button type="button" @click="submitForm"
                    class="bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors">
                    Guardar vehículo
                </button>
                <button @click="showSummary = false"
                    class="border border-gray-300 text-gray-700 font-medium px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors">
                    Volver a editar
                </button>
            </div>
        </div>
        <!-- SOLO si el tipo de vehículo no es bicicleta -->
        <div v-else-if="modelValue.type !== 'bicycle'"
            class="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 max-w-xl mx-auto animate-fade-in">

            <h1 class="text-3xl sm:text-4xl font-bold text-primary mb-6 text-center">
                ¿Cuál es la patente de tu vehículo?
            </h1>

            <!-- Patente del vehículo -->
            <div class="mb-8">
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Ingresá un dominio válido sin símbolos
                </label>
                <input type="text" v-model="license_plate" placeholder="Ej: AB123CD"
                    class="w-full border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/30 rounded-xl p-4 text-gray-800 placeholder-gray-400 transition-all outline-none" />
            </div>

            <!-- Botones de navegación -->
            <div class="flex justify-between gap-4">
                <button @click="emit('prev')"
                    class="w-1/2 border border-gray-300 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-100 transition-all">
                    ⬅ Anterior
                </button>
                <button @click="validateAndContinue"
                    class="w-1/2 bg-primary text-white font-semibold py-3 rounded-xl hover:bg-primary/90 transition-all">
                    Siguiente ➜
                </button>
            </div>
        </div>

        <!-- Si es bicicleta -->
        <div v-else class="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 max-w-xl mx-auto animate-fade-in">

            <h1 class="text-3xl sm:text-4xl font-bold text-primary mb-8 text-center">
                ¿Listo para guardar tu bicicleta?
            </h1>

            <div class="flex justify-between gap-4">
                <button @click="emit('prev')"
                    class="w-1/2 border border-gray-300 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-100 transition-all">
                    ⬅ Anterior
                </button>
                <button @click="validateAndContinue"
                    class="w-1/2 bg-primary text-white font-semibold py-3 rounded-xl hover:bg-primary/90 transition-all">
                    Guardar 🚲
                </button>
            </div>
        </div>

        <!-- Modal de error -->
        <StatusModal :visible="showErrorModal" type="error" title="Patente faltante"
            message="Por favor, ingresá una patente válida antes de continuar." icon="/src/assets/logo.png"
            @confirm="showErrorModal = false" />
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import StatusModal from '../addSpacePage/StatusModal.vue';
import vehicleLabel from '../../../logic/useVehicleLabel';

const showSummary = ref(false);
const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue', 'next', 'prev']);

const showErrorModal = ref(false);

const submitForm = () => {
    emit('submit');
};
const license_plate = computed({
    get: () => props.modelValue.license_plate,
    set: (val) => emit('update:modelValue', { ...props.modelValue, license_plate: val })
});

// Validación y navegación
const validateAndContinue = () => {
    if (props.modelValue.type === 'bicycle') {
        props.modelValue.license_plate = null;
        showSummary.value = true;
        return;
    }

    if (!license_plate.value) {
        showErrorModal.value = true;
        return;
    }

    showSummary.value = true;
};

watch(
    () => props.modelValue.type,
    (newType) => {
        if (newType === 'bicycle') {
            showSummary.value = true;
        }
    },
    { immediate: true }
);

</script>

<style scoped>
.input-field {
    @apply w-full p-6 border border-gray-300 rounded-full text-2xl text-gray-700;
}
</style>
