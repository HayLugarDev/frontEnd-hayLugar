<template>
    <div class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 animate-fade-in">
        <div class="bg-white rounded-2xl shadow-lg border border-gray-100 w-full max-w-md p-8 relative">

            <!-- Título -->
            <h2 class="text-primary text-2xl sm:text-3xl font-bold text-center mb-6">
                Configurar {{ typeLabel[type] }}
            </h2>

            <!-- Capacidad -->
            <div class="mb-4">
                <label class="block text-sm font-semibold text-gray-700 mb-2">Capacidad</label>
                <input v-model.number="form.capacity" type="number" min="1" placeholder="Cantidad de vehículos"
                    class="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:outline-none transition" />
            </div>

            <!-- Precio por hora -->
            <div class="mb-6">
                <label class="block text-sm font-semibold text-gray-700 mb-2">Precio por hora ($)</label>
                <input v-model.number="form.price_per_hour" type="number" min="0" placeholder="Ej: 250"
                    class="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:outline-none transition" />
            </div>

            <!-- Botones -->
            <div class="flex justify-end gap-3">
                <button @click="$emit('close')"
                    class="px-6 py-2 rounded-full bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition">
                    Cancelar
                </button>
                <button @click="handleSave"
                    class="px-6 py-2 rounded-full bg-primary text-white font-semibold hover:bg-primary/90 active:scale-95 transition-all">
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
