<template>
    <div
        class="flex flex-col max-w-xl mx-auto p-8 gap-6 md:min-h-[80vh] animate-fade-in">
        <h1 class="text-primary text-3xl sm:text-4xl font-bold text-center mb-4">
            Completá los detalles de tu vehículo
        </h1>

        <p class="text-gray-300 text-center mb-6">
            Ingresá la información básica para identificar tu vehículo correctamente.
        </p>

        <div class="space-y-6 flex-1">
            <!-- Marca -->
            <div>
                <label class="block text-sm font-semibold text-gray-200 mb-2">Marca</label>
                <input type="text" v-model="brand" placeholder="Ej: Fiat"
                    class="w-full bg-white/10 border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/30 rounded-xl p-4 text-gray-400 placeholder-gray-400 transition-all outline-none" />
            </div>

            <!-- Modelo -->
            <div>
                <label class="block text-sm font-semibold text-gray-200 mb-2">Modelo</label>
                <input type="text" v-model="model" placeholder="Ej: Cronos Drive 1.3"
                    class="w-full bg-white/10 border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/30 rounded-xl p-4 text-gray-400 placeholder-gray-400 transition-all outline-none" />
            </div>

            <!-- Color -->
            <div>
                <label class="block text-sm font-semibold text-gray-200 mb-2">Color</label>
                <input type="text" v-model="color" placeholder="Ej: Rojo"
                    class="w-full bg-white/10 border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/30 rounded-xl p-4 text-gray-400 placeholder-gray-400 transition-all outline-none" />
            </div>
        </div>

        <!-- Botones de navegación -->
        <div class="flex justify-between mt-auto gap-4">
            <button @click="emit('prev')"
                class="w-1/2 border border-gray-300 text-gray-200 font-medium py-3 rounded-xl hover:bg-gray-100 transition-all">
                ⬅ Anterior
            </button>
            <button @click="brand && model && color ? $emit('next') : (showErrorModal = true)"
                class="w-1/2 bg-primary text-white font-semibold py-3 rounded-xl hover:bg-primary/90 transition-all">
                Siguiente ➜
            </button>
        </div>

        <!-- Modal de error -->
        <StatusModal :visible="showErrorModal" type="error" title="¡Atención!"
            message="Por favor, completá todos los campos antes de continuar." :icon="logo"
            @confirm="showErrorModal = false" />
    </div>
</template>

<script setup>
import StatusModal from "../addSpacePage/StatusModal.vue";
import logo from "../../../assets/logo.png";
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
