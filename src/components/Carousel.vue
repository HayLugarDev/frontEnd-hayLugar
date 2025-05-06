<template>
  <div v-if="props.images.length" class="relative w-full overflow-hidden mb-2 lg:rounded-xl">
    <!-- Carrusel de imágenes -->
    <div class="flex transition-transform duration-500" :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
      @touchstart="onTouchStart" @touchend="onTouchEnd">
      <div v-for="(img, index) in props.images" :key="index" class="w-full flex-shrink-0 lg:aspect-square">
        <img :src="`http://localhost:3000${img}`" class="w-full h-full object-cover" alt="Imagen del carrusel" />
      </div>
    </div>

    <div v-if="props.controls">
      <!-- Botones de navegación -->
      <div v-if="props.images.length > 1" class="absolute inset-0 flex justify-between items-center px-4">
        <button @click="prevSlide" type="button"
          class="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none">
          <span
            class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
            <svg class="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" xmlns="http://www.w3.org/2000/svg"
              fill="none" viewBox="0 0 6 10">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M5 1 1 5l4 4" />
            </svg>
            <span class="sr-only">Anterior</span>
          </span>
        </button>
        <button @click="nextSlide" type="button"
          class="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none">
          <span
            class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
            <svg class="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" xmlns="http://www.w3.org/2000/svg"
              fill="none" viewBox="0 0 6 10">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="m1 9 4-4-4-4" />
            </svg>
            <span class="sr-only">Siguiente</span>
          </span>
        </button>
      </div>

      <!-- Indicadores -->
      <div v-if="props.images.length > 1" class="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
        <button v-for="(img, index) in props.images" :key="`indicator-${index}`" @click="goToSlide(index)" :class="[
          'w-3 h-3 rounded-full',
          currentSlide === index ? 'bg-white' : 'bg-white/50'
        ]"></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  controls: Boolean,
  images: {
    type: Array,
    required: true
  }
});

const currentSlide = ref(0);
let intervalId = null;

const startX = ref(0);
const startY = ref(0);
const endX = ref(0);
const isSwiping = ref(false);

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % props.images.length;
};

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + props.images.length) % props.images.length;
};

const handleSwipe = () => {
  clearInterval(intervalId);

  const distance = endX.value - startX.value;
  if (distance > 50) {
    prevSlide();
  } else if (distance < -50) {
    nextSlide();
  }
};

const startAutoSlide = () => {
  clearInterval(intervalId);
  intervalId = setInterval(() => {
    nextSlide();
  }, 3000);
};

onMounted(() => {
  const container = document.querySelector('.flex');

  const handleTouchStart = (e) => {
    startX.value = e.touches[0].clientX;
    startY.value = e.touches[0].clientY;
    isSwiping.value = false;
  };

  const handleTouchMove = (e) => {
    const deltaX = e.touches[0].clientX - startX.value;
    const deltaY = e.touches[0].clientY - startY.value;

    // Solo prevenimos scroll si el gesto es claramente horizontal
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      isSwiping.value = true;
      e.preventDefault(); // Bloquea scroll horizontal
    }
  };

  const handleTouchEnd = (e) => {
    if (isSwiping.value) {
      endX.value = e.changedTouches[0].clientX;
      handleSwipe();
    }
  };

  container.addEventListener('touchstart', handleTouchStart, { passive: false });
  container.addEventListener('touchmove', handleTouchMove, { passive: false });
  container.addEventListener('touchend', handleTouchEnd);

  startAutoSlide();
});

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>