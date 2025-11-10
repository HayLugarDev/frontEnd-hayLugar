<template>
  <!-- Si hay imágenes -->
  <div v-if="displayedImages.length" class="relative w-full overflow-hidden mb-2 lg:rounded-xl">
    <div class="flex transition-transform duration-500" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
      <div v-for="(img, index) in displayedImages" :key="index" class="w-full flex-shrink-0 aspect-square">
        <img :src="img" class="w-full h-full object-cover" alt="Imagen del espacio" @error="onImageError(index)" />
      </div>
    </div>
  </div>

  <!-- Fallback absoluto: si no hay imágenes válidas -->
  <div v-else class="w-full flex-shrink-0 aspect-square">
    <img :src="someImg" class="w-full h-full object-cover" alt="Imagen por defecto" />
  </div>
</template>


<script setup>
import { ref, watch, onMounted } from 'vue'
import someImg from '../../assets/img-haylugar.jpeg'


const props = defineProps({
  controls: Boolean,
  images: {
    type: Array,
    required: true,
    default: () => []
  }
})

const currentSlide = ref(0)
const displayedImages = ref(
  props.images?.length ? [...props.images] : [someImg] // ← fallback inicial
)

watch(
  () => props.images,
  (newImgs) => {
    displayedImages.value = newImgs?.length ? [...newImgs] : [someImg]
  },
  { immediate: true }
)

const onImageError = (index) => {
  displayedImages.value[index] = someImg
}

// Swipe / touch controls
const startX = ref(0)
const startY = ref(0)
const endX = ref(0)
const isSwiping = ref(false)

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % displayedImages.value.length
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + displayedImages.value.length) % displayedImages.value.length
}

const handleSwipe = () => {
  const distance = endX.value - startX.value
  if (distance > 50) prevSlide()
  else if (distance < -50) nextSlide()
}

onMounted(() => {
  const container = document.querySelector('.flex')
  if (!container) return

  const handleTouchStart = (e) => {
    startX.value = e.touches[0].clientX
    startY.value = e.touches[0].clientY
    isSwiping.value = false
  }

  const handleTouchMove = (e) => {
    const deltaX = e.touches[0].clientX - startX.value
    const deltaY = e.touches[0].clientY - startY.value
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      isSwiping.value = true
      e.preventDefault()
    }
  }

  const handleTouchEnd = (e) => {
    if (isSwiping.value) {
      endX.value = e.changedTouches[0].clientX
      handleSwipe()
    }
  }

  container.addEventListener('touchstart', handleTouchStart, { passive: false })
  container.addEventListener('touchmove', handleTouchMove, { passive: false })
  container.addEventListener('touchend', handleTouchEnd)
})
</script>
