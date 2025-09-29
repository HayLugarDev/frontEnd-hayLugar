<template>
    <div class="flex flex-col md:w-2/3 lg:w-1/2 mx-auto p-6 gap-6">
        <div class="bg-white shadow-lg rounded-2xl p-6 space-y-6 border">
            <h2 class="text-2xl font-bold text-primary text-center">
                🚗 Resumen antes de publicar
            </h2>

            <ul class="space-y-4 text-gray-700">
                <li class="flex items-center gap-2">
                    <span class="font-semibold">📍 Nombre:</span> {{ modelValue.name }}
                </li>
                <li class="flex items-center gap-2">
                    <span class="font-semibold">🏷️ Tipo de espacio:</span> {{ modelValue.parking_type }}
                </li>
                <li class="flex items-center gap-2">
                    <span class="font-semibold">📝 Descripción:</span> {{ modelValue.description }}
                </li>
                <li class="flex items-center gap-2">
                    <span class="font-semibold">💳 Métodos de pago:</span>
                    {{ modelValue.paymentMethods.join(", ") }}
                </li>
                <!-- <li v-if="paymentMethods.includes('Mercado Pago')" class="flex items-center gap-2">
                    <span class="font-semibold">📧 Email de wallet:</span> {{ modelValue.walletDetails.mpEmail }}
                </li> -->
                <li class="flex items-center gap-2">
                    <span class="font-semibold">📢 Publicar:</span>
                    <span
                        :class="modelValue.status === 'active' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'">
                        {{ modelValue.status === "active" ? "Sí" : "No" }}
                    </span>
                </li>
                <li>
                    <span class="font-semibold">🖼️ Imágenes cargadas:</span>
                    <div class="flex flex-wrap gap-2 mt-2">
                        <img v-for="(img, index) in modelValue.images" :key="index"
                            :src="typeof img === 'string' ?? img"
                            class="w-20 h-20 object-cover rounded-lg shadow border" />
                    </div>
                </li>
            </ul>

            <!-- Acciones -->
            <div class="flex flex-col md:flex-row gap-4 justify-between mt-8">
                <button @click="emit('prev')"
                    class="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold shadow hover:bg-gray-300 transition">
                    ✏️ Volver a editar
                </button>
                <button type="button" @click="submitForm"
                    class="flex-1 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold shadow hover:bg-green-700 transition">
                    <img v-if="cargando" :src="loadIcon" alt="Cargando" class="w-6 h-6" />
                    <span class="text-white" v-else>Confirmar y Publicar</span>
                </button>
            </div>
        </div>
    </div>
</template>


<script setup>
import { ref } from 'vue';
import loadIcon from '../../../assets/load-icon_secondary.svg';

const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue', 'next', 'prev']);

const cargando = ref(false);

const submitForm = () => {
    emit('submit');
};
</script>

<style scoped>
.input-field {
    @apply w-full mt-2 p-2 border border-gray-300 rounded;
}
</style>
