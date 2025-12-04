<template>
  <div class="relative w-full">
    <!-- Botón principal -->
    <button @click="toggleMenu"
      class="flex items-center justify-between p-2 w-full transition-all duration-300">
      <div class="flex items-center gap-2">
        <font-awesome-icon icon="list" class="text-lg" />
        <span>{{ currentLabel }}</span>
      </div>
      <font-awesome-icon :icon="openMenu ? 'fa-chevron-up' : 'fa-chevron-down'"
        class="text-gray-300 text-sm transition-transform duration-300" :class="{ 'rotate-180': openMenu }" />
    </button>

    <!-- Menú desplegable -->
    <transition name="fade-slide">
      <ul v-if="openMenu"
        class="absolute left-0 mt-2 w-full bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] rounded-2xl shadow-xl overflow-hidden z-50 border border-gray-200 backdrop-blur-md">
        <li v-for="(option, index) in options" :key="index" @click="selectOption(option)"
          class="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-primary hover:text-white transition-all duration-200">
          <div class="flex items-center gap-2">
            <span>{{ option.label }}</span>
          </div>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const model = defineModel()

const props = defineProps({
  modelValue: String,
  options: {
    type: Array,
    required: true
  }
})

const openMenu = ref(false)
const toggleMenu = () => (openMenu.value = !openMenu.value)

const selectOption = (option) => {
  model.value = option.value
  openMenu.value = false
}

const currentLabel = computed(() => {
  return props.options.find(opt => opt.value === model.value)?.label || 'Seleccionar'
})

const currentIcon = computed(() => {
  return props.options.find(opt => opt.value === model.value)?.icon || 'fa-user-circle'
})
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.25s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-6px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
