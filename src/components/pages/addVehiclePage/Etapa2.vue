<template>
    <div class="flex flex-col md:w-1/2 mx-auto p-6 gap-2 min-h-screen">
        <h1 class="text-primary text-4xl font-semibold mb-8">Completá los detalles de tu vehículo</h1>

        <div class="space-y-6 font-normal flex-1">
            <!-- Modelo -->
            <div>
                <label class="block text-sm font-semibold text-gray-900">Marca</label>
                <input type="text" v-model="brand"
                    class="text-gray-500 mt-1 block w-full border border-gray-900 rounded-md p-4"
                    placeholder="Ej: Fiat" />
            </div>

            <!-- Color -->
            <div>
                <label class="block text-sm font-semibold text-gray-900">Modelo</label>
                <input type="text" v-model="model"
                    class="text-gray-500 mt-1 block w-full border border-gray-900 rounded-md p-4"
                    placeholder="Ej: Cronos Drive 1.3" />
            </div>

            <!-- Color -->
            <div>
                <label class="block text-sm font-semibold text-gray-900">Color</label>
                <input type="text" v-model="color"
                    class="text-gray-500 mt-1 block w-full border border-gray-900 rounded-md p-4"
                    placeholder="Ej: Rojo" />
            </div>

        </div>

        <!-- Botones de navegación -->
        <div class="flex justify-between mt-auto space-x-4">
            <button @click="emit('prev')" class="px-4 py-2 border-2 rounded-xl hover:border-gray-900">Anterior</button>
            <button @click="brand && model && color ? $emit('next') : (showErrorModal = true)"
                class="px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition duration-300">
                Siguiente
            </button>
        </div>
        <StatusModal :visible="showErrorModal" type="error" title="¡Atención!"
            message="Por favor, completá todos los campos antes de continuar." icon="/src/assets/logo.png"
            @close="showErrorModal = false" />
    </div>
</template>

<script setup>
import StatusModal from "../addSpacePage/StatusModal.vue";
import { computed, ref } from 'vue';

const showErrorModal = ref(false);
const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue', 'next', 'prev']);

const brand = computed({
    get: () => props.modelValue.brand,
    set: (val) => emit('update:modelValue', { ...props.modelValue, brand: val })
});
const model = computed({
    get: () => props.modelValue.model,
    set: (val) => emit('update:modelValue', { ...props.modelValue, model: val })
});
const color = computed({
    get: () => props.modelValue.color,
    set: (val) => emit('update:modelValue', { ...props.modelValue, color: val })
});

</script>

<style scoped>
.input-field {
    @apply w-full mt-2 p-2 border border-gray-300 rounded;
}
</style>
