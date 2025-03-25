<script setup>
import { useUserStore } from '../store/userStore';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();
const emit = defineEmits(['close']);
const props = defineProps({
  sessionExpired: Boolean,
});

const closeModal = () => {
  userStore.setSessionExpired(false);
  emit('close');
  router.push('/login'); // Redirige al login
};

</script>

<template>
  <transition name="fade">
    <div v-if="sessionExpired" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="bg-white rounded-lg shadow-xl p-8 max-w-md w-full transform transition-all scale-95">
        <div class="flex flex-col items-center">
          <img src="/src/assets/logo.jpeg" alt="Logo" class="w-20 h-20 mb-4" />
          <h2 class="text-3xl font-bold text-primary mb-2">Hay Lugar</h2>
          <p class="text-lg text-gray-700 text-center mb-6">
            Debes iniciar sesión para utilizar esta función.
          </p>
          <button @click="closeModal" class="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
            Iniciar Sesión
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>