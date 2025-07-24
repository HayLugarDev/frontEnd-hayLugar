<template>
  <div class="min-h-screen bg-secondary flex flex-col">
    <MainHeader />
    <BackButton class="md:hidden" />
    <div class="flex-grow flex items-start justify-center bg-primary">
      <div
        class="bg-white p-2 md:rounded-xl shadow-2xl border-2 w-full min-h-screen md:min-h-max md:w-2/3 lg:w-1/3 md:mt-20 py-12 md:py-2">
        <h1 class="text-md text-center border-b-2 py-2">Inicia sesión o registrate</h1>
        <div class="px-8 py-2">
          <div v-if="credentialError"
            class="bg-red-200 w-full py-1 rounded-md text-center text-red-700 border border-red-700">{{ messaggeError
            }}
          </div>
          <h1 class="text-xl text-start my-4">Te damos la bienvenida a HayLugar</h1>
          <div class="space-y-6 max-w-md mx-auto">
            <form @submit.prevent="login" class="space-y-6">
              <!-- Email -->
              <div class="relative">
                <input v-model="email" type="email" id="email" required @focus="isFocused.email.value = true"
                  @blur="isFocused.email.value = false"
                  class="peer w-full px-4 pt-5 pb-2 border border-gray-300 rounded-md text-base placeholder-transparent focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200" />
                <label :class="[
                  'absolute left-4 text-gray-500 origin-[0] transform transition-all duration-200 pointer-events-none',
                  email || isFocused.email.value
                    ? 'scale-75 -translate-y-1'
                    : 'scale-100 translate-y-4'
                ]">
                  Correo electrónico
                </label>
              </div>

              <!-- Contraseña -->
              <div class="relative">
                <input v-model="password" type="password" id="password" required
                  @focus="isFocused.password.value = true" @blur="isFocused.password.value = false"
                  class="peer w-full px-4 pt-5 pb-2 border border-gray-300 rounded-md text-base placeholder-transparent focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200" />
                <label :class="[
                  'absolute left-4 text-gray-500 origin-[0] transform transition-all duration-200 pointer-events-none',
                  password || isFocused.password.value
                    ? 'scale-75 -translate-y-1'
                    : 'scale-100 translate-y-4'
                ]">
                  Contraseña
                </label>
              </div>

              <!-- Botón -->
              <button type="submit" class="flex justify-center w-full bg-accent text-dark py-2 rounded-md">
                <img v-if="cargando" :src="loadIcon" alt="Cargando" class="w-6 h-6" />
                <span class="text-white" v-else>Continuar</span>
              </button>
            </form>
            
            <!-- Botón de Google -->
            <GoogleLogin />
          </div>
        </div>
        <p class="my-4 text-center text-sm">¿No tienes una cuenta?
          <router-link to="/register" class="text-primary font-bold">Regístrate aquí</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/apiService';
import { useUserStore } from '../store/userStore';
import loadIcon from "../assets/load-icon_secondary.svg";
import MainHeader from '../components/layout/header/MainHeader.vue';
import GoogleLogin from '../components/layout/GoogleLogin.vue';
import BackButton from '../components/common/BackButton.vue';

const email = ref('');
const password = ref('');
const router = useRouter();
const cargando = ref(false);
const credentialError = ref(false);
const messaggeError = ref('');

const isFocused = {
  email: ref(false),
  password: ref(false)
}

const login = async () => {
  if (!email.value || !password.value) {
    messaggeError.value = 'Por favor complete todos los campos';
    credentialError.value = true;
    return;
  }
  cargando.value = true;
  credentialError.value = false;
  messaggeError.value = '';

  try {
    const response = await api.post('/auth/signin', {
      email: email.value,
      password_hash: password.value,
    }, {
      validateStatus: (status) => status < 500 // Aceptar códigos 400 como respuestas normales
    });
    console.log(response)
    if (response.data.token) {
      const userStore = useUserStore();
      userStore.setUser(response.data.user);
      router.push('/dashboard');
    } else {
      credentialError.value = true;
      messaggeError.value = response.data.error || 'Credenciales incorrectas';
    }
  } catch (error) {
    credentialError.value = true;
    if (error.response) {
      // Error de servidor (500, etc.)
      messaggeError.value = error.response.data.error || 'Error en el servidor';
    } else if (error.request) {

      messaggeError.value = 'No se pudo conectar al servidor';
    } else {
      messaggeError.value = 'Error en la solicitud';
    }
  } finally {
    cargando.value = false;
  }
};
</script>
