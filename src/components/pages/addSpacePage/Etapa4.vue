<template>
  <div class="flex flex-col md:w-1/2 mx-auto p-6 gap-2">
    <h1 class="text-4xl font-semibold mb-8">¿Dónde está ubicado tu espacio?</h1>

    <!-- Autocomplete -->
    <div>
      <label class="block text-sm font-semibold text-gray-900">Calle</label>
      <GMapAutocomplete
        class="input-field"
        @place_changed="handlePlaceChanged"
        placeholder="Ingresá tu dirección"
      />
    </div>

    <!-- Botón para seleccionar manualmente -->
    <button
      class="mt-2 text-blue-600 hover:underline text-sm"
      @click="showManualMap = true"
    >
      No encuentro mi dirección, seleccionar manualmente en el mapa
    </button>

    <!-- Detalles -->
    <div v-if="location">
      <label class="block text-sm font-semibold text-gray-900">Referencias adicionales</label>
      <input
        type="text"
        v-model="locationDetails"
        class="text-gray-500 mt-1 block w-full border border-gray-900 rounded-md p-4"
        placeholder="Ej: Edificio A, Planta Baja, etc."
      />
    </div>

    <!-- Navegación -->
    <div class="flex justify-between space-x-4 mt-6">
      <button @click="emit('prev')" class="px-4 py-2 border-2 rounded-xl hover:border-gray-900">
        Anterior
      </button>
      <button
        @click="nextStep"
        class="px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition duration-300"
      >
        Siguiente
      </button>
    </div>

    <StatusModal
      :visible="showErrorModal"
      type="error"
      title="Dirección faltante"
      message="Por favor, seleccioná una dirección antes de continuar."
      icon="/src/assets/logo.png"
      @confirm="showErrorModal = false"
    />

    <!-- Modal con mapa manual -->
    <SelectLocationMap
      v-if="showManualMap"
      @close="showManualMap = false"
      @selected="handleManualLocation"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import StatusModal from '../addSpacePage/StatusModal.vue'
import SelectLocationMap from '../addSpacePage/SelectLocationMap.vue'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue', 'next', 'prev'])

const showErrorModal = ref(false)
const showManualMap = ref(false)

const handlePlaceChanged = (place) => {
  const components = place.address_components || []

  const streetNumber = components.find(c => c.types.includes('street_number'))?.long_name || ''
  const route = components.find(c => c.types.includes('route'))?.long_name || ''
  const locality = components.find(c => c.types.includes('locality') || c.types.includes('sublocality'))?.long_name || ''
  const province = components.find(c => c.types.includes('administrative_area_level_1'))?.long_name || ''
  const country = components.find(c => c.types.includes('country'))?.long_name || ''

  const street = [route, streetNumber].filter(Boolean).join(' ')
  const parts = [street, locality, province, country].filter(Boolean)

  emit('update:modelValue', {
    ...props.modelValue,
    location: parts.join(', '),
    latitude: place.geometry.location.lat(),
    longitude: place.geometry.location.lng()
  })
}

const handleManualLocation = ({ lat, lng }) => {
  emit('update:modelValue', {
    ...props.modelValue,
    location: 'Ubicación seleccionada manualmente',
    latitude: lat,
    longitude: lng
  })
  showManualMap.value = false
}

const nextStep = () => {
  if (!props.modelValue.location) {
    showErrorModal.value = true
    return
  }
  emit('next')
}

const locationDetails = computed({
  get: () => props.modelValue.locationDetails,
  set: (val) => emit('update:modelValue', { ...props.modelValue, locationDetails: val })
})
</script>
