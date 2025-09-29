<template>
  <transition name="fade">
    <div v-if="visible" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-md w-full">
        <h2 class="text-2xl font-bold text-gray-800 mb-4 text-center">Califica tu experiencia</h2>

        <!-- Estrellas -->
        <div class="flex justify-center gap-2 mb-4">
          <button
            v-for="i in 5"
            :key="i"
            @click="setRating(i)"
            class="focus:outline-none transition-transform"
            :class="{ 'scale-110': rating === i }"
          >
            <font-awesome-icon
              :icon="[rating >= i ? 'fas' : 'far', 'star']"
              class="text-yellow-400 text-3xl"
            />
          </button>
        </div>

        <!-- Opinión opcional -->
        <textarea
          v-model="opinion"
          placeholder="Escribe un comentario (opcional)"
          rows="3"
          class="w-full p-3 border rounded-lg text-gray-700 focus:ring-2 focus:ring-primary focus:outline-none mb-4"
        />

        <!-- Botones -->
        <div class="flex justify-end gap-3">
          <button
            @click="$emit('close')"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            @click="submit"
            class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            :disabled="rating === 0"
          >
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
  (e: 'submit', payload: { rating: number; opinion?: string; reservationId?: number }): void;
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
  emits('submit', { rating: rating.value, opinion: opinion.value, reservationId: props.reservationId });
}
</script>
