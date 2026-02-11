<template>
  <div v-if="show" class="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
    <div class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg shadow-xl p-8 max-w-md w-full transform transition-all scale-95">
      <h2 class="text-xl font-bold mb-4 text-center text-white">Seleccioná el vehículo que vas a estacionar</h2>
      <div class="space-y-4">
        <div
          v-for="vehiculo in filteredVehicles"
          :key="vehiculo.id"
          class="border rounded-lg p-4 cursor-pointer bg-newgreen/10 hover:bg-newgreen/20 text-gray-200"
          @click="seleccionarVehiculo(vehiculo)"
        >
          <p><strong>Tipo:</strong> {{ vehicleLabel(vehiculo.type) }}</p>
          <p><strong>Modelo:</strong> {{ vehiculo.model || 'No aplica' }}</p>
          <p><strong>Patente:</strong> {{ vehiculo.license_plate || 'No aplica' }}</p>
        </div>
      </div>
      <button @click="close" class="mt-6 w-full bg-primary/20 hover:bg-primary text-white font-bold py-2 rounded">
        Volver
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
