<template>
    <div class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-lg w-96">
            <h2 class="text-xl font-semibold mb-4">Configurar {{ typeLabel[type] }}</h2>

            <label class="block mb-2">Capacidad</label>
            <input v-model.number="form.capacity" type="number" min="1" class="input-field mb-4" />

            <label class="block mb-2">Precio por hora ($)</label>
            <input v-model.number="form.price_per_hour" type="number" min="0" class="input-field mb-6" />

            <div class="flex justify-end space-x-2">
                <button @click="$emit('close')" class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">
                    Cancelar
                </button>
                <button @click="handleSave" class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
                    Guardar
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue';

const props = defineProps({
    type: String,
    existing: Object,
});
const emit = defineEmits(['save', 'close']);

const form = reactive({
    type: props.type,
    capacity: props.existing?.capacity || 1,
    price_per_hour: props.existing?.price_per_hour || 0,
});

const typeLabel = {
    van: 'Camioneta',
    car: 'Automóvil',
    motorcycle: 'Motocicleta',
    bicycle: 'Bicicleta / Monopatín',
};

function handleSave() {
    if (form.capacity > 0 && form.price_per_hour >= 0) {
        emit('save', { ...form });
    }
}
</script>

<style scoped>
.input-field {
    @apply w-full border border-gray-300 rounded px-2 py-1;
}
</style>
