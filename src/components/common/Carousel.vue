<template>
  <div v-if="props.images.length" class="relative w-full overflow-hidden mb-2 lg:rounded-xl">
    <!-- Carrusel de imágenes -->
    <div class="flex transition-transform duration-500" :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
      @touchstart="onTouchStart" @touchend="onTouchEnd">
      <div v-for="(img, index) in props.images" :key="index" class="w-full flex-shrink-0 aspect-square">
        <img :src="img" class="w-full h-full object-cover" alt="Imagen del carrusel" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  controls: Boolean,
  images: {
    type: Array,
    required: true
  }
});

const currentSlide = ref(0);

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

  const distance = endX.value - startX.value;
  if (distance > 50) {
    prevSlide();
  } else if (distance < -50) {
    nextSlide();
  }
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

});
</script>