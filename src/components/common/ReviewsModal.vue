<template>
  <transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 flex items-center justify-center 
             bg-black/60 backdrop-blur-sm z-50"
    >
      <div
        class="bg-white/5 backdrop-blur-xl border border-white/10 
               shadow-2xl rounded-2xl p-6 md:p-8 w-full max-w-2xl 
               transform transition-all scale-100 animate-fadeInUp 
               max-h-[80vh] overflow-y-auto"
      >

        <!-- Botón cerrar -->
        <button
          class="absolute top-4 right-4 text-gray-300 hover:text-white 
                 text-lg transition active:scale-95"
          aria-label="Cerrar"
          @click="$emit('close')"
        >
          ✖
        </button>

        <!-- Título -->
        <h2 class="text-3xl font-bold text-white mb-4 text-center drop-shadow">
          Calificaciones
        </h2>

        <!-- Resumen -->
        <div class="flex items-center justify-center gap-2 mb-6">
          <span class="text-yellow-400 text-2xl drop-shadow">★</span>
          <span class="font-semibold text-xl text-white">{{ avgRating.toFixed(1) }}</span>
          <span class="text-gray-300 text-sm">({{ totalReviews }} opiniones)</span>
        </div>

        <!-- Reseñas -->
        <div v-if="reviews.length > 0" class="space-y-6">
          <div
            v-for="r in reviews"
            :key="r.id"
            class="border-b border-white/10 pb-4"
          >
            <div class="flex items-center gap-4">
              <img
                :src="r.reviewer?.profile_picture || defaultAvatar"
                alt="Avatar usuario"
                class="w-12 h-12 rounded-full shadow-lg border border-white/10"
              />
              <div>
                <p class="font-semibold text-white text-lg">
                  {{ r.reviewer?.name || "Usuario" }}
                </p>

                <!-- estrellas -->
                <div class="flex text-yellow-400 text-base drop-shadow">
                  <span v-for="i in 5" :key="i">
                    {{ i <= r.rating ? "★" : "☆" }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Comentario -->
            <p class="mt-3 text-gray-300 ml-16 leading-relaxed">
              {{ r.comment }}
            </p>
          </div>
        </div>

        <!-- Sin reseñas -->
        <p v-else class="text-gray-300 text-center">
          Aún no hay opiniones.
        </p>

      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import defaultAvatar from "../../assets/user_icon.png";

defineProps<{
  show: boolean;
  reviews: any[];
  avgRating: number;
  totalReviews: number;
}>();
</script>

<style>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-fadeInUp {
  animation: fadeInUp 0.35s ease-out;
}
</style>
