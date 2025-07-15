<template>
  <MainHeader />
  <div class="min-h-screen bg-secondary md:p-10" v-if="!userStore.loading">
    <div class="flex flex-col md:flex-row w-full items-start">
      <BackButton class="md:hidden" />

      <!-- Encabezado del Perfil -->
      <header class="hidden w-full md:w-1/3 md:flex flex-col justify-between items-center">
        <h1 class="w-1/3 text-4xl text-center mb-6 text-primary">Perfil</h1>
        <div class="w-11/12 px-4 space-y-1">
          <button @click="activeSection = 'datos'"
            :class="['w-full py-2 rounded text-center', activeSection === 'datos' ? 'bg-gray-200' : 'hover:bg-gray-200']">
            Datos personales
          </button>
          <button @click="activeSection = 'reservas'"
            :class="['w-full py-2 rounded text-center', activeSection === 'reservas' ? 'bg-gray-200' : 'hover:bg-gray-200']">
            Reservaciones
          </button>
          <button @click="activeSection = 'publicaciones'"
            :class="['w-full py-2 rounded text-center', activeSection === 'publicaciones' ? 'bg-gray-200' : 'hover:bg-gray-200']">
            Publicaciones
          </button>
        </div>
        <BackButton />
      </header>

      <transition name="fade-step" mode="out-in">
        <section v-if="activeSection === 'datos'" key="datos"
          class="w-full md:w-2/3 bg-white p-12 rounded-lg shadow-lg mb-8">
          <div class="flex flex-col md:flex-row items-center justify-between gap-6">
            <div class="flex items-center justify-around gap-4 flex-wrap">
              <button @click="cambiarFoto" class="relative flex items-center px-4 py-2 rounded-full">
                <font-awesome-icon icon="camera" class="mr-2 absolute bottom-2 right-4 text-primary" />
                <img :src="usuario.profile_picture || defaultProfilePicture" alt="Foto de perfil" @click="cambiarFoto"
                  class="w-24 h-24 object-cover rounded-full shadow-lg" />
              </button>
              <div class="flex flex-col">
                <h2 class="text-2xl font-bold">
                  {{ usuario.name }} {{ usuario.last_name }}
                </h2>
                <p class="text-gray-600 flex items-center">
                  <font-awesome-icon icon="envelope" class="mr-2" />
                  {{ usuario.email }}
                </p>
                <p class="text-gray-600 flex items-center">
                  <font-awesome-icon icon="id-card" class="mr-2" />
                  DNI: {{ usuario.dni }}
                </p>
              </div>
              <button @click="verifyToken('/quit')" class="p-2 text-red-600 md:hidden border-2 rounded-xl hover:border-red-600">
                Cerrar sesión
              </button>
            </div>
            <div>
            </div>
          </div>

          <!-- Formulario de Datos Personales -->
          <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-1">
            <FormField v-model="usuario.name" label="NOMBRE" type="text" required />
            <FormField v-model="usuario.last_name" label="APELLIDO" type="text" required />
            <FormField v-model="usuario.email" label="EMAIL" type="text" required />
            <FormField v-model="usuario.dni" label="DOCUMENTO" type="text" required />
            <FormFieldAutocomplete v-model="usuario.address" label="DIRECCIÓN" class="md:col-span-2" />
          </div>

          <!-- Datos Financieros -->
          <div class="mt-8">
            <div class="flex flex-row items-center justify-between">
              <h2 class="text-2xl font-bold text-primary flex items-center">
                <font-awesome-icon icon="wallet" class="mr-2" />
                Datos Financieros
              </h2>
              <img src="../assets/logo-mercadopago.png" alt="" class="w-28">
            </div>
            <p class="text-gray-600 mb-4">
              Coloca el mismo correo que tu cuenta de MercadoPago para activar la wallet
            </p>
            <FormField v-model="usuario.email" label="EMAIL MERCADOPAGO" type="text" required />
          </div>

          <!-- Botón para Guardar Todos los Cambios -->
          <button @click="guardarTodo"
            class="w-full bg-accent mt-6 text-white p-4 rounded-lg text-lg font-bold shadow-md hover:shadow-xl transition-all">
            <font-awesome-icon icon="save" class="mr-2" />
            Guardar Cambios
          </button>
        </section>

        <ReservationHistory v-else-if="activeSection === 'reservas'" key="reservas" :reservations="reservas" />

        <PublicationHistory v-else-if="activeSection === 'publicaciones'" key="publicaciones"
          :publications="publicaciones" />

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
            <button @click="closeSuccessModal"
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
  </div>
  <div v-else class="min-h-screen flex items-center justify-center">
    <img :src="loadIcon" alt="" class="max-w-10">
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ReservationHistory from '../components/ReservationHistory.vue';
import PublicationHistory from '../components/PublicationHistory.vue';
import { useUserStore } from '../store/userStore';
import api from '../services/apiService';
import defaultProfilePicture from '../assets/user_icon_primary.png';
import loadIcon from "../assets/load-icon_primary.svg";
import BackButton from '../components/BackButton.vue';
import MainHeader from '../components/MainHeader.vue';
import FormOption from '../components/FormOption.vue';
import FormField from '../components/FormField.vue';
import FormFieldAutocomplete from '../components/FormFieldAutocomplete.vue';
import { useVerifyToken } from '../logic/useVerifyToken';

const userStore = useUserStore();
const inputFoto = ref<HTMLInputElement | null>(null);

const { verifyToken, isSessionInvalid } = useVerifyToken();

const usuario = computed(() => userStore.user || {
  id: "",
  profile_picture: defaultProfilePicture,
  name: "",
  last_name: "",
  email: "",
  dni: "",
  address: "",
  phone: "",
  walletEmail: ""
});

const reservas = ref([]);
const publicaciones = ref([]);

const showSuccessModal = ref(false);
const showErrorModal = ref(false);
const errorMessage = ref('');
const router = useRouter();
const activeSection = ref<'datos' | 'reservas' | 'publicaciones'>('datos');

onMounted(async () => {
  await userStore.fetchUser();
  console.log(usuario.value.profile_picture);
});

const cambiarFoto = (): void => {
  //inputFoto.value?.click();
};

const guardarTodo = async (): Promise<void> => {
  console.log(usuario.value);
  try {
    const response = await api.put(`/users/update/${usuario.value.id}`, usuario.value, {
      withCredentials: true
    }
    );
    userStore.setUser(response.data);
    showSuccessModal.value = true;
  } catch (error) {
    console.error("Error al guardar los cambios", error);
    errorMessage.value = "Hubo un error al guardar los cambios. Por favor, inténtalo nuevamente.";
    showErrorModal.value = true;
  }
};

const setAddress = (place: any): void => {
  if (userStore.user) {
    userStore.user.address = place.formatted_address || "";
  }
};

const closeSuccessModal = () => {
  router.push('/dashboard');
  showSuccessModal.value = false;

};

const closeErrorModal = () => {
  showErrorModal.value = false;
};
</script>

<style scoped>
/* Transición para el modal */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
