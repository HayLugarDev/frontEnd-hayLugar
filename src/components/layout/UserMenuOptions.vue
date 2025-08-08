<template>
  <ul class="flex flex-col divide-y divide-gray-200 text-gray-700 text-3xl md:text-base">
    <li v-if="route.path !== '/dashboard'" @click="$emit('navigate', '/dashboard')" class="menu-item">
      <font-awesome-icon icon="house" /> <span>Inicio</span>
    </li>
    <li v-if="!user" @click="$emit('navigate', '/register')" class="menu-item">
      <font-awesome-icon icon="user-plus" /> <span>Registrarse</span>
    </li>
    <li v-if="!user" @click="$emit('navigate', '/login')" class="menu-item">
      <font-awesome-icon icon="right-to-bracket" /> <span>Iniciar sesión</span>
    </li>
    <li v-if="user" @click="$emit('navigate', '/profile')" class="menu-item">
      <font-awesome-icon icon="user" /> <span>Mi Perfil</span>
    </li>
    <li @click="$emit('navigate', '/add-space')" class="menu-item">
      <font-awesome-icon icon="plus-circle" /> <span>Publica tu espacio</span>
    </li>
    <li v-if="user" @click="$emit('navigate', '/wallet')" class="menu-item">
      <font-awesome-icon icon="wallet" /> <span>Wallet</span>
    </li>
    <li @click="$emit('navigate', '/help')" class="menu-item">
      <font-awesome-icon icon="circle-question" /> <span>Ayuda</span>
    </li>
    <li v-if="user" @click="$emit('navigate', '/quit')" class="menu-item text-red-500 hover:bg-red-100">
      <font-awesome-icon icon="right-from-bracket" /> <span>Cerrar sesión</span>
    </li>
  </ul>
</template>


<script setup>
import { useRoute } from 'vue-router';
import { useUserStore } from '../../store/userStore';
const userStore = useUserStore();
const user = userStore.user;

const route = useRoute();

const emit = defineEmits(['navigate']);
</script>

<style scoped>
.menu-item {
  @apply flex items-center gap-3 px-6 py-4 hover:bg-gray-100 transition-colors cursor-pointer;
}
</style>
