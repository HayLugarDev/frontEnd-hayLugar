<template>
    <div class="flex flex-col max-w-xl mx-auto p-8 gap-8 md:min-h-[80vh] animate-fade-in">

        <!-- Título -->
        <div class="text-center space-y-2">
            <h1 class="text-primary text-3xl sm:text-4xl font-extrabold">
                ¿Qué tipo de espacio vas a ofrecer?
            </h1>

            <p class="text-gray-300 text-sm sm:text-base">
                Elegí la opción que mejor describa el lugar donde se guardarán los vehículos.
            </p>
        </div>

        <!-- Opciones -->
        <div class="space-y-4">
            <FormOption v-model="type" value="garage" title="Casa o inmueble propio"
                text="Garage de una casa, vivienda o departamento particular." icon="home" />

            <FormOption v-model="type" value="large_space" title="Espacio grande"
                text="Terreno, lote o espacio abierto privado." icon="warehouse" />

            <FormOption v-model="type" value="private_parking" title="Estacionamiento o guardería"
                text="Playa o predio destinado a guardar vehículos." icon="square-parking" />
        </div>

        <!-- Botón continuar -->
        <div class="mt-auto flex justify-end">
            <button @click="type ? $emit('next') : (showErrorModal = true)" class="w-full md:w-auto bg-primary text-white font-bold py-3 px-10 rounded-xl
               shadow-lg hover:bg-primary/90 active:scale-95 transition-all">
                Continuar ➜
            </button>
        </div>

        <!-- Modal error -->
        <StatusModal :visible="showErrorModal" type="error" title="Debes seleccionar una opción"
            message="Por favor, elegí una opción para continuar." :icon="logo" @confirm="showErrorModal = false" />
    </div>
</template>

<script setup>
import FormOption from '../../forms/FormOption.vue';
import StatusModal from "../addSpacePage/StatusModal.vue";
import logo from '../../../assets/logo.png';
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
