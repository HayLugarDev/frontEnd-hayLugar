<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-br from-primary via-primary/90 to-dark text-white">
    <!-- Header principal -->
    <MainHeader />

    <!-- Capa decorativa de luces difusas -->
    <div class="pointer-events-none absolute inset-0 overflow-hidden -z-10">
      <div class="absolute -right-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-white/10 blur-3xl"></div>
      <div class="absolute -left-32 -bottom-40 h-[26rem] w-[26rem] rounded-full bg-accent/20 blur-3xl"></div>
    </div>

    <!-- Contenedor central -->
    <div class="flex-grow flex items-center justify-center px-6 py-16">
      <div
        class="bg-white text-gray-800 rounded-2xl shadow-2xl border border-white/20 w-full max-w-md p-10 text-center backdrop-blur-lg"
      >
        <!-- Logo -->
        <img
          :src="logo"
          alt="HayLugar"
          class="mx-auto w-20 h-20 mb-4 drop-shadow-lg select-none"
          loading="eager"
        />

        <!-- Título -->
        <h1 class="text-2xl font-bold mb-2">Bienvenido a <span class="text-primary">HayLugar</span></h1>
        <p class="text-gray-500 text-sm mb-8">Movilidad inteligente para un mundo en movimiento</p>

        <!-- Botón Google -->
        <GoogleLogin
          class="mx-auto w-full md:w-3/4 transition-all hover:scale-105 active:scale-95"
        />

        <!-- Separador -->
        <div class="flex items-center my-8">
          <div class="flex-grow border-t border-gray-300"></div>
          <span class="mx-3 text-gray-400 text-sm">o</span>
          <div class="flex-grow border-t border-gray-300"></div>
        </div>

        <!-- Mensaje alternativo -->
        <p class="text-sm text-gray-600">
          Accedé con tu cuenta de Google para comenzar a explorar la red inteligente de estacionamientos.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import MainHeader from '../components/layout/header/MainHeader.vue'
import GoogleLogin from '../components/layout/GoogleLogin.vue'
import logo from '../assets/logo.png'
import BackButton from '../components/common/BackButton.vue';
</script>

<style scoped>
/* Suaviza las transiciones del botón */
button {
  transition: all 0.25s ease-in-out;
}
</style>
