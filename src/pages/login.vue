<template>
    <div class="flex items-center justify-center min-h-screen bg-primary">
      <div class="bg-white p-8 rounded-lg shadow-lg w-96">
        <img src="/src/assets/logo.jpeg" alt="HayLugAR Logo" class="mx-auto mb-4 w-24" />
        <h1 class="text-2xl font-bold text-center text-dark">Iniciar Sesión</h1>
        <form @submit.prevent="login">
          <input v-model="email" type="email" placeholder="Correo electrónico" class="w-full mt-4 p-2 border rounded" required />
          <input v-model="password" type="password" placeholder="Contraseña" class="w-full mt-4 p-2 border rounded" required />
          <button type="submit" class="w-full mt-6 bg-accent text-dark py-2 rounded">Ingresar</button>
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
  
  const email = ref('');
  const password = ref('');
  const router = useRouter();
  
  const login = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/signin', {
        email: email.value,
        password_hash: password.value,
      }, { 
        withCredentials: true 
      });
      console.log(response.data)
      if (response) {
        localStorage.setItem('token', response.data.token);
        router.push('/dashboard');
      } else {
        alert('Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Ocurrió un error. Inténtalo de nuevo.');
    }
  };
  </script>