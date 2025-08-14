<template>
    <MainHeader />
    <BackButton class="md:hidden" />
    <div class="relative w-full h-full mx-auto py-14">
        <!-- Instrucciones iniciales -->
        <transition name="fade-step" mode="out-in">
            <div :key="currentStep">
                <!-- Paso 0: Instrucciones -->
                <div v-if="currentStep === 0" class="rounded-lg border-gray-300">
                    <header>
                        <h1 class="text-3xl font-bold text-center text-primary mb-8 border-b md:border-none p-2">
                            Registrá tu vehículo y comenzá a disfrutar de HayLugar
                        </h1>
                    </header>

                    <div class="grid xl:grid-cols-2 gap-4 items-center w-11/12 mx-auto">
                        <!-- Tarjetas de instrucciones -->
                        <div class="flex flex-col gap-6 px-4 xl:px-12">
                            <!-- Tarjeta 1 -->
                            <div
                                class="flex items-start gap-4 p-4 border border-gray-300 rounded-lg shadow-sm bg-white hover:shadow-md transition">
                                <div class="text-primary text-3xl">
                                    🚗
                                </div>
                                <div>
                                    <h2 class="font-semibold text-xl text-black mb-1">Tipos de vehículos</h2>
                                    <p class="text-gray-700">Podés seleccionar camioneta, automóvil, motocicleta,
                                        bicicleta o monopatín.</p>
                                </div>
                            </div>

                            <!-- Tarjeta 2 -->
                            <div
                                class="flex items-start gap-4 p-4 border border-gray-300 rounded-lg shadow-sm bg-white hover:shadow-md transition">
                                <div class="text-primary text-3xl">
                                    📝
                                </div>
                                <div>
                                    <h2 class="font-semibold text-xl text-black mb-1">Detalles del vehículo</h2>
                                    <p class="text-gray-700">Te solicitaremos datos como patente (no aplica a
                                        bicicletas), marca, modelo, y color.</p>
                                </div>
                            </div>

                            <!-- Tarjeta 3 -->
                            <div
                                class="flex items-start gap-4 p-4 border border-gray-300 rounded-lg shadow-sm bg-white hover:shadow-md transition">
                                <div class="text-primary text-3xl">
                                    📍
                                </div>
                                <div>
                                    <h2 class="font-semibold text-xl text-black mb-1">Comenzá a usar la app</h2>
                                    <p class="text-gray-700">Una vez confirmado tu vehículo, ya podés usar nuestros
                                        servicios para encontrar tu próximo estacionamiento.</p>
                                </div>
                            </div>

                            <!-- Botón -->
                            <div class="flex justify-end md:mt-6">
                                <button @click="nextFirstStep"
                                    class="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all w-full md:w-auto">
                                    Comenzar
                                </button>
                            </div>
                        </div>

                        <!-- Imagen -->
                        <img src="../assets/image-add_vehicle.png"
                            class="max-w-100 max-w-[29rem] hidden xl:block mx-auto rounded-xl shadow-2xl shadow-gray-400/60"
                            alt="Ilustración de registro de vehículo">
                    </div>
                </div>

                <!-- Formulario por pasos -->
                <div v-else-if="currentStep === 1" class="">
                    <transition name="fade-step" mode="out-in">
                        <component :is="currentComponent" :key="step" v-model="vehicleData" @next="nextStep"
                            @prev="prevStep" @submit="addVehicle" />
                    </transition>
                </div>
            </div>
        </transition>
    </div>

    <!-- Modal de Éxito -->
    <transition name="fade">
        <div v-if="showSuccessModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div class="bg-white rounded-lg shadow-xl p-8 max-w-md w-full transform transition-all scale-95">
                <div class="flex flex-col items-center">
                    <img src="/src/assets/logo.jpeg" alt="Logo" class="w-20 h-20 mb-4" />
                    <h2 class="text-3xl font-bold text-primary mb-2">¡Éxito!</h2>
                    <p class="text-lg text-gray-700 text-center mb-6">Los cambios se han guardado correctamente.</p>
                    <button @click="closeSuccesModal"
                        class="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                        Continuar
                    </button>
                </div>
            </div>
        </div>
    </transition>

    <!-- Modal de Error -->
    <transition name="fade">
        <div v-if="showErrorModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div class="bg-white rounded-lg shadow-xl p-8 max-w-md w-full transform transition-all scale-95">
                <div class="flex flex-col items-center">
                    <img src="/src/assets/logo.jpeg" alt="Logo" class="w-20 h-20 mb-4" />
                    <h2 class="text-3xl font-bold text-red-600 mb-2">¡Error!</h2>
                    <p class="text-lg text-gray-700 text-center mb-6">{{ errorMessage }}</p>
                    <button @click="closeErrorModal"
                        class="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-800 transition">
                        Intentar de Nuevo
                    </button>
                </div>
            </div>
        </div>
    </transition>
</template>



<script setup>
import { ref, computed } from 'vue';
import '@vuepic/vue-datepicker/dist/main.css';
import { useRouter } from 'vue-router';
import MainHeader from '../components/layout/header/MainHeader.vue';
import api from '../services/apiService';
import Etapa1 from '../components/pages/addVehiclePage/Etapa1.vue';
import Etapa2 from '../components/pages/addVehiclePage/Etapa2.vue';
import Etapa3 from '../components/pages/addVehiclePage/Etapa3.vue';
import Etapa4 from '../components/pages/addVehiclePage/Etapa4.vue';
import BackButton from '../components/common/BackButton.vue';

const router = useRouter();
const currentStep = ref(0); // 0 = instrucciones, 1 = formulario
const step = ref(1);
const emit = defineEmits(["success"]);

const showSuccessModal = ref(false);
const showErrorModal = ref(false);
const errorMessage = ref('');

const vehicleData = ref({
    license_plate: null,
    type: '',
    brand: '',
    model: '',
    color: '',
});

const components = {
    1: Etapa1,
    2: Etapa2,
    3: Etapa3,
    4: Etapa4
};

const currentComponent = computed(() => components[step.value])

function nextStep() {
    if (step.value < 5) step.value++
    console.log(vehicleData.value);
};

function prevStep() {
    if (step.value > 1) step.value--
};

const addVehicle = async () => {

    console.log(vehicleData.value);
    const payload = { ...vehicleData.value }; // Copia para modificar sin afectar el estado reactivo
    console.log(payload);

    try {
        const response = await api.post('/vehicles/create', payload, {
            withCredentials: true
        });
        showSuccessModal.value = true;
        console.log(response);
        emit('success');
        resetValues();
    } catch (error) {
        if (error.response && error.response?.data?.message) {
            console.error('Error al guardar los vehículos', error);
            errorMessage.value = error.response.data.message;
            showErrorModal.value = true;
        } else {
            console.error('Error al guardar los vehículos', error);
            errorMessage.value = 'Error al actualizar el vehículo.';
            showErrorModal.value = true;
        }
    }
};

// const validarFormulario = () => {
//   if (!space.value.name.trim()) return 'El nombre del espacio es obligatorio';
//   if (!space.value.location) return 'Debe seleccionar una ubicación con Autocomplete';
//   if (selectedVehicleTypes.value.length === 0) return 'Debe seleccionar al menos un tipo de vehículo';
//   if (price.value <= 0) return 'El precio debe ser mayor a 0';
//   if (price_unit.value === 'hour' && (!space.value.availability.start || !space.value.availability.end)) {
//     return 'Debe completar los horarios de disponibilidad';
//   }
//   if ((price_unit.value === 'week' || price_unit.value === 'month') && space.value.availability.dateRange.length !== 2) {
//     return 'Debe seleccionar un rango de fechas válido';
//   }
//   if (space.value.paymentMethods.includes('Mercado Pago') && !space.value.walletDetails.mpEmail) {
//     return 'Debe ingresar el correo de Mercado Pago';
//   }
//   return null;
// };

const resetValues = () => {
    vehicleData.value = {
        license_plate: null,
        type: '',
        brand: '',
        model: '',
        color: '',
    }
}


const closeSuccesModal = () => {
    showSuccessModal.value = false;
    router.push('/dashboard');
};

const closeErrorModal = () => {
  showErrorModal.value = false;
};

const nextFirstStep = () => {
    currentStep.value = 1;
};
</script>

<style>
/* .transition-transform {
  transition: transform 0.7s ease-in-out;
}

.bg-light {
  background-color: #f8f9fa;
}

.input-field {
  width: 100%;
  padding: 12px;
  border: 2px solid #007bff;
  border-radius: 8px;
  background-color: #ffffff;
  font-size: 16px;
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
} */

/* Estilos para el toggle switch */
/* .switch {
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
} */

/* Modal transitions */
.fade-enter-active,
.fade-leave-active {
    transition: all 0.10s ease;
}

.fade-enter-from {
    opacity: 0;
    transform: scale(0.9);
}

.fade-enter-to {
    opacity: 1;
    transform: scale(1);
}

.fade-leave-from {
    opacity: 1;
    transform: scale(1);
}

.fade-leave-to {
    opacity: 0;
    transform: scale(0.9);
}
</style>
