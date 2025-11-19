<template>
  <transition name="fade">
    <div
      v-if="showWelcome"
      class="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50"
    >
      <div
        class="relative bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] text-gray-200 rounded-3xl shadow-2xl border border-white/30 w-11/12 max-w-lg p-10 text-center backdrop-blur-lg overflow-hidden"
      >
        <!-- Luces decorativas -->
        <div class="absolute -top-20 -right-20 h-56 w-56 bg-primary/20 blur-3xl rounded-full"></div>
        <div class="absolute -bottom-20 -left-20 h-48 w-48 bg-accent/30 blur-3xl rounded-full"></div>

        <!-- Contenido animado -->
        <div class="relative z-10">
          <!-- Logo -->
          <img
            :src="logo"
            alt="HayLugar"
            class="mx-auto w-20 h-20 mb-6 opacity-0 animate-logo"
          />

          <!-- Título -->
          <h1 class="text-3xl font-bold mb-2 opacity-0 animate-title">
            Bienvenido a <span class="text-primary">HayLugar</span>
          </h1>
          <p class="text-gray-200 text-sm mb-6 opacity-0 animate-subtitle">
            Movilidad inteligente para un mundo en movimiento 🌎
          </p>

          <!-- Texto principal -->
          <p class="text-gray-400 mb-6 leading-relaxed opacity-0 animate-body">
            Nos alegra tenerte a bordo.  
            Con <span class="font-semibold text-primary">HayLugar</span> podés descubrir, reservar y gestionar tus espacios de estacionamiento de forma simple y rápida.
          </p>

          <p class="text-gray-400 text-sm mb-8 opacity-0 animate-body-delay">
            Explorá, conectá y movete con libertad 🚗✨
          </p>

          <!-- Botón -->
          <button
            @click="closeWelcome"
            class="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 active:scale-95 transition-all shadow-md opacity-0 animate-button"
          >
            ¡Comenzar!
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import logo from '../../assets/logo.png'

const showWelcome = ref(false)

onMounted(() => {
  const hasSeenWelcome = localStorage.getItem('hasSeenWelcome')
  if (!hasSeenWelcome) {
    showWelcome.value = true
  }
})

const closeWelcome = () => {
  showWelcome.value = false
  localStorage.setItem('hasSeenWelcome', 'true')
}
</script>

<style scoped>
/* ====== Fade del overlay ====== */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ====== Animaciones hero ====== */
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* ====== Secuencia ====== */
.animate-logo {
  animation: scaleIn 0.6s ease forwards;
  animation-delay: 0.2s;
}

.animate-title {
  animation: fadeUp 0.6s ease forwards;
  animation-delay: 0.5s;
}

.animate-subtitle {
  animation: fadeUp 0.6s ease forwards;
  animation-delay: 0.8s;
}

.animate-body {
  animation: fadeUp 0.7s ease forwards;
  animation-delay: 1.1s;
}

.animate-body-delay {
  animation: fadeUp 0.7s ease forwards;
  animation-delay: 1.4s;
}

.animate-button {
  animation: fadeUp 0.7s ease forwards;
  animation-delay: 1.8s;
}

/* Estado inicial */
.opacity-0 {
  opacity: 0;
}
</style>
