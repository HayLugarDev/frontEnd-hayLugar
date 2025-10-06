<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div class="w-full max-w-md mx-auto bg-white rounded-3xl shadow-2xl p-6 animate-fadeIn">
            <!-- Header -->
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-2xl font-bold text-primary flex items-center gap-2">
                    <font-awesome-icon icon="search-location" class="text-primary text-2xl" />
                    Búsqueda avanzada
                </h2>
                <button @click="$emit('close')" class="text-gray-400 hover:text-primary text-2xl">
                    <font-awesome-icon icon="times" />
                </button>
            </div>

            <!-- Formulario -->
            <form @submit.prevent="handleSearch" class="space-y-6">
                <!-- Lugar -->
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1">Zona o dirección</label>
                    <input v-model="localSearchQuery" type="text" placeholder="Ej: Palermo, Av. Corrientes..."
                        class="w-full rounded-full border border-gray-300 px-4 py-3 text-lg focus:ring-2 focus:ring-primary focus:outline-none transition" />
                </div>

                <!-- Fechas -->
                <div class="flex gap-4">
                    <div class="flex-1">
                        <label class="block text-sm font-semibold text-gray-700 mb-1">Check-in</label>
                        <VueDatePicker v-model="localCheckIn" :teleport="true"
                            :input-class="'w-full rounded-full border border-gray-300 px-4 py-3 text-lg focus:ring-2 focus:ring-primary focus:outline-none transition'"
                            :placeholder="'Desde...'" />
                    </div>
                    <div class="flex-1">
                        <label class="block text-sm font-semibold text-gray-700 mb-1">Check-out</label>
                        <VueDatePicker v-model="localCheckOut" :teleport="true"
                            :input-class="'w-full rounded-full border border-gray-300 px-4 py-3 text-lg focus:ring-2 focus:ring-primary focus:outline-none transition'"
                            :placeholder="'Hasta...'" />
                    </div>
                </div>

                <!-- Fecha de publicación -->
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1">Fecha de publicación</label>
                    <VueDatePicker v-model="localPublishedDate" :teleport="true"
                        :input-class="'w-full rounded-full border border-gray-300 px-4 py-3 text-lg focus:ring-2 focus:ring-primary focus:outline-none transition'"
                        :placeholder="'Selecciona fecha...'" />
                </div>

                <!-- Precio máximo -->
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1">Precio máximo por hora</label>
                    <input v-model="localMaxPrice" type="number" min="0" placeholder="Ej: 500"
                        class="w-full rounded-full border border-gray-300 px-4 py-3 text-lg focus:ring-2 focus:ring-primary focus:outline-none transition" />
                </div>

                <!-- Ordenar por -->
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1">Ordenar por</label>
                    <select v-model="localSortBy"
                        class="w-full rounded-full border border-gray-300 px-4 py-3 text-lg focus:ring-2 focus:ring-primary focus:outline-none transition">
                        <option value="nearest">Más cercanas</option>
                        <option value="price">Precio</option>
                        <option value="published">Fecha de publicación</option>
                    </select>
                </div>

                <!-- Botón de búsqueda -->
                <button type="submit"
                    class="w-full py-3 rounded-full bg-gradient-to-r from-indigo-500 to-primary text-white font-bold text-lg shadow-lg hover:from-indigo-600 hover:to-primary transition-all flex items-center justify-center gap-2">
                    <font-awesome-icon icon="search" />
                    Buscar espacios
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker'

const localPublishedDate = ref(null)
const localMaxPrice = ref('')
const localSortBy = ref('nearest')

const props = defineProps({
    searchQuery: String,
    checkIn: [String, Number, Date],
    checkOut: [String, Number, Date],
})

const emit = defineEmits(['update:searchQuery', 'update:checkIn', 'update:checkOut', 'search', 'close'])

const localSearchQuery = ref(props.searchQuery || '')
const localCheckIn = ref(props.checkIn || null)
const localCheckOut = ref(props.checkOut || null)

// Sincroniza valores locales con props
watch(() => props.searchQuery, val => localSearchQuery.value = val)
watch(() => props.checkIn, val => localCheckIn.value = val)
watch(() => props.checkOut, val => localCheckOut.value = val)

function handleSearch() {
  emit('update:searchQuery', localSearchQuery.value);
  emit('update:checkIn', localCheckIn.value);
  emit('update:checkOut', localCheckOut.value);
  emit('update:publishedDate', localPublishedDate.value);
  emit('update:maxPrice', localMaxPrice.value);
  emit('update:sortBy', localSortBy.value);
  emit('search');
  emit('close');
}
</script>

<style scoped>
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fadeIn {
    animation: fadeIn 0.3s ease;
}
</style>