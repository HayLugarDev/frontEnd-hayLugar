<template>
  <transition name="fade">
    <div
      v-if="show"
      class="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg text-white"
      :class="type === 'success' ? 'bg-emerald-600' : 'bg-red-600'"
    >
      {{ text }}
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref } from "vue";

const show = ref(false);
const text = ref("");
const type = ref<"success" | "error">("success");

function triggerToast(message: string, toastType: "success" | "error" = "success") {
  text.value = message;
  type.value = toastType;
  show.value = true;

  setTimeout(() => {
    show.value = false;
  }, 2000);
}

// ✅ Exportamos para que el padre pueda invocarlo
defineExpose({ triggerToast });
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
