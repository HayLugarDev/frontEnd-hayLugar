<template>
    <div class="flex flex-col md:w-1/2 mx-auto p-6 gap-2">
        <div v-if="showSummary" class="mt-8 space-y-6">
            <h2 class="text-xl font-bold">Resumen antes de publicar</h2>

            <ul class="space-y-2">
                <li><strong>Nombre:</strong> {{ modelValue.name }}</li>
                <li><strong>Tipo de espacio:</strong> {{ modelValue.parking_type }}</li>
                <li><strong>Descripción:</strong> {{ modelValue.description }}</li>
                <li><strong>Métodos de pago:</strong> {{ modelValue.paymentMethods.join(', ') }}</li>
                <li v-if="paymentMethods.includes('Mercado Pago')">
                    <strong>Email de wallet:</strong> {{ modelValue.walletDetails.mpEmail }}
                </li>
                <li><strong>Publicar:</strong> {{ modelValue.status === 'active' ? 'Sí' : 'No' }}</li>
                <li><strong>Imágenes:</strong> {{ modelValue.images.length }} archivo(s) cargado(s)</li>
            </ul>

            <div class="flex gap-4 mt-6">
                <button type="button" @click="submitForm" class="bg-green-600 text-white px-4 py-2 rounded-lg">Confirmar y
                    Publicar</button>
                <button @click="showSummary = false" class="bg-gray-300 px-4 py-2 rounded-lg">Volver a editar</button>
            </div>
        </div>

        <div v-else>

            <h1 class="text-4xl font-semibold mb-8">Confirmá los datos para recibir los pagos</h1>
    
            <div class="space-y-6 font-normal">
                <!-- Métodos de Pago Aceptados -->
                <fieldset class="border p-4 rounded-lg shadow-sm">
                    <legend class="text-lg font-semibold text-gray-800 mb-2">Métodos de Pago Aceptados</legend>
                    <div class="grid grid-cols-2 gap-3">
                        <label class="flex items-center gap-2">
                            <input type="checkbox" v-model="paymentMethods" value="Efectivo" class="accent-green-600" />
                            <font-awesome-icon :icon="['fas', 'money-bill-wave']" class="text-green-600" />
                            <span class="text-gray-700">Efectivo</span>
                        </label>
                        <label class="flex items-center gap-2">
                            <input type="checkbox" v-model="paymentMethods" value="Mercado Pago"
                                class="accent-indigo-600" />
                            <font-awesome-icon :icon="['fas', 'credit-card']" class="text-indigo-600" />
                            <span class="text-gray-700">Mercado Pago</span>
                        </label>
                    </div>
                </fieldset>
    
                <!-- Datos de Wallet para Mercado Pago -->
                <fieldset v-if="paymentMethods.includes('Mercado Pago')" class="border p-4 rounded-lg">
                    <legend class="text-lg font-semibold text-black">Datos de Wallet (Mercado Pago)</legend>
                    <label class="block">
                        <span class="text-sm font-semibold text-gray-900">Correo de Mercado Pago:</span>
                        <input v-model="walletEmail" type="email" class="input-field" placeholder="correo@ejemplo.com" />
                    </label>
                </fieldset>
            </div>
    
            <!-- Botones de navegación -->
            <div class="flex justify-between mt-6 space-x-4">
                <button @click="emit('prev')" class="px-4 py-2 border-2 rounded-xl hover:border-gray-900">
                    Anterior
                </button>
                <button @click="validateAndContinue"
                    class="text-white px-4 py-2 border-2 rounded-xl hover:border-gray-900 bg-primary">
                    Publicar
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
import StatusModal from '../components/StatusModal.vue';

const showSummary = ref(false);
const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue', 'next', 'prev']);

const showErrorModal = ref(false);

// Computed bindings con actualización del modelValue principal
const paymentMethods = computed({
    get: () => props.modelValue.paymentMethods || [],
    set: (val) =>
        emit('update:modelValue', { ...props.modelValue, paymentMethods: val }),
});

const walletEmail = computed({
    get: () => props.modelValue.walletDetails?.mpEmail || '',
    set: (val) =>
        emit('update:modelValue', {
            ...props.modelValue,
            walletDetails: {
                ...props.modelValue.walletDetails,
                mpEmail: val,
            },
        }),
});

// Validación y navegación
const validateAndContinue = () => {
    if (
        paymentMethods.value.length === 0 ||
        (paymentMethods.value.includes('Mercado Pago') && !walletEmail.value)
    ) {
        showErrorModal.value = true;
        return;
    }

    showSummary.value = true;
};

const submitForm = () => {
  emit('submit');
};

</script>

<style scoped>
.input-field {
    @apply w-full mt-2 p-2 border border-gray-300 rounded;
}
</style>
