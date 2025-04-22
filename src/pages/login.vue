<template>
  <div class="flex items-center justify-center min-h-screen bg-secondary">
    <div class="bg-white p-8 rounded-lg shadow-xl w-96">
      <img src="/src/assets/logo.png" alt="HayLugAR Logo" class="mx-auto mb-4 w-24" />
      <h1 class="text-2xl font-bold text-center text-primary">Iniciar Sesión</h1>
      <div v-if="credentialError" class="bg-red-200 w-full py-1 rounded-md text-center text-red-700 border border-red-700">{{ messaggeError }}</div>
      <form @submit.prevent="login">
        <input v-model="email" type="email" placeholder="Correo electrónico" class="w-full mt-4 p-2 border rounded"
          required />
        <input v-model="password" type="password" placeholder="Contraseña" class="w-full mt-4 p-2 border rounded"
          required />
        <button type="submit" class="flex justify-center w-full mt-6 bg-accent text-dark py-2 rounded">
          <img v-if="cargando" :src="loadIcon" alt="" class="max-w-6">
          <span v-else>Ingresar</span>
        </button>
      </form>
      <p class="mt-4 text-center text-sm">¿No tienes una cuenta?
        <router-link to="/register" class="text-primary font-bold">Regístrate aquí</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useUserStore } from '../store/userStore';
import loadIcon from "../assets/load-icon_secondary.svg";

const email = ref('');
const password = ref('');
const router = useRouter();
const cargando = ref(false);
const credentialError = ref(false);
const messaggeError = ref('');

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
    const response = await axios.post('http://localhost:3000/api/auth/signin', {
      email: email.value,
      password_hash: password.value,
    }, {
      validateStatus: (status) => status < 500 // Aceptar códigos 400 como respuestas normales
    });
    console.log(response)
    if (response.data.token) {
      const userStore = useUserStore();
      userStore.setToken(response.data.token);
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