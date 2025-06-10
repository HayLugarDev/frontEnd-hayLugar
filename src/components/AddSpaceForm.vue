<template>
    <form @submit.prevent="addSpace" class="space-y-6">
        <!-- <FormField v-model="modelValue.name" label="Nombre del espacio:" type="text" placeholder="Ej: Casa centro"
            required />

        <label class="block mt-4">
            <span class="text-lg font-semibold">Ubicación:</span>
            <GMapAutocomplete class="input-field" @place_changed="setPlace" />
        </label>

        <input v-model="modelValue.latitude" type="hidden" />
        <input v-model="modelValue.longitude" type="hidden" />
        <input v-model="modelValue.location" class="input-field hidden" />

        <FormField v-model="modelValue.locationDetails"
            label="Detalles de Ubicación (edificio, piso, número, subsuelo, etc.):" type="text"
            placeholder="Ej: Edificio A, 3er piso, subsuelo, Nº 15" required />

        <label class="block mt-4">
            <span class="text-lg font-semibold">Tipo de estacionamiento:</span>
            <select v-model="modelValue.type" class="input-field">
                <option disabled value="">Seleccione una opción</option>
                <option value="garage">Garage propio</option>
                <option value="large_space">Espacio grande</option>
                <option value="private_parking">Estacionamiento privado</option>
            </select>
        </label>

        <label class="block mt-4">
            <span class="text-lg font-semibold">Superficie de estacionamiento:</span>
            <select v-model="modelValue.parking_type" class="input-field">
                <option disabled value="">Seleccione una opción</option>
                <option value="cubierto">Cubierto</option>
                <option value="descubierto">Descubierto</option>
                <option value="ninguno">Ninguno</option>
            </select>
        </label> -->
        <FormField v-model="space.name" label="Nombre del espacio:" type="text" placeholder="Ej: Casa centro"
            required />
        <!-- Ubicación con Autocomplete -->
        <label class="block space-y-2">
            <span class="text-lg font-semibold text-gray-800">Ubicación:</span>
            <GMapAutocomplete class="input-field" @place_changed="setPlace" placeholder="Buscar dirección..." />
        </label>

        <!-- Datos básicos de ubicación -->
        <input v-model="space.latitude" type="hidden" />
        <input v-model="space.longitude" type="hidden" />
        <input v-model="space.location" class="input-field" />

        <!-- Detalles Adicionales de Ubicación -->
        <FormField v-model="space.locationDetails"
            label="Detalles de Ubicación (edificio, piso, número, subsuelo, etc.):" type="text"
            placeholder="Ej: Edificio A, 3er piso, subsuelo, Nº 15" required />


        <!-- Tipos de Vehículos y Capacidades -->
        <div class="space-y-3">
            <span class="text-lg font-semibold text-gray-800 block">Tipos de vehículos:</span>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div v-for="tipo in vehicleOptions" :key="tipo.key"
                    class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg shadow-sm border">
                    <label class="flex items-center gap-2 flex-1 cursor-pointer">
                        <input type="checkbox" :value="tipo.key" v-model="selectedVehicleTypes"
                            @change="handleVehicleTypeChange(tipo.key)" class="accent-blue-600 w-4 h-4" />
                        <span class="text-gray-700">{{ tipo.label }}</span>
                    </label>
                    <input v-if="selectedVehicleTypes.includes(tipo.key)" v-model.number="vehicleCapacities[tipo.key]"
                        type="number" min="1" placeholder="Capacidad" class="input-field w-24" required />
                </div>
            </div>
        </div>

        <!-- Tipo de Estacionamiento -->
        <label class="block">
            <span class="text-lg font-semibold text-black">Tipo de estacionamiento:</span>
            <select v-model="space.type" class="input-field">
                <option disabled value="">Seleccione una opción</option>
                <option value="garage">Garage propio</option>
                <option value="large_space">Espacio grande</option>
                <option value="private_parking">Estacionamiento privado</option>
            </select>
        </label>

        <!-- Superficie de Estacionamiento -->
        <label class="block">
            <span class="text-lg font-semibold text-black">Superficie de estacionamiento:</span>
            <select v-model="space.parking_type" class="input-field">
                <option disabled value="">Seleccione una opción</option>
                <option value="cubierto">Cubierto</option>
                <option value="descubierto">Descubierto</option>
                <option value="ninguno">Ninguno</option>
            </select>
        </label>

        <!-- Descripción -->
        <label class="block">
            <span class="text-lg font-semibold text-black">Descripción del espacio:</span>
            <textarea v-model="space.description" class="input-field" rows="3"
                placeholder="Ingrese una descripción detallada"></textarea>
        </label>

        <!-- Tarifa y Duración -->
        <label class="block">
            <span class="text-lg font-semibold text-black">Tarifa y duración (ARS):</span>
            <div class="grid grid-cols-2 gap-2 sm:gap-4">
                <div class="relative">
                    <span class="absolute left-3 top-3 text-gray-600">$</span>
                    <input v-model.number="price" type="number" class="input-field pl-7" placeholder="Ej: 1500"
                        required />
                </div>
                <select v-model="price_unit" class="input-field" @change="updateAvailabilityFields">
                    <option value="hour">Por Hora</option>
                    <option value="day">Por Día</option>
                    <option value="week">Por Semana</option>
                    <option value="month">Por Mes</option>
                </select>
            </div>
        </label>

        <!-- Disponibilidad (por hora) -->
        <fieldset v-if="price_unit === 'hour'" class="border p-4 rounded-lg">
            <legend class="text-lg font-semibold text-black">Horario de Disponibilidad</legend>
            <div class="grid grid-cols-2 gap-4">
                <label>
                    <span>Desde:</span>
                    <input v-model="space.availability.start" type="time" class="input-field" required />
                </label>
                <label>
                    <span>Hasta:</span>
                    <input v-model="space.availability.end" type="time" class="input-field" required />
                </label>
            </div>
        </fieldset>

        <!-- Disponibilidad (por semana o mes) -->
        <fieldset v-if="price_unit === 'week' || price_unit === 'month'" class="border p-4 rounded-lg">
            <legend class="text-lg font-semibold text-black">Selecciona un período</legend>
            <VueDatePicker v-model="space.availability.dateRange" range class="input-field" />
        </fieldset>

        <!-- Métodos de Pago Aceptados -->
        <fieldset class="border p-4 rounded-lg bg-white shadow-sm space-y-4">
            <legend class="text-lg font-semibold text-gray-800 mb-2">Métodos de Pago Aceptados</legend>
            <div class="grid grid-cols-2 gap-3">
                <label class="flex items-center gap-2">
                    <input type="checkbox" v-model="space.paymentMethods" value="Efectivo" class="accent-green-600" />
                    <font-awesome-icon :icon="['fas', 'money-bill-wave']" class="text-green-600" />
                    <span class="text-gray-700">Efectivo</span>
                </label>
                <label class="flex items-center gap-2">
                    <input type="checkbox" v-model="space.paymentMethods" value="Mercado Pago"
                        @change="updatePaymentFields" class="accent-indigo-600" />
                    <font-awesome-icon :icon="['fas', 'credit-card']" class="text-indigo-600" />
                    <span class="text-gray-700">Mercado Pago</span>
                </label>
            </div>
        </fieldset>

        <!-- Datos de Wallet para Mercado Pago -->
        <fieldset v-if="space.paymentMethods.includes('Mercado Pago')" class="border p-4 rounded-lg">
            <legend class="text-lg font-semibold text-black">Datos de Wallet (Mercado Pago)</legend>
            <label class="block">
                <span class="text-lg font-semibold text-black">Correo de Mercado Pago:</span>
                <input v-model="space.walletDetails.mpEmail" type="email" class="input-field"
                    placeholder="correo@ejemplo.com" required />
            </label>
        </fieldset>

        <!-- Toggle para Publicación Activa -->
        <div class="flex items-center space-x-4">
            <span class="text-lg font-semibold text-black">Publicación Activa</span>
            <label class="switch">
                <input type="checkbox" v-model="isActive" />
                <span class="slider round"></span>
            </label>
        </div>

        <!-- Imágenes -->
        <label class="block space-y-2">
            <span class="text-lg font-semibold text-gray-800">Imágenes del espacio:</span>
            <input type="file" multiple @change="handleFileUpload"
                class="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            <div class="flex flex-wrap mt-4 gap-3">
                <img v-for="(img, index) in previewImages" :key="index" :src="img"
                    class="w-24 h-24 object-cover rounded-lg shadow-md ring-1 ring-gray-200" />
            </div>
        </label>

        <!-- Botón de envío -->
        <button type="submit" class="btn-primary">Guardar Espacio</button>
    </form>
</template>

<script setup>
import { ref, toRefs } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import api from '../services/apiService';
import FormField from '../components/FormField.vue';

const formData = ref({
    name: '',
    location: '',
    locationDetails: '',
    latitude: 0,
    longitude: 0,
    price_per_hour: 0,
    paymentMethods: [],
    walletDetails: { mpEmail: '' },
    type: '', // 'garage' | 'large_space' | 'private_parking'
    vehicle_capacities: [], // [{ type: 'car', capacity: 5 }]
    parking_type: '', // 'cubierto' | 'descubierto' | 'ninguno'
    description: '',
    status: 'active',
    images: [],
    availability: { start: '', end: '', dateRange: [] }
});

const price = ref(0);
const price_unit = ref('hour');
const previewImages = ref([]);
const selectedVehicleTypes = ref([]);
const vehicleCapacities = ref({});
const selectedFiles = ref([]);
const emit = defineEmits(["success"]);

// Opciones disponibles
const vehicleOptions = [
    { key: 'car', label: 'Auto' },
    { key: 'motorcycle', label: 'Motocicleta' },
    { key: 'bicycle', label: 'Bicicleta' },
    { key: 'van', label: 'Camioneta' },
];

const isActive = ref(true);


// Manejo de cambios
const handleVehicleTypeChange = (key) => {
    if (!selectedVehicleTypes.value.includes(key)) {
        delete vehicleCapacities.value[key];
    } else {
        vehicleCapacities.value[key] = vehicleCapacities.value[key] || 1;
    }
};

const getFormattedVehicleData = () => {
    return selectedVehicleTypes.value.map((type) => ({
        type: type,
        capacity: vehicleCapacities.value[type] || 1,
    }));
};

const handleFileUpload = (event) => {
    selectedFiles.value = [...event.target.files];
    previewImages.value = [];
    for (let file of selectedFiles.value) {
        const reader = new FileReader();
        reader.onload = (e) => previewImages.value.push(e.target.result);
        reader.readAsDataURL(file);
        console.log(file);
    }
};

const setPlace = (place) => {
    const components = place.address_components || [];

    const streetNumber = components.find(c => c.types.includes('street_number'))?.long_name || '';
    const route = components.find(c => c.types.includes('route'))?.long_name || '';
    const locality = components.find(c =>
        c.types.includes('locality') ||
        c.types.includes('sublocality')
    )?.long_name || '';
    const province = components.find(c => c.types.includes('administrative_area_level_1'))?.long_name || '';
    const country = components.find(c => c.types.includes('country'))?.long_name || '';

    // Armamos cada parte solo si existe
    const street = [route, streetNumber].filter(Boolean).join(' ');

    const parts = [street, locality, province, country].filter(Boolean);

    space.value.location = parts.join(', ');

    space.value.latitude = place.geometry.location.lat();
    space.value.longitude = place.geometry.location.lng();
};

const updateAvailabilityFields = () => {
    space.value.availability = { start: '', end: '', dateRange: [] };
};

const updatePaymentFields = () => {
    // Aquí  realizar validaciones o ajustes al cambiar métodos de pago
};

const addSpace = async () => {

    const error = validarFormulario();
    if (error) {
        alert(error);
        return;
    }

    if (selectedFiles.value.length === 0) {
        alert('Debe subir al menos una imagen del espacio');
        return;
    }
    const formData = new FormData();
    const payload = { ...space.value }; // Copia para modificar sin afectar el estado reactivo

    // Agregar vehicle_capacities y precio
    payload.vehicle_capacities = getFormattedVehicleData();
    payload.status = isActive.value ? 'active' : 'paused';
    payload.price_per_hour = calcularPrecioPorHora(price.value, price_unit.value);

    // Convertimos a JSON y lo agregamos como campo
    formData.append('data', JSON.stringify(payload));

    // Agregar imágenes
    selectedFiles.value.forEach((file, _index) => {
        formData.append('images', file);
    });

    console.log(formData);
    try {
        const response = await api.post('/spaces/create', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        showSuccessModal.value = true;
        console.log(response);
        emit('success');
        resetValues();
    } catch (error) {
        console.error('Error en el registro del espacio:', error);
    }
};

const calcularPrecioPorHora = (precio, unidad) => {
    switch (unidad) {
        case 'day': return precio / 24;
        case 'week': return precio / (24 * 7);
        case 'month': return precio / (24 * 30);
        default: return precio;
    }
};

const validarFormulario = () => {
    if (!space.value.name.trim()) return 'El nombre del espacio es obligatorio';
    if (!space.value.location) return 'Debe seleccionar una ubicación con Autocomplete';
    if (selectedVehicleTypes.value.length === 0) return 'Debe seleccionar al menos un tipo de vehículo';
    if (price.value <= 0) return 'El precio debe ser mayor a 0';
    if (price_unit.value === 'hour' && (!space.value.availability.start || !space.value.availability.end)) {
        return 'Debe completar los horarios de disponibilidad';
    }
    if ((price_unit.value === 'week' || price_unit.value === 'month') && space.value.availability.dateRange.length !== 2) {
        return 'Debe seleccionar un rango de fechas válido';
    }
    if (space.value.paymentMethods.includes('Mercado Pago') && !space.value.walletDetails.mpEmail) {
        return 'Debe ingresar el correo de Mercado Pago';
    }
    return null;
};

const resetValues = () => {
    space.value = {
        name: '',
        location: '',
        locationDetails: '',
        latitude: 0,
        longitude: 0,
        price_per_hour: 0,
        paymentMethods: [],
        walletDetails: { mpEmail: '' },
        type: '',
        vehicle_capacities: [],
        parking_type: '',
        description: '',
        status: 'active',
        images: [],
        availability: { start: '', end: '', dateRange: [] }
    };
    price.value = 0;
    price_unit.value = 'hour';
    selectedVehicleTypes.value = [];
    vehicleCapacities.value = {};
    selectedFiles.value = [];
    previewImages.value = [];
    isActive.value = true;
}

const props = defineProps({
    showSuccessModal: Object
});

const { showSuccessModal } = toRefs(props);

</script>

<style>
.bg-light {
    background-color: #f8f9fa;
}

.btn-primary {
    width: 100%;
    background-color: #007bff;
    color: #fff;
    padding: 12px;
    border-radius: 8px;
    font-weight: bold;
    text-align: center;
    transition: background 0.3s ease;
}

.btn-primary:hover {
    background-color: #0056b3;
}

.text-primary {
    color: #007bff;
}

.text-black {
    color: #000;
}

/* Estilos para el toggle switch */
.switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
}

.slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
}

input:checked+.slider {
    background-color: #007bff;
}

input:checked+.slider:before {
    transform: translateX(26px);
}

.slider.round {
    border-radius: 34px;
}

.slider.round:before {
    border-radius: 50%;
}

/* Modal transitions */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
