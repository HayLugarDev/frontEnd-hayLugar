<template>
    <div
        class="flex flex-col max-w-xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-8 gap-6 min-h-[80vh] animate-fade-in">
        <!-- Título -->
        <div class="text-center">
            <h1 class="text-primary text-3xl sm:text-4xl font-bold mb-2">
                ¿Dónde está ubicado tu espacio?
            </h1>
            <p class="text-gray-500 text-sm sm:text-base">
                Seleccioná la dirección exacta para que los usuarios puedan encontrarlo fácilmente.
            </p>
        </div>

        <!-- Autocomplete -->
        <div v-if="!modelValue.direccion">
            <label class="block text-sm font-semibold text-gray-900 mb-1">Calle</label>

            <!-- GMapAutocomplete con el input visible -->
            <GMapAutocomplete v-model="direccion" :value="direccion"
                class="text-gray-900 mt-1 block w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-primary focus:outline-none transition"
                placeholder="Ingresá tu dirección" @place_changed="handlePlaceChanged" />
        </div>


        <!-- Botón para seleccionar manualmente -->
        <div class="flex justify-center my-2">
            <button
                class="flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-primary text-white font-semibold shadow-md hover:from-indigo-600 hover:to-primary-dark transition-all duration-300 text-base"
                @click="showManualMap = true">
                <font-awesome-icon icon="map-marker-alt" class="text-lg" />
                No encuentro mi dirección
            </button>
        </div>

        <!-- Mensaje si seleccionó manualmente -->
        <transition name="fade">
            <p v-if="selectedMethod === 'manual'" class="text-xs text-amber-600 text-center">
                📍 Ubicación elegida manualmente en el mapa
            </p>
        </transition>

        <!-- Detalles adicionales -->
        <transition name="fade">
            <div v-if="location" class="mt-4">
                <label class="block text-sm font-semibold text-gray-900 mb-1">
                    Referencias adicionales (opcional)
                </label>
                <input type="text" v-model="locationDetails"
                    class="block w-full border border-gray-300 rounded-xl p-4 text-gray-600 focus:ring-2 focus:ring-primary focus:outline-none transition"
                    placeholder="Ej: Edificio A, Planta Baja, etc." />
            </div>
        </transition>

        <!-- Navegación -->
        <div class="flex justify-between mt-auto space-x-4 pt-6">
            <button @click="emit('prev')"
                class="px-6 py-2 border-2 border-primary text-primary rounded-full font-semibold hover:bg-primary hover:text-white transition-all">
                Anterior
            </button>
            <button @click="nextStep"
                class="px-8 py-2 bg-primary text-white rounded-full font-bold shadow-md hover:bg-primary/90 active:scale-95 transition-all">
                Siguiente ➜
            </button>
        </div>

        <!-- Modal de error -->
        <StatusModal :visible="showErrorModal" type="error" title="Dirección faltante"
            message="Por favor, seleccioná una dirección antes de continuar." icon="/src/assets/logo.png"
            @confirm="showErrorModal = false" />

        <!-- Modal con mapa manual -->
        <SelectLocationMap v-if="showManualMap" @close="showManualMap = false" @selected="handleManualLocation" />
    </div>
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import StatusModal from '../addSpacePage/StatusModal.vue'
import SelectLocationMap from '../addSpacePage/SelectLocationMap.vue'

const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue', 'next', 'prev']);

const showErrorModal = ref(false);
const showManualMap = ref(false);
const direccion = ref(props.modelValue.location || '');

watch(
    () => props.modelValue.location,
    (val) => {
        direccion.value = val || ''
    }
)

const handlePlaceChanged = (place) => {
    if (!place || !place.address_components) return;

    const components = place.address_components;

    // ✅ Filtramos el código postal completamente
    const getComponent = (type) =>
        components.find((c) => c.types.includes(type))?.long_name || '';

    const streetNumber = getComponent('street_number');
    const route = getComponent('route');
    const locality = getComponent('locality') || getComponent('sublocality') || '';
    const province = getComponent('administrative_area_level_1');
    const country = getComponent('country');

    const street = [route, streetNumber].filter(Boolean).join(' ');
    const parts = [street, locality, province, country].filter(Boolean);
    const cleanAddress = parts.join(', ');

    const finalAddress = cleanAddress.replace(/\s{2,}/g, ' ').trim();

    direccion.value = finalAddress;
    emit('update:modelValue', {
        ...props.modelValue,
        location: finalAddress,
        latitude: place.geometry?.location?.lat() || null,
        longitude: place.geometry?.location?.lng() || null,
    });
};

const handleManualLocation = (payload) => {
    // Debug: ver qué llega
    console.log('[handleManualLocation] payload recibido:', payload)

    // payload expected: { lat, lng, address }
    const lat = payload.lat
    const lng = payload.lng
    const childAddress = payload.address

    if (childAddress) {
        // Si el hijo ya envió la dirección, la usamos directamente
        direccion.value = childAddress
        emit('update:modelValue', {
            ...props.modelValue,
            location: childAddress,
            latitude: lat,
            longitude: lng
        })
        showManualMap.value = false
        return
    }

    // Fallback: si por alguna razón no vino address, geocode acá
    if (window.google && window.google.maps) {
        const geocoder = new google.maps.Geocoder()
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            console.log('[handleManualLocation] geocode status:', status, results?.[0])
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
    } else {
        // si no hay google (caso raro), guardamos coords y un texto genérico
        direccion.value = 'Ubicación seleccionada manualmente'
        emit('update:modelValue', {
            ...props.modelValue,
            location: direccion.value,
            latitude: lat,
            longitude: lng
        })
        showManualMap.value = false
    }
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

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
