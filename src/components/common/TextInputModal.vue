<template>
  <transition name="fade">
    <div
      v-if="modelValue"
      class="fixed inset-0 flex items-center justify-center 
             bg-black/60 backdrop-blur-sm z-50"
      @click.self="close"
    >
      <div
        class="bg-white/5 backdrop-blur-xl border border-white/10 
               shadow-2xl rounded-2xl p-6 md:p-8 max-w-md w-full
               transform transition-all animate-fadeInUp"
      >
        <h2 class="text-2xl font-bold text-white mb-3 text-center">
          {{ title }}
        </h2>

        <input
          v-model="localValue"
          :placeholder="placeholder"
          class="w-full p-3 bg-white/5 text-gray-200 border border-white/10 
                 rounded-xl focus:ring-2 focus:ring-[#00B4D8] outline-none 
                 placeholder:text-gray-400"
        />

        <div class="flex justify-end gap-3 mt-6">
          <button
            @click="close"
            class="px-4 py-2 rounded-lg border border-white/20
                   text-gray-300 hover:bg-white/10 transition active:scale-95"
          >
            Cancelar
          </button>

          <button
            @click="save"
            class="px-5 py-2 bg-[#00B4D8] text-white rounded-lg font-semibold
                   shadow hover:bg-newgreen transition active:scale-95"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: Boolean,
  model: String,
  title: String,
  placeholder: String,
});

const emit = defineEmits([
  'update:modelValue',
  'update:model',
  'save',
  'close',
]);

const localValue = ref(props.model || "");

// Cuando cambie el model (del padre), actualizamos el input
watch(
  () => props.model,
  (val) => {
    localValue.value = val || "";
  }
);

function close() {
  emit("update:modelValue", false);
  emit("close");
}

function save() {
  emit("update:model", localValue.value);
  emit("save", localValue.value);
  emit("update:modelValue", false);
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(25px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeInUp {
  animation: fadeInUp 0.3s ease;
}
</style>
