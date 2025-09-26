<template>
  <div v-if="show" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div class="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 relative overflow-y-auto max-h-[80vh]">
      <!-- Cerrar -->
      <button class="absolute top-3 right-3 text-gray-500 hover:text-gray-800" @click="$emit('close')">✖</button>

      <h2 class="text-2xl font-bold mb-2">Opiniones</h2>

      <div class="flex items-center gap-2 mb-6">
        <span class="text-yellow-500 text-xl">★</span>
        <span class="font-semibold text-lg">{{ avgRating.toFixed(1) }}</span>
        <span class="text-gray-500">({{ totalReviews }} opiniones)</span>
      </div>

      <div v-if="reviews.length > 0" class="space-y-4">
        <div v-for="r in reviews" :key="r.id" class="border-b pb-3">
          <div class="flex items-center gap-3">
            <img :src="r.reviewer?.profile_picture || defaultAvatar" class="w-10 h-10 rounded-full shadow" />
            <div>
              <p class="font-semibold">{{ r.reviewer?.name || "Usuario" }}</p>
              <div class="flex text-yellow-500 text-sm">
                <span v-for="i in 5" :key="i">{{ i <= r.rating ? "★" : "☆" }}</span>
              </div>
            </div>
            <p class="mt-2 text-gray-600">{{ r.comment }}</p>
          </div>
        </div>
      </div>

      <p v-else class="text-gray-500">Aún no hay opiniones.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import defaultAvatar from "../../assets/user_icon.png";

defineProps<{
  show: boolean;
  reviews: any[];
  avgRating: number;
  totalReviews: number;
}>();
</script>
