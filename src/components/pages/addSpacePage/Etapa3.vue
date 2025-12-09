<template>
  <div
    class="flex flex-col max-w-xl mx-auto p-8 gap-6 min-h-[80vh] animate-fade-in">

    <!-- Título -->
    <h1 class="text-primary text-3xl sm:text-4xl font-bold text-center mb-2">
      ¿Qué tipos de vehículos aceptarás en tu espacio?
    </h1>

    <!-- Subtítulo / Advertencia -->
    <p class="text-gray-300 text-center mb-6 text-sm">
      <strong>Atención:</strong> No publiques más espacios de los que realmente tenés disponibles.
      Así nos aseguramos de que cada vehículo cuente con su lugar sin problemas y que ninguna reserva se superponga con
      otra.
    </p>

    <!-- Opciones de vehículo -->
    <div class="space-y-4">
      <VehicleFormOption v-for="type in vehicleTypes" :key="type.value" :value="type.value" :title="type.title"
        :text="type.description" :configured="!!vehicleMap[type.value]" :configuration="vehicleMap[type.value]"
        @save="saveConfiguration" @remove="removeConfiguration" />
    </div>

    <!-- Navegación -->
    <div class="mt-auto flex justify-between space-x-4">
      <button @click="emit('prev')"
        class="px-6 py-2 border-2 border-primary text-primary rounded-full font-semibold hover:bg-primary hover:text-white transition">
        Anterior
      </button>
      <button @click="Object.keys(vehicleMap).length ? emitSubmit() : (showErrorModal = true)"
        class="px-8 py-2 bg-primary text-white rounded-full font-bold shadow-md hover:bg-primary/90 active:scale-95 transition-all">
        Siguiente ➜
      </button>
    </div>

    <!-- Modal de error -->
    <StatusModal :visible="showErrorModal" title="¡Atención!"
      message="Por favor, selecciona al menos un tipo de vehículo y configura su capacidad y precio."
     :icon="logo" @confirm="showErrorModal = false" />
  </div>

</template>

<script setup>
import { computed, ref } from 'vue';
import VehicleFormOption from '../../forms/VehicleFormOption.vue';
import VehicleModal from '../addSpacePage/VehicleModal.vue';
import StatusModal from '../addSpacePage/StatusModal.vue';
import logo from "../../../assets/logo.png";

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

function removeConfiguration(type) {
  const updated = props.modelValue.vehicle_capacities.filter((v) => v.type !== type);
  emit('update:modelValue', {
    ...props.modelValue,
    vehicle_capacities: updated,
  });
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
