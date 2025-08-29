<template>
  <transition name="fade">
    <div v-if="visible" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="bg-white rounded-lg shadow-xl p-8 max-w-md w-full transform transition-all scale-95">
        <div class="flex flex-col items-center text-center">
          <img src="../../assets/logo.png" alt="icono" class="w-20 h-20 mb-4" />
          
          <h2 class="text-xl font-bold text-primary mb-2">{{ title }}</h2>
          
          <p
            v-if="isHtml"
            class="text-lg text-gray-700 mb-6"
            v-html="message"
          ></p>
          <p v-else class="text-lg text-gray-700 mb-6">{{ message }}</p>

          <div class="flex gap-3">
            <button @click="$emit('close')" class="px-4 py-2 border rounded-lg">
              Cancelar
            </button>
            <button @click="$emit('acept')" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600">
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
