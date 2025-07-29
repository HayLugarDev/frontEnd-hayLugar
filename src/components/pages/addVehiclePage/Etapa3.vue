<template>
    <div class="flex flex-col md:w-1/2 mx-auto p-6 gap-2">
        <div v-if="showSummary" class="mt-2 xl:mt-6 space-y-6">
            <h2 class="text-2xl font-bold">Resumen antes de guardar</h2>

            <ul class="space-y-2 text-2xl">
                <li><strong>Tipo de vehículo:</strong> {{ vehicleLabel(modelValue.type) }}</li>
                <li><strong>Marca:</strong> {{ modelValue.brand }}</li>
                <li><strong>Modelo:</strong> {{ modelValue.model }}</li>
                <li><strong>Color:</strong> {{ modelValue.color }}</li>
                <li><strong>Patente:</strong>
                    {{ modelValue.type !== 'bicycle' ? modelValue.license_plate : 'No aplica' }}
                </li>
            </ul>

            <div class="flex gap-4 mt-6">
                <button type="button" @click="submitForm" class="bg-green-600 text-white px-4 py-2 rounded-lg">Confirmar
                    y
                    Guardar</button>
                <button @click="showSummary = false" class="bg-gray-300 px-4 py-2 rounded-lg">Volver a editar</button>
            </div>
        </div>
        <!-- SOLO si el tipo de vehículo no es bicicleta -->
        <div v-else-if="modelValue.type !== 'bicycle'">
            <h1 class="text-4xl font-semibold mb-8">¿Cuál es la patente de tu vehículo?</h1>

            <!-- Patente del vehículo -->
            <div class="mb-4">
                <label class="block text-sm font-semibold text-gray-900">Ingresá un dominio válido</label>
                <input type="text" v-model="license_plate"
                    class="text-gray-500 mt-1 block w-full border border-gray-900 rounded-md p-4"
                    placeholder="Ej: AB-123-CD" />
            </div>

            <!-- Botones de navegación -->
            <div class="flex justify-between space-x-4">
                <button @click="emit('prev')" class="px-4 py-2 border-2 rounded-xl hover:border-gray-900">
                    Anterior
                </button>
                <button @click="validateAndContinue" class="px-4 py-2 border-2 rounded-xl hover:border-gray-900">
                    Siguiente
                </button>
            </div>
        </div>

        <!-- Si es bicicleta y no se muestra aún el resumen, mostrar directamente el botón -->
        <div v-else>
            <h1 class="text-4xl font-semibold mb-8">¿Listo para guardar tu bicicleta?</h1>

            <div class="flex justify-between space-x-4">
                <button @click="emit('prev')" class="px-4 py-2 border-2 rounded-xl hover:border-gray-900">
                    Anterior
                </button>
                <button @click="validateAndContinue" class="px-4 py-2 border-2 rounded-xl hover:border-gray-900">
                    Siguiente
                </button>
            </div>
        </div>


        <!-- Modal de error -->
        <StatusModal :visible="showErrorModal" type="error" title="Patente faltante"
            message="Por favor, ingresá una patente válida antes de continuar." icon="/src/assets/logo.png"
            @close="showErrorModal = false" />
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
