<template>
  <div v-if="displayedImages.length" class="relative w-full overflow-hidden mb-2">
    <!-- Viewport -->
    <div class="w-full overflow-hidden">
      <!-- Track -->
      <div class="flex transition-transform duration-500 ease-out" :style="trackStyle">
        <div v-for="(img, index) in displayedImages" class="flex-shrink-0 aspect-square"
          :style="{ width: `${100 / displayedImages.length}%` }">

          <img :src="img" class="w-full h-full object-cover" @error="onImageError(index)" />
        </div>
      </div>
    </div>

    <!-- Botón izquierda -->
    <button v-if="showControls" @click="prevSlide" class="nav-btn left-2 z-10">
      ‹
    </button>

    <!-- Botón derecha -->
    <button v-if="showControls" @click="nextSlide" class="nav-btn right-2 z-10">
      ›
    </button>
  </div>

  <!-- Fallback -->
  <div v-else class="w-full aspect-square">
    <img :src="someImg" class="w-full h-full object-cover" />
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import someImg from '../../../assets/img-haylugar.jpeg'

const props = defineProps({
  controls: Boolean,
  images: {
    type: Array,
    default: () => []
  }
})

const currentSlide = ref(0)

const displayedImages = ref(
  props.images.length ? [...props.images] : [someImg]
)

watch(
  () => props.images,
  (imgs) => {
    displayedImages.value = imgs.length ? [...imgs] : [someImg]
    currentSlide.value = 0
  },
  { immediate: true }
)

const showControls = computed(
  () => props.controls && displayedImages.value.length > 1
)

/* 🔑 CLAVE DEL FUNCIONAMIENTO */
const trackStyle = computed(() => ({
  width: `${displayedImages.value.length * 100}%`,
  transform: `translateX(-${
    currentSlide.value * (100 / displayedImages.value.length)
  }%)`
}))


const nextSlide = () => {
  currentSlide.value =
    (currentSlide.value + 1) % displayedImages.value.length
}

const prevSlide = () => {
  currentSlide.value =
    (currentSlide.value - 1 + displayedImages.value.length) %
    displayedImages.value.length
}

const onImageError = (index) => {
  displayedImages.value[index] = someImg
}
</script>

<style scoped>
.nav-btn {
  @apply absolute top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-sm text-white text-2xl w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/60 transition shadow-lg;
}
</style>
