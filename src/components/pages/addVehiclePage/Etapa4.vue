<template>
    <div class="flex flex-col md:w-1/2 mx-auto p-6 gap-2">
        <div v-if="showSummary" class="mt-8 space-y-6">
            <h2 class="text-xl font-bold">Resumen antes de guardar</h2>

            <ul class="space-y-2">
                <li><strong>Tipo de vehículo:</strong> {{ modelValue.type }}</li>
                <li><strong>Marca:</strong> {{ modelValue.brand }}</li>
                <li><strong>Modelo:</strong> {{ modelValue.model }}</li>
                <li><strong>Color:</strong> {{ modelValue.color }}</li>
                <li><strong>Patente:</strong> {{ modelValue.type !== 'bicycle' ? modelValue.license_plate : 'No aplica' }}</li>
            </ul>

            <div class="flex gap-4 mt-6">
                <button type="button" @click="submitForm" class="bg-green-600 text-white px-4 py-2 rounded-lg">Confirmar y
                    Guardar</button>
                <button @click="showSummary = false" class="bg-gray-300 px-4 py-2 rounded-lg">Volver a editar</button>
            </div>
        </div>
        <div v-else>
            <h1 class="text-4xl font-semibold mb-8">¿Cuál es la patente de tu vehículo?</h1>
    
            <!-- Patente del vehículo -->
                <div>
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
                <button @click="nextStep" class="px-4 py-2 border-2 rounded-xl hover:border-gray-900">
                    Siguiente
                </button>
            </div>
        </div>

        <!-- Modal de error -->
        <StatusModal :visible="showErrorModal" type="error" title="¡Atención!"
            message="Por favor, selecciona al menos un método de pago y completá los datos requeridos."
            icon="/src/assets/logo.png" @close="showErrorModal = false" />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import StatusModal from '../addSpacePage/StatusModal.vue';

const showSummary = ref(false);
const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue', 'next', 'prev']);

const showErrorModal = ref(false);

const submitForm = () => {
  emit('submit');
};

</script>

<style scoped>
.input-field {
    @apply w-full mt-2 p-2 border border-gray-300 rounded;
}
</style>
