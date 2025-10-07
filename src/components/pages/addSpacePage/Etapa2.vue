<template>
    <div class="flex flex-col md:w-1/2 mx-auto p-6 gap-2">
        <h1 class="text-4xl font-semibold mb-8 text-primary">¿Dónde está ubicado tu espacio?</h1>

        <!-- Autocomplete -->
        <div>
            <label class="block text-sm font-semibold text-gray-900 mb-1">Calle</label>
            <input type="text" v-model="direccion"
                class="input-field text-gray-900 mt-1 block w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-primary focus:outline-none transition"
                placeholder="Ingresá tu dirección" readonly />
            <GMapAutocomplete class="hidden" @place_changed="handlePlaceChanged" placeholder="Ingresá tu dirección" />
        </div>

        <!-- Botón para seleccionar manualmente -->
        <div class="flex justify-center my-4">
            <button
                class="flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-primary text-white font-semibold shadow-lg hover:from-indigo-600 hover:to-primary-dark transition-all duration-300 text-base"
                @click="showManualMap = true">
                <font-awesome-icon icon="map-marker-alt" class="text-lg" />
                Seleccionar manualmente en el mapa
            </button>
        </div>

        <!-- Detalles -->
        <div v-if="location">
            <label class="block text-sm font-semibold text-gray-900 mb-1">Referencias adicionales</label>
            <input type="text" v-model="locationDetails"
                class="text-gray-500 mt-1 block w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-primary focus:outline-none transition"
                placeholder="Ej: Edificio A, Planta Baja, etc." />
        </div>

        <!-- Navegación -->
        <div class="flex justify-between space-x-4 mt-8">
            <button @click="emit('prev')"
                class="px-6 py-2 border-2 border-primary text-primary rounded-full font-semibold hover:bg-primary hover:text-white transition">
                Anterior
            </button>
            <button @click="nextStep"
                class="px-8 py-2 bg-gradient-to-r from-indigo-500 to-primary text-white rounded-full font-bold shadow-lg hover:from-indigo-600 hover:to-primary-dark transition-all duration-300">
                Siguiente
            </button>
        </div>

        <StatusModal :visible="showErrorModal" type="error" title="Dirección faltante"
            message="Por favor, seleccioná una dirección antes de continuar." icon="/src/assets/logo.png"
            @confirm="showErrorModal = false" />

        <!-- Modal con mapa manual -->
        <SelectLocationMap v-if="showManualMap" @close="showManualMap = false" @selected="handleManualLocation" />
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import StatusModal from '../addSpacePage/StatusModal.vue'
import SelectLocationMap from '../addSpacePage/SelectLocationMap.vue'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue', 'next', 'prev'])

const showErrorModal = ref(false);
const showManualMap = ref(false);
const direccion = ref(props.modelValue.location || '');

watch(() => props.modelValue.location, (val) => {
  direccion.value = val || '';
});

const handlePlaceChanged = (place) => {
    const components = place.address_components || []

    const streetNumber = components.find(c => c.types.includes('street_number'))?.long_name || ''
    const route = components.find(c => c.types.includes('route'))?.long_name || ''
    const locality = components.find(c => c.types.includes('locality') || c.types.includes('sublocality'))?.long_name || ''
    const province = components.find(c => c.types.includes('administrative_area_level_1'))?.long_name || ''
    const country = components.find(c => c.types.includes('country'))?.long_name || ''

    const street = [route, streetNumber].filter(Boolean).join(' ')
    const parts = [street, locality, province, country].filter(Boolean)
    const fullAddress = parts.join(', ');

    direccion.value = fullAddress;

    emit('update:modelValue', {
        ...props.modelValue,
        location: fullAddress,
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng()
    })
}

const handleManualLocation = ({ lat, lng }) => {
  const geocoder = new google.maps.Geocoder()

  geocoder.geocode({ location: { lat, lng } }, (results, status) => {
    if (status === 'OK' && results[0]) {
      const fullAddress = results[0].formatted_address
      direccion.value = fullAddress
      emit('update:modelValue', {
        ...props.modelValue,
        location: fullAddress,
        latitude: lat,
        longitude: lng
      })
    } else {
      // Si falla el geocoder, dejamos una etiqueta genérica
      direccion.value = 'Ubicación seleccionada manualmente'
      emit('update:modelValue', {
        ...props.modelValue,
        location: direccion.value,
        latitude: lat,
        longitude: lng
      })
    }
    showManualMap.value = false
  })
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

const location = computed(() => props.modelValue.location)
</script>