<template>
    <div class="flex flex-col md:w-1/2 mx-auto p-6 gap-2">
        <h1 class="text-4xl font-semibold mb-8">Qué tipo de espacio vas a ofrecer como estacionamiento?</h1>

        <FormOption v-model="type" value="garage" title="Casa o inmueble propio"
            text="Es el garage de una casa, vivienda, departamento o similar." />
        <FormOption v-model="type" value="large_space" title="Espacio grande"
            text="Puede ser un terreno, lote, o espacio abierto privado." />
        <FormOption v-model="type" value="private_parking" title="Estacionamiento o guardería"
            text="Espacio amplio y construido específicamente para el guardado de vehículos." />

        <!-- Botones de navegación -->
        <div class="flex justify-end mt-6 space-x-4">
            <button @click="type ? $emit('next') : (showErrorModal = true)"
                class="px-4 py-2 border-2 rounded-xl hover:border-gray-900">
                Siguiente
            </button>
        </div>
        <StatusModal :visible="showErrorModal" type="error" title="¡Atención!"
            message="Por favor, selecciona una opción antes de continuar." icon="/src/assets/logo.png"
            @close="showErrorModal = false" />
    </div>
</template>

<script setup>
import FormOption from './FormOption.vue';
import StatusModal from "../components/StatusModal.vue";
import { computed, ref } from 'vue';

const showErrorModal = ref(false);
const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue', 'next', 'prev']);

const type = computed({
    get: () => props.modelValue.type,
    set: (val) => emit('update:modelValue', { ...props.modelValue, type: val })
});
</script>

<style scoped>
.input-field {
    @apply w-full mt-2 p-2 border border-gray-300 rounded;
}
</style>
