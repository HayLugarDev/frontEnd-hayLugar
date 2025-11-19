<script setup>
import { useUserStore } from '../../store/userStore';
import { useRouter } from 'vue-router';
import logo from '../../assets/logo.png';

const userStore = useUserStore();
const router = useRouter();
const emit = defineEmits(['close']);
const props = defineProps({
  sessionExpired: Boolean,
});

const closeModal = () => {
  userStore.setSessionExpired(false);
  emit('close');

  if (router.currentRoute.value.path === '/login') {
    window.location.reload(); // fuerza la recarga
  } else {
    router.push('/login');
  }
};


</script>

<template>
  <transition name="fade">
    <div
      v-if="sessionExpired"
      class="fixed inset-0 flex items-center justify-center 
             bg-black/60 backdrop-blur-sm z-50"
    >
      <div
        class="bg-white/5 backdrop-blur-xl border border-white/10 
               shadow-2xl rounded-2xl p-8 w-full max-w-md 
               transform transition-all scale-100 animate-fadeInUp"
      >
        <div class="flex flex-col items-center text-center">

          <!-- Logo -->
          <img
            :src="logo"
            alt="HayLugar"
            class="mx-auto w-20 h-20 mb-4 drop-shadow-lg opacity-90 select-none"
            loading="eager"
          />

          <!-- Mensaje -->
          <p class="text-base text-gray-300 leading-relaxed mb-6">
            Tenés que iniciar sesión para utilizar esta función.
          </p>

          <!-- Botón -->
          <button
            @click="closeModal"
            class="px-6 py-3 bg-[#00B4D8] text-white rounded-lg font-semibold 
                   shadow hover:bg-[#06D6A0] transition active:scale-95"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<style>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-fadeInUp {
  animation: fadeInUp 0.35s ease-out;
}
</style>
