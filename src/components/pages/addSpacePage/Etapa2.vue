<template>
    <div class="flex flex-col max-w-xl mx-auto p-8 gap-8 md:min-h-[80vh] animate-fade-in">

        <!-- Título -->
        <div class="text-center space-y-1">
            <h1 class="text-primary text-3xl sm:text-4xl font-extrabold">
                ¿Dónde está ubicado tu espacio?
            </h1>
            <p class="text-gray-300 text-sm sm:text-base">
                Seleccioná la dirección exacta para que los usuarios puedan encontrarlo fácilmente.
            </p>
        </div>

        <!-- Autocomplete -->
        <div v-if="!modelValue.direccion" class="space-y-2">
            <label class="block text-sm font-semibold text-gray-100">
                Dirección
            </label>

            <div class="relative">
                <GMapAutocomplete v-model="direccion" :value="direccion" @place_changed="handlePlaceChanged"
                    placeholder="Ingresá tu dirección" class="w-full bg-white/5 text-gray-200 border border-white/10 rounded-xl px-4 py-3 pl-11
                 placeholder-gray-400 focus:ring-2 focus:ring-primary focus:outline-none backdrop-blur-sm" />

                <!-- Ícono ubicación -->
                <MapPin class="w-5 h-5 text-primary absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
        </div>

        <!-- Botón: seleccionar manualmente -->
        <button class="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 backdrop-blur border border-white/10
             text-white font-medium shadow hover:bg-white/20 transition-all duration-300"
            @click="showManualMap = true">

            <LocateFixed class="w-5 h-5 text-primary" />
            No encuentro mi dirección
        </button>

        <!-- Aviso: seleccionó manual -->
        <transition name="fade">
            <p v-if="selectedMethod === 'manual'"
                class="text-xs text-amber-500 text-center flex items-center justify-center gap-1">

                <Info class="w-4 h-4" />
                Ubicación elegida manualmente en el mapa
            </p>
        </transition>

        <!-- Detalles adicionales -->
        <transition name="fade">
            <div v-if="location" class="space-y-2 mt-2">
                <label class="block text-sm font-semibold text-gray-100">
                    Referencias adicionales (opcional)
                </label>

                <input v-model="locationDetails" type="text" placeholder="Ej: Edificio A, Planta Baja, Timbre 3..."
                    class="w-full bg-white/5 border border-white/10 text-gray-200 rounded-xl px-4 py-3
                 placeholder-gray-400 focus:ring-2 focus:ring-primary backdrop-blur-sm" />
            </div>
        </transition>

        <!-- Navegación -->
        <div class="flex justify-between mt-auto pt-6">

            <button @click="emit('prev')" class="px-6 py-2 border border-primary text-primary rounded-full font-semibold
               hover:bg-primary hover:text-white transition-all duration-200">
                Anterior
            </button>

            <button @click="nextStep" class="px-8 py-2 bg-primary text-white rounded-full font-bold shadow-lg
               hover:bg-primary/90 active:scale-95 transition-all">
                Siguiente ➜
            </button>
        </div>

        <!-- Modal de error -->
        <StatusModal :visible="showErrorModal" type="error" title="Dirección faltante"
            message="Por favor, seleccioná una dirección antes de continuar." :icon="logo"
            @confirm="showErrorModal = false" />

        <!-- Mapa manual -->
        <SelectLocationMap v-if="showManualMap" @close="showManualMap = false" @selected="handleManualLocation" />
    </div>
</template>


<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import StatusModal from '../addSpacePage/StatusModal.vue'
import SelectLocationMap from '../addSpacePage/SelectLocationMap.vue'
import logo from '../../../assets/logo.png'

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
