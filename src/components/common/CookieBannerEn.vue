<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="fixed bottom-0 inset-x-0 bg-dark text-white p-4 z-50 flex flex-col md:flex-row items-center justify-between gap-3 shadow-2xl"
    >
      <p class="text-sm text-center md:text-left leading-snug">
        We use essential cookies to improve your experience. By continuing to browse, you agree to our
        <RouterLink to="/en/cookies" class="text-accent underline font-semibold">Cookies Policy</RouterLink>.
      </p>
      <button
        @click="accept"
        class="bg-accent text-dark font-semibold px-4 py-2 rounded-md shadow hover:opacity-90 transition"
      >
        Accept
      </button>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const visible = ref(false)
onMounted(() => {
  if (!localStorage.getItem('cookiesAcceptedEn')) visible.value = true
})
const accept = () => {
  localStorage.setItem('cookiesAcceptedEn', 'true')
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
