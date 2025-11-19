<template>
  <div v-if="show" class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] rounded-lg p-6 w-[90%] md:w-2/3 max-h-[90vh] overflow-y-auto shadow-lg">
      <h2 class="text-xl font-bold mb-4 text-center text-white">Seleccioná el vehículo que vas a estacionar</h2>
      <div class="space-y-4">
        <div
          v-for="vehiculo in filteredVehicles"
          :key="vehiculo.id"
          class="border rounded-lg p-4 cursor-pointer bg-[#06D6A0]/20 hover:bg-[#06D6A0]/30 text-gray-200"
          @click="seleccionarVehiculo(vehiculo)"
        >
          <p><strong>Tipo:</strong> {{ vehicleLabel(vehiculo.type) }}</p>
          <p><strong>Modelo:</strong> {{ vehiculo.model || 'No aplica' }}</p>
          <p><strong>Patente:</strong> {{ vehiculo.license_plate || 'No aplica' }}</p>
        </div>
      </div>
      <button @click="close" class="mt-6 w-full bg-[#00B4D8] hover:bg-[#00B4D8]/10 text-white font-bold py-2 rounded">
        Cancelar
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import vehicleLabel from '../../../logic/useVehicleLabel';

const props = defineProps<{
  show: boolean;
  vehicles: any[];
  vehicleType: string;
}>();

const emit = defineEmits(['close', 'selected']);

const filteredVehicles = computed(() => {
  return props.vehicles.filter(v => v.type === props.vehicleType);
});

const seleccionarVehiculo = (vehicle: any) => {
  emit('selected', vehicle);
};

const close = () => emit('close');
</script>
