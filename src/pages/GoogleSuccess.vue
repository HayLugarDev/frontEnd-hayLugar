<template>
    <div class="min-h-screen flex items-center justify-center bg-secondary">
        <div class="text-center space-y-4">
            <p class="text-lg text-gray-700">Iniciando sesión con Google...</p>
            <img :src=loadIcon alt="Cargando" class="w-10 h-10 mx-auto animate-spin" />
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../store/userStore';
import loadIcon from "../assets/load-icon_secondary.svg";
import api from '../services/apiService';

const router = useRouter();
const userStore = useUserStore();

onMounted(async () => {
  try {
    const res = await api.get('/auth/google-session', { withCredentials: true });
    if (res.data.token) {
      userStore.setUser(res.data.user);
      router.push('/dashboard');
    }
  } catch (error) {
    console.error('Error verificando sesión Google:', error);
    router.push('/login');
  }
});
</script>
