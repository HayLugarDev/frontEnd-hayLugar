<template>
    <div class="flex items-center justify-center min-h-screen bg-primary">
      <div class="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 class="text-2xl font-bold text-center text-dark">Registro</h1>
        <form @submit.prevent="register">
          <select v-model="role" class="w-full mt-4 p-2 border rounded">
            <option value="user">Usuario</option>
            <option value="owner">Propetario</option>
          </select>
          <input v-model="name" type="text" placeholder="Nombre completo" class="w-full mt-4 p-2 border rounded" required />
          <input v-model="email" type="email" placeholder="Correo electrónico" class="w-full mt-4 p-2 border rounded" required />
          <input v-model="password_hash" type="password" placeholder="Contraseña" class="w-full mt-4 p-2 border rounded" required />
          <button type="submit" class="w-full mt-6 bg-accent text-dark py-2 rounded">Registrarse</button>
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
  
  const name = ref('');
  const email = ref('');
  const password_hash = ref('');
  const role = ref('user');
  const router = useRouter();
  
  const register = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/signup', {
        name: name.value,
        email: email.value,
        password_hash: password_hash.value,
        role: role.value,
      });
      
      console.log(response)
      router.push('/dashboard');
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      alert('Ocurrió un error. Inténtalo de nuevo.');
    }
  };
  </script>