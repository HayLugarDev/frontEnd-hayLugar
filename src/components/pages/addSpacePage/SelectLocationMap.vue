<script setup>
import { ref } from 'vue'

const marker = ref({ lat: -26.8083, lng: -65.2176 }) // default
const address = ref('')
const emit = defineEmits(['close', 'selected'])

// cuando el usuario hace click en el mapa
const updateMarker = (event) => {
  const lat = event.latLng.lat()
  const lng = event.latLng.lng()
  marker.value = { lat, lng }

  // geocode para mostrar la dirección en el modal inmediatamente
  if (window.google && window.google.maps) {
    const geocoder = new google.maps.Geocoder()
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results[0]) {
        address.value = results[0].formatted_address
      } else {
        address.value = 'Ubicación seleccionada manualmente'
      }
    })
  } else {
    address.value = 'Ubicación seleccionada manualmente'
  }
}

// al confirmar, emitimos lat, lng y address
const confirmSelection = () => {
  // asegurate de enviar address aunque esté vacío para que el padre lo sepa
  emit('selected', {
    lat: marker.value.lat,
    lng: marker.value.lng,
    address: address.value || null
  })
  emit('close')
}
</script>

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

      <p v-if="address" class="text-gray-600 text-sm mt-2 italic">{{ address }}</p>

      <div class="flex justify-end mt-4 space-x-3">
        <button @click="$emit('close')" class="px-4 py-2 border rounded-lg">Cancelar</button>
        <button @click="confirmSelection" class="px-4 py-2 bg-primary text-white rounded-lg">Confirmar</button>
      </div>
    </div>
  </div>
</template>
