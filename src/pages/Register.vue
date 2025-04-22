<template>
  <div class="flex items-center justify-center min-h-screen bg-secondary">
    <div class="bg-white p-8 rounded-lg shadow-xl w-96">
      <img src="/src/assets/logo.png" alt="HayLugAR Logo" class="mx-auto mb-4 w-24" />
      <h1 class="text-2xl font-bold text-center text-primary">Registrar nuevo usuario</h1>
      <div v-if="credentialError" class="bg-red-200 w-full py-1 rounded-md text-center text-red-700 border border-red-700">{{ messaggeError }}</div>
      <form @submit.prevent="register">
        <!-- <select v-model="role" class="w-full mt-4 p-2 border rounded">
            <option value="user">Usuario</option>
            <option value="owner">Propetario</option>
          </select> -->
        <input v-model="name" type="text" placeholder="Nombre" class="w-full mt-4 p-2 border rounded" required />
        <input v-model="email" type="email" placeholder="Correo electrónico" class="w-full mt-4 p-2 border rounded"
          required />
        <input v-model="password_hash" type="password" placeholder="Contraseña" class="w-full mt-4 p-2 border rounded"
          required />
        <button type="submit" class="flex justify-center w-full mt-6 bg-accent text-dark py-2 rounded">
          <img v-if="cargando" :src="loadIcon" alt="" class="max-w-6">
          <span v-else>Registrarse</span>
        </button>
      </form>
      <p class="mt-4 text-center text-sm">¿Ya tienes una cuenta?
        <router-link to="/login" class="text-primary font-bold">Inicia sesión aquí</router-link>
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

const name = ref('');
const email = ref('');
const password_hash = ref('');
const role = ref('user');
const router = useRouter();
const cargando = ref(false);
const credentialError = ref(false);
const messaggeError = ref('');

const register = async () => {
  if (!name.value || !email.value || !password_hash.value || !role.value) {
    messaggeError.value = 'Por favor complete todos los campos';
    credentialError.value = true;
    return;
  }
  cargando.value = true;
  credentialError.value = false;
  messaggeError.value = '';
  try {
    const response = await axios.post('http://localhost:3000/api/auth/signup', {
      name: name.value,
      email: email.value,
      password_hash: password_hash.value,
      role: role.value,
    });

    console.log(response);
    if (response.data.token) {
      const userStore = useUserStore();
      userStore.setToken(response.data.token);
      router.push('/dashboard');
    } else {
      credentialError.value = true;
      messaggeError.value = response.data.error || 'Error en el ingreso de datos';
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