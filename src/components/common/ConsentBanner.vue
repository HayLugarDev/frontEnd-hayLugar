<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="fixed bottom-0 inset-x-0 bg-dark text-white p-4 z-50 flex flex-col md:flex-row items-center justify-between gap-3 shadow-2xl"
      role="alert"
      aria-live="polite"
    >
      <p class="text-sm text-center md:text-left leading-snug">
        Usamos cookies necesarias para mejorar tu experiencia.  
        Al continuar navegando, aceptás nuestra
        <RouterLink to="/cookies" class="text-accent underline font-semibold">
          Política de Cookies
        </RouterLink>.
      </p>

      <div class="flex gap-2">
        <button
          @click="accept"
          class="bg-accent text-dark font-semibold px-4 py-2 rounded-md shadow hover:opacity-90 transition"
        >
          Aceptar
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const visible = ref(false)

onMounted(() => {
  // muestra el banner solo si el usuario no aceptó previamente
  if (!localStorage.getItem('cookiesAccepted')) {
    visible.value = true
  }
})

const accept = () => {
  localStorage.setItem('cookiesAccepted', 'true')
  visible.value = false
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(15px);
}
</style>
