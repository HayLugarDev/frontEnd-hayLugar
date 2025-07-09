<template>
  <div class="flex flex-col md:w-1/2 mx-auto p-6 gap-4">
    <h1 class="text-4xl font-semibold mb-8">¿Qué tipos de vehículos aceptarás en tu espacio?</h1>

    <VehicleFormOption v-for="type in vehicleTypes" :key="type.value" :value="type.value" :title="type.title"
      :text="type.description" :configured="!!vehicleMap[type.value]" :configuration="vehicleMap[type.value]"
      @configure="openConfig(type.value)" />

    <!-- Navegación -->
    <div class="flex justify-between space-x-4">
      <button @click="emit('prev')" class="px-4 py-2 border-2 rounded-xl hover:border-gray-900">Anterior</button>
      <button @click="Object.keys(vehicleMap).length ? emitSubmit() : (showErrorModal = true)"
        class="px-4 py-2 border-2 rounded-xl hover:border-gray-900">
        Siguiente
      </button>
    </div>

    <!-- Modal de configuración -->
    <VehicleModal v-if="selectedType" :type="selectedType" :existing="vehicleMap[selectedType]"
      @save="saveConfiguration" @close="selectedType = null" />

    <!-- Modal de error -->
    <StatusModal :visible="showErrorModal" title="¡Atención!"
      message="Por favor, selecciona al menos un tipo de vehículo y configura su capacidad y precio."
      icon="/src/assets/logo.png" @close="showErrorModal = false" />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import VehicleFormOption from './VehicleFormOption.vue';
import VehicleModal from './VehicleModal.vue';
import StatusModal from './StatusModal.vue';

const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue', 'next', 'prev']);

const selectedType = ref(null);
const showErrorModal = ref(false);

// Tipos disponibles
const vehicleTypes = [
  {
    value: 'van',
    title: 'Camioneta',
    description:
      'Debe contar con espacio para maniobrar correctamente (mín. 2.5 x 4 m).',
  },
  {
    value: 'car',
    title: 'Automóvil',
    description:
      'Debe contar con espacio para maniobrar correctamente (mín. 2.2 x 3.2 m).',
  },
  {
    value: 'motorcycle',
    title: 'Motocicleta',
    description:
      'Debe contar con espacio para maniobrar correctamente (mín. 1 x 1.8 m).',
  },
  {
    value: 'bicycle',
    title: 'Bicicleta / Monopatín',
    description:
      'Debe contar con espacio suficiente para almacenarlas correctamente sin causar daños.',
  },
];

// Mapa de configuraciones actuales
const vehicleMap = computed(() => {
  const map = {};
  (props.modelValue.vehicle_capacities || []).forEach((v) => {
    map[v.type] = v;
  });
  return map;
});

// Abrir modal para configurar
function openConfig(type) {
  selectedType.value = type;
}

// Guardar datos de configuración
function saveConfiguration(data) {
  const updated = props.modelValue.vehicle_capacities.filter((v) => v.type !== data.type);
  updated.push(data);
  emit('update:modelValue', {
    ...props.modelValue,
    vehicle_capacities: updated,
  });
  selectedType.value = null;
}

// Ir a siguiente paso
function emitSubmit() {
  emit('next');
}
</script>
