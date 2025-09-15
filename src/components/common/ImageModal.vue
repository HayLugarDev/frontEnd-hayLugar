<template>
  <div 
    v-if="visible" 
    class="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
  >
    <!-- Botón cerrar -->
    <button 
      @click="$emit('close')" 
      class="absolute top-5 right-5 text-white text-3xl font-bold hover:scale-110 transition"
    >
      ✕
    </button>

    <!-- Contenedor de la imagen -->
    <div class="max-w-6xl max-h-[90vh] relative flex items-center">
      <!-- Botón anterior -->
      <button 
        v-if="currentIndex > 0" 
        @click="prevImage"
        class="absolute left-0 text-white text-4xl p-2 hover:scale-110 transition"
      >
        ‹
      </button>

      <img 
        :src="images[currentIndex]" 
        class="rounded-lg max-h-[90vh] object-contain mx-auto shadow-lg"
      />

      <!-- Botón siguiente -->
      <button 
        v-if="currentIndex < images.length - 1" 
        @click="nextImage"
        class="absolute right-0 text-white text-4xl p-2 hover:scale-110 transition"
      >
        ›
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  visible: { type: Boolean, required: true },
  images: { type: Array, default: () => [] },
  startIndex: { type: Number, default: 0 }
});

const emit = defineEmits(["close"]);

const currentIndex = ref(props.startIndex);

watch(() => props.startIndex, (newVal) => {
  currentIndex.value = newVal;
});

const prevImage = () => {
  if (currentIndex.value > 0) currentIndex.value -= 1;
};

const nextImage = () => {
  if (currentIndex.value < props.images.length - 1) currentIndex.value += 1;
};
</script>
