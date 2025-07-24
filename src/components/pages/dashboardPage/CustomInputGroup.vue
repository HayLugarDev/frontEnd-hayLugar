<template>
    <div class="relative grid grid-cols-10 col-span-10 col-start-2 col-end-10 lg:col-span-8 lg:col-start-3 lg:col-end-10 
      xl:col-span-6 xl:col-start-3 xl:col-end-10 items-center justify-between rounded-full shadow-xl h-14 bg-white">

        <!-- Lugar -->
        <div class="col-span-3 relative flex items-center shadow-sm h-full rounded-l-full">
            <label class="absolute top-1 left-6 px-2 text-sm text-gray-800">Lugar</label>
            <input placeholder="Nombre o dirección"
                class="text-md border-none w-full h-full rounded-full hover:bg-gray-200 px-8 text-gray-400 focus:outline-none"
                :value="searchQuery" @input="e => updateValue('searchQuery', e.target.value)" />
        </div>

        <!-- Check-in -->
        <div class="col-span-3 relative flex items-center shadow-sm h-full">
            <label class="absolute top-1 left-6 px-2 text-sm text-gray-800">Check-in</label>
            <div
                class="text-md border-none w-full h-full rounded-full hover:bg-gray-200 px-8 text-gray-400 flex items-center justify-center focus:outline-none">
                <VueDatePicker :model-value="checkIn" @update:model-value="(val) => updateValue('checkIn', val)" :teleport="true">
                    <template #trigger>
                        <p>
                            {{ checkIn ? formatDate(checkIn) : 'Desde?' }}
                        </p>
                    </template>
                </VueDatePicker>
            </div>
        </div>

        <!-- Check-out -->
        <div class="col-span-3 relative flex items-center shadow-sm h-full rounded-r-full">
            <label class="absolute top-1 left-6 px-2 text-sm text-gray-800">Check-out</label>
            <div
                class="text-md border-none w-full h-full rounded-full hover:bg-gray-200 px-8 text-gray-400 flex items-center justify-center focus:outline-none">
                <VueDatePicker :model-value="checkOut" @update:model-value="(val) => updateValue('checkOut', val)" :teleport="true">
                    <template #trigger>
                        <p>
                            {{ checkOut ? formatDate(checkOut) : 'Hasta?' }}
                        </p>
                    </template>
                </VueDatePicker>
            </div>
        </div>

        <!-- Botón de búsqueda -->
        <div class="absolute p-0.5 h-full right-0.5">
            <button @click="onSearch"
                class="z-1 col-span-1 p-2 h-full w-14 text-white hover:bg-primary bg-slate-700 text-xl rounded-full">
                <font-awesome-icon icon="search" />
            </button>
        </div>
    </div>
</template>

<script setup>
import VueDatePicker from '@vuepic/vue-datepicker'
import { format } from 'date-fns'

const props = defineProps({
    searchQuery: String,
    checkIn: [String, Number, Date],
    checkOut: [String, Number, Date],
    onSearch: Function,
})

const emit = defineEmits(['update:searchQuery', 'update:checkIn', 'update:checkOut'])

const updateValue = (field, value) => {
    emit(`update:${field}`, value)
}

// Función para mostrar fecha en formato legible
function formatDate(date) {
    const d = typeof date === 'number' ? new Date(date) : date
    return format(d, 'dd/MM/yyyy HH:mm')
}
</script>
