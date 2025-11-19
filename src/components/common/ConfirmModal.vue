<template>
  <transition name="fade">
    <div v-if="visible" class="fixed inset-0 flex items-center justify-center 
             bg-black/60 backdrop-blur-sm z-50">
      <div class="bg-white/5 backdrop-blur-xl border border-white/10 
               shadow-2xl rounded-2xl p-8 w-full max-w-md 
               transform transition-all scale-100 animate-fadeInUp">
        <div class="flex flex-col items-center text-center">

          <!-- Logo -->
          <img src="../../assets/logo.png" alt="icono" class="w-20 h-20 mb-5 opacity-90 drop-shadow-lg" />

          <!-- Título -->
          <h2 class="text-2xl font-bold text-white mb-3">
            {{ title }}
          </h2>

          <!-- Mensaje -->
          <p v-if="isHtml" class="text-base text-gray-300 mb-6 leading-relaxed" v-html="message"></p>

          <p v-else class="text-base text-gray-300 mb-6 leading-relaxed">
            {{ message }}
          </p>

          <!-- Botones -->
          <div class="flex gap-3 mt-2">

            <!-- Cancelar -->
            <button @click="$emit('close')" class="px-4 py-2 rounded-lg border border-white/20 
                     text-gray-300 hover:bg-white/10 transition
                     active:scale-95">
              Cancelar
            </button>

            <!-- Aceptar -->
            <button @click="$emit('acept')" class="px-5 py-2 bg-[#00B4D8] text-white rounded-lg
                     font-semibold shadow hover:bg-[#06D6A0] 
                     transition active:scale-95">
              {{ buttonText }}
            </button>
          </div>

        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  visible: Boolean,
  title: String,
  message: String,
  icon: String,
  buttonText: {
    type: String,
    default: "Aceptar",
  },
  isHtml: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
