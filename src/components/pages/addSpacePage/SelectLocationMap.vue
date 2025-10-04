<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl p-4 w-full max-w-lg relative">
      <h2 class="text-lg font-bold mb-2">Seleccioná la ubicación</h2>
      <GMapMap
        :center="marker"
        :zoom="15"
        style="width: 100%; height: 400px"
        @click="updateMarker"
      >
        <GMapMarker :position="marker" />
      </GMapMap>
      <div class="flex justify-end mt-4 space-x-3">
        <button @click="$emit('close')" class="px-4 py-2 border rounded-lg">Cancelar</button>
        <button @click="confirmSelection" class="px-4 py-2 bg-primary text-white rounded-lg">Confirmar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const marker = ref({ lat: -26.8083, lng: -65.2176 }) // San Miguel de Tucumán por defecto

const emit = defineEmits(['close', 'selected'])

const updateMarker = (event) => {
  marker.value = {
    lat: event.latLng.lat(),
    lng: event.latLng.lng()
  }
}

const confirmSelection = () => {
  emit('selected', marker.value)
}
</script>
