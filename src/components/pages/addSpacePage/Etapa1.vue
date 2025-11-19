<template>
    <div
        class="flex flex-col max-w-xl mx-auto bg-white h-screen rounded-2xl shadow-lg border border-gray-100 p-8 gap-6 min-h-[80vh] animate-fade-in">

        <!-- Título -->
        <h1 class="text-primary text-xl sm:text-4xl font-bold text-center mb-4">
            ¿Qué tipo de espacio vas a ofrecer como estacionamiento?
        </h1>

        <p class="text-gray-500 text-center sm:mb-6 text-xs sm:text-base">
            Elegí la opción que mejor describa el lugar donde los vehículos se van a guardar.
        </p>

        <!-- Opciones -->
        <div class="space-y-4">
            <FormOption v-model="type" value="garage" title="Casa o inmueble propio"
                text="Garage de una casa, vivienda o departamento particular." icon="home" />
            <FormOption v-model="type" value="large_space" title="Espacio grande"
                text="Terreno, lote o espacio abierto privado." icon="warehouse" />
            <FormOption v-model="type" value="private_parking" title="Estacionamiento o guardería"
                text="Playa o predio destinado a guardar vehículos." icon="parking-square" />
        </div>

        <!-- Botón continuar -->
        <div class="mt-auto flex justify-end">
            <button @click="type ? $emit('next') : (showErrorModal = true)"
                class="w-full md:w-auto bg-primary text-white font-semibold py-3 px-8 rounded-xl hover:bg-primary/90 active:scale-95 transition-all shadow-md">
                Continuar ➜
            </button>
        </div>

        <!-- Modal de error -->
        <StatusModal :visible="showErrorModal" type="error" title="¡Atención!"
            message="Por favor, seleccioná una opción antes de continuar." icon="/src/assets/logo.png"
            @confirm="showErrorModal = false" />
    </div>

</template>

<script setup>
import FormOption from '../../forms/FormOption.vue';
import StatusModal from "../addSpacePage/StatusModal.vue";
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
