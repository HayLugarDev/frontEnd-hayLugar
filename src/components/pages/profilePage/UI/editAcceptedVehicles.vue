<template>
    <div v-if="visible" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 md:p-8 transform transition-all">
            <!-- Header -->
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl md:text-3xl font-bold text-primary">
                    Vehículos aceptados
                </h2>
                <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
                    ✕
                </button>
            </div>

            <!-- Opciones -->
            <div class="flex flex-col gap-4">
                <VehicleFormOption v-for="type in vehicleTypes" :key="type.value" :value="type.value"
                    :title="type.title" :text="type.description" :configured="!!vehicleMap[type.value]"
                    :configuration="vehicleMap[type.value]" @configure="openConfig(type.value)" />
            </div>

            <!-- Botones -->
            <div class="flex justify-end mt-6 space-x-4">
                <button @click="$emit('close')" class="px-4 py-2 border-2 rounded-xl hover:border-gray-900">
                    Cancelar
                </button>
                <button @click="Object.keys(vehicleMap).length ? emitSave() : (showErrorModal = true)"
                    class="px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition duration-300">
                    Guardar
                </button>
            </div>

            <!-- Modal de configuración -->
            <VehicleModal v-if="selectedType" :type="selectedType" :existing="vehicleMap[selectedType]"
                @save="saveConfiguration" @close="selectedType = null" />

            <!-- Modal de error -->
            <StatusModal :visible="showErrorModal" title="¡Atención!"
                message="Selecciona al menos un tipo de vehículo y configura su capacidad y precio."
                icon="/src/assets/logo.png" @close="showErrorModal = false" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import VehicleModal from '../../addSpacePage/VehicleModal.vue';
import VehicleFormOption from '../../../forms/VehicleFormOption.vue';
import StatusModal from '../../addSpacePage/StatusModal.vue';

const props = defineProps<{
    visible: boolean
    modelValue: {
        vehicle_capacities: { type: string; capacity: number; price: number }[]
    }
}>()

const emit = defineEmits(['update:modelValue', 'close', 'save'])

const selectedType = ref<string | null>(null)
const showErrorModal = ref(false)

// Tipos de vehículos
const vehicleTypes = [
    { value: 'van', title: 'Camioneta', description: 'Espacio mín. 2.5 x 4 m.' },
    { value: 'car', title: 'Automóvil', description: 'Espacio mín. 2.2 x 3.2 m.' },
    { value: 'motorcycle', title: 'Motocicleta', description: 'Espacio mín. 1 x 1.8 m.' },
    { value: 'bicycle', title: 'Bicicleta / Monopatín', description: 'Espacio seguro para almacenarlas.' },
]

// Mapa de configuraciones actuales
const vehicleMap = computed<Record<string, any>>(() => {
    const map: Record<string, any> = {}
        ; (props.modelValue.vehicle_capacities || []).forEach((v) => {
            map[v.type] = v
        })
    return map
})

function openConfig(type: string) {
    selectedType.value = type
}

function saveConfiguration(data: { type: string; capacity: number; price: number }) {
    const updated = props.modelValue.vehicle_capacities.filter((v) => v.type !== data.type)
    updated.push(data)
    emit('update:modelValue', {
        ...props.modelValue,
        vehicle_capacities: updated,
    })
    selectedType.value = null
}

function emitSave() {
    emit('save', props.modelValue)
    emit('close')
}
</script>
