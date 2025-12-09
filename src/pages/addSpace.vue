<template>

  <div class="w-full fixed flex justify-end p-4 sm:hidden top-0 left-0 z-50">
    <BackButton />
  </div>

  <MainHeader />

  <!-- MENÚ INFERIOR MOBILE -->
  <MobileButtonNav @toggle-map="toggleMap" @navigate="(path) => router.push(path)" class="md:hidden"
    :showMap="showMap" />

  <div class="relative w-full min-h-screen mx-auto pt-20 md:pt-28 py-4 md:py-6">
    <!-- Instrucciones iniciales -->
    <transition name="fade-step" mode="out-in">
      <div :key="currentStep">
        <!-- Paso 0: Instrucciones para publicar un espacio -->
        <div v-if="currentStep === 0" class="w-full flex flex-col items-center text-white">

          <!-- HERO -->
          <div class="w-full text-center px-6 pt-6 pb-10 md:pb-16 bg-gradient-to-b
           from-[#0D1B2A] via-[#112331] to-transparent">
            <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
              Publicá tu espacio en <span class="text-primary">HayLugar</span>
            </h1>

            <p class="text-gray-300 max-w-xl mx-auto text-base md:text-lg leading-relaxed">
              Conectá tu espacio disponible con miles de automovilistas.
              Publicar es simple, rápido y completamente gratis.
            </p>
          </div>

          <!-- CONTENIDO PRINCIPAL -->
          <div class="max-w-6xl w-full grid xl:grid-cols-2 gap-8 px-6 md:px-10">

            <!-- Ilustración + Glow -->
            <div class="hidden xl:flex justify-center items-center relative">
              <div class="absolute w-72 h-72 bg-blue-500/20 blur-3xl rounded-full"></div>

              <img src="../assets/add-space_etapa-1.png"
                class="relative w-4/5 rounded-2xl shadow-[0_0_25px_rgba(0,0,0,0.45)] border border-white/10"
                alt="Ilustración del espacio de estacionamiento">
            </div>

            <!-- Tarjetas -->
            <div class="flex flex-col gap-6">

              <!-- CARD 1 -->
              <div class="flex items-start gap-5 bg-white/5 backdrop-blur-xl 
               p-5 rounded-2xl border border-white/10 shadow-md 
               hover:bg-white/10 hover:shadow-xl transition">
                <div class="bg-primary/20 text-primary p-3 rounded-xl text-3xl">
                  <font-awesome-icon icon="map-marker-alt" />
                </div>
                <div>
                  <h2 class="font-semibold text-xl mb-1">
                    Contanos sobre tu espacio
                  </h2>
                  <p class="text-gray-300 text-sm">
                    Ingresá dirección, tipo de superficie y qué vehículos pueden estacionar.
                  </p>
                </div>
              </div>

              <!-- CARD 2 -->
              <div class="flex items-start gap-5 bg-white/5 backdrop-blur-xl
               p-5 rounded-2xl border border-white/10 shadow-md
               hover:bg-white/10 hover:shadow-xl transition">
                <div class="bg-primary/20 text-primary p-3 rounded-xl text-3xl">
                  <font-awesome-icon icon="info-circle" />
                </div>
                <div>
                  <h2 class="font-semibold text-xl mb-1">
                    Agregá información útil
                  </h2>
                  <p class="text-gray-300 text-sm">
                    Subí fotos, horarios disponibles, croquis, tarifas y formas de pago.
                  </p>
                </div>
              </div>

              <!-- CARD 3 -->
              <div class="flex items-start gap-5 bg-white/5 backdrop-blur-xl
               p-5 rounded-2xl border border-white/10 shadow-md
               hover:bg-white/10 hover:shadow-xl transition">
                <div class="bg-primary/20 text-primary p-3 rounded-xl text-3xl">
                  <font-awesome-icon icon="check-circle" />
                </div>
                <div>
                  <h2 class="font-semibold text-xl mb-1">
                    Revisá y publicá
                  </h2>
                  <p class="text-gray-300 text-sm">
                    Confirmá los datos y tu espacio estará disponible al instante.
                  </p>
                </div>
              </div>

              <!-- BOTÓN -->
              <div class="flex justify-start mt-4">
                <button @click="nextFirstStep" class="px-8 py-3 rounded-xl font-semibold text-white 
                 bg-primary shadow-lg shadow-primary/30
                 hover:bg-primary/90 hover:shadow-primary/50
                 transition-all w-full md:w-auto">
                  Comenzar
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Formulario por pasos -->
        <div v-else-if="currentStep === 1" class="">
          <transition name="fade-step" mode="out-in">
            <component :is="currentComponent" :key="step" v-model="spaceData" @next="nextStep" @prev="prevStep"
              @submit="addSpace" />
          </transition>
        </div>
      </div>
    </transition>

    <!-- Modal de éxito -->
    <StatusModal :visible="showSuccessModal" type="success" title="Excelente!"
      message="Publicaste correctamente tu espacio en HayLugar." :icon="logo" @confirm="closeSuccesModal" />

    <!-- Modal de error -->
    <StatusModal :visible="showErrorModal" type="error" title="¡Atención!" :message="errorMessage" :icon="logo"
      @confirm="showErrorModal = false" />
  </div>

  <!-- ===== FOOTER ===== -->
  <footer class="mt-10 border-t border-white/10 bg-[#0D1B2A]/80 backdrop-blur-xl">
    <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between 
              gap-4 px-6 py-8 text-[#B0BEC5] text-sm">

      <!-- Branding -->
      <div class="flex items-center gap-2">
        <span class="text-white font-semibold tracking-wide">HayLugar</span>
        <span class="text-xs text-[#78909C]">© {{ new Date().getFullYear() }}</span>
      </div>

      <!-- Links -->
      <div class="flex gap-6">
        <router-link to="/PrivacyPolicy" class="hover:text-white transition-colors duration-200">
          Política de Privacidad
        </router-link>

        <router-link to="/termsConditions" class="hover:text-white transition-colors duration-200">
          Términos y Condiciones
        </router-link>
      </div>

      <!-- Extra -->
      <div class="text-xs text-[#78909C]">
        Movilidad inteligente
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, computed } from 'vue';
import '@vuepic/vue-datepicker/dist/main.css';
import { useRouter } from 'vue-router';
import MainHeader from '../components/layout/header/MainHeader.vue';
import api from '../services/apiService';
import Etapa1 from '../components/pages/addSpacePage/Etapa1.vue';
import Etapa2 from '../components/pages/addSpacePage/Etapa2.vue';
import Etapa3 from '../components/pages/addSpacePage/Etapa3.vue';
import Etapa4 from '../components/pages/addSpacePage/Etapa4.vue';
import Etapa5 from '../components/pages/addSpacePage/Etapa5.vue';
import BackButton from '../components/common/BackButton.vue';
import StatusModal from '../components/pages/addSpacePage/StatusModal.vue';
import logo from "../assets/logo.png";
import { useSpaceStore } from "../store/spaceStore";
import MobileButtonNav from '../components/layout/MobileButtonNav.vue';

const router = useRouter();
const showSuccessModal = ref(false);
const showErrorModal = ref(false);
const errorMessage = ref('');
const currentStep = ref(0); // 0 = instrucciones, 1 = formulario
const step = ref(1);
const emit = defineEmits(["success"]);

const spaceStore = useSpaceStore()


const spaceData = ref({
  name: '',
  location: '',
  locationDetails: '',
  latitude: 0,
  longitude: 0,
  paymentMethods: [],
  walletDetails: { mpEmail: '' },
  type: '', // 'garage' | 'large_space' | 'private_parking'
  vehicle_capacities: [], // [{ type: 'car', capacity: 5, price: 1500 }]
  parking_type: '', // 'cubierto' | 'descubierto' | 'ninguno'
  description: '',
  status: 'active',
  images: [],
  reservation_period: '', // 'hour' | 'day' | 'week' | 'month'
  availability: { start: '', end: '', dateRange: [] }
});

const components = {
  1: Etapa1,
  2: Etapa2,
  3: Etapa3,
  4: Etapa4,
  5: Etapa5
};

const currentComponent = computed(() => components[step.value])

function nextStep() {
  if (step.value < 5) step.value++
};

function prevStep() {
  if (step.value > 1) step.value--
};

const addSpace = async () => {

  if (spaceData.value.images.length === 0) {
    alert('Debe subir al menos una imagen del espacio');
    return;
  }

  // Preparar FormData
  const formData = new FormData();
  const payload = { ...spaceData.value };

  // Agregar vehicle_capacities y precio
  payload.status = 'active';
  formData.append('data', JSON.stringify(payload));

  // Agregar imágenes
  spaceData.value.images.forEach((file, _index) => {
    formData.append('images', file);
  });

  try {
    const response = await api.post('/spaces/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    const newSpace = response.data.space;
    console.log(newSpace);
    spaceStore.addSpaceToStore(newSpace);

    showSuccessModal.value = true;
    emit('success');
    resetValues();
  } catch (error) {
    showErrorModal.value = true;
    errorMessage.value = 'Hubo un error al registrar el espacio. Por favor, intentá nuevamente.';
    console.error('Error en el registro del espacio:', error);
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
  spaceData.value = {
    name: '',
    location: '',
    locationDetails: '',
    latitude: 0,
    longitude: 0,
    paymentMethods: [],
    walletDetails: { mpEmail: '' },
    type: '', // 'garage' | 'large_space' | 'private_parking'
    vehicle_capacities: [], // [{ type: 'car', capacity: 5, price: 1500 }]
    parking_type: '', // 'cubierto' | 'descubierto' | 'ninguno'
    description: '',
    status: 'active',
    images: [],
    reservation_period: '', // 'hour' | 'day' | 'week' | 'month'
    availability: { start: '', end: '', dateRange: [] }
  };
}


const closeSuccesModal = async () => {
  showSuccessModal.value = false;
  await spaceStore.fetchSpaces(true);
  router.push('/dashboard');
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
