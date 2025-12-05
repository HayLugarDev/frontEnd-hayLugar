<template>
  <transition name="fade">
    <div v-if="visible" class="fixed inset-0 flex items-center justify-center 
             bg-black/60 backdrop-blur-sm z-50">
      <div class="bg-white/5 backdrop-blur-xl border border-white/10 
               shadow-2xl rounded-2xl p-6 md:p-8 max-w-md w-full
               transform transition-all animate-fadeInUp">

        <!-- Título -->
        <h2 class="text-2xl font-bold text-white mb-3 text-center">
          Califica tu experiencia
        </h2>

        <p class="text-gray-300 mb-6 text-sm text-center">
          Haz click sobre las estrellas para calificar<br>
          (Mínimo 1 estrella, máximo 5 estrellas).
        </p>

        <!-- Estrellas -->
        <div class="flex justify-center gap-3 mb-6">
          <button v-for="i in 5" :key="i" @click="setRating(i)"
            class="transition-transform duration-200 active:scale-95" :class="{ 'scale-125': rating === i }">
            <font-awesome-icon :icon="[rating >= i ? 'fas' : 'far', 'star']" class="text-4xl transition-all"
              :class="rating >= i ? 'text-yellow-400 drop-shadow-glow' : 'text-gray-500'" />
          </button>
        </div>

        <!-- Comentario opcional -->
        <textarea v-model="opinion" placeholder="Escribe un comentario (opcional)" rows="3" class="w-full p-3 bg-white/5 text-gray-200 border border-white/10 
                 rounded-xl focus:ring-2 focus:ring-[#00B4D8] outline-none 
                 placeholder:text-gray-400"></textarea>

        <!-- Botones -->
        <div class="flex justify-end gap-3 mt-6">
          <button @click="$emit('close')" class="px-4 py-2 rounded-lg border border-white/20
                   text-gray-300 hover:bg-white/10 transition active:scale-95">
            Cancelar
          </button>

          <button @click="submit" :disabled="rating === 0" class="px-5 py-2 bg-[#00B4D8] text-white rounded-lg font-semibold
                   shadow hover:bg-newgreen transition active:scale-95 
                   disabled:opacity-40">
            Enviar
          </button>
        </div>

      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  visible: boolean;
  reservationId?: number;
}>();

const emits = defineEmits<{
  (e: 'close'): void;
  (e: 'submit', payload: { rating: number; comment?: string; reservationId?: number }): void;
}>();

const rating = ref(5); // ⭐ por defecto 5
const opinion = ref('');

watch(() => props.visible, (val) => {
  if (val) {
    rating.value = 5;
    opinion.value = '';
  }
});

function setRating(value: number) {
  rating.value = value;
}

function submit() {
  emits('submit', { rating: rating.value, comment: opinion.value, reservationId: props.reservationId });
}
</script>
