<template>
  <section class="lg:bg-white p-2 md:p-8 rounded-2xl shadow-xl mb-8 w-full md:w-2/3 border border-gray-200">
    <!-- Título -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <h2 class="text-2xl font-bold text-primary">💖 Mis Favoritos</h2>
        <p class="text-sm text-gray-600 px-4">Accedé rápidamente a tus espacios preferidos</p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="space-y-4">
      <ItemSkeleton />
      <ItemSkeleton />
    </div>

    <!-- Sin favoritos -->
    <div v-else-if="favorites.length === 0" class="text-gray-500 text-center py-10 text-sm">
      Aún no tienes favoritos.  
      <br />
      <span class="text-primary font-medium">¡Explorá y guardá tus espacios preferidos!</span>
    </div>

    <!-- Lista de favoritos -->
    <div v-else class="grid gap-6">
      <div
        v-for="f in favorites"
        :key="f.id"
        @click="$router.push(`/espacio/${f.space.id}`)"
        class="flex flex-col md:flex-row gap-4 border border-gray-200 rounded-2xl bg-gradient-to-b from-gray-50 to-white shadow-md hover:shadow-lg transition-all cursor-pointer overflow-hidden"
      >
        <!-- Imagen -->
        <div class="relative md:w-48 w-full">
          <img
            :src="getImageUrl(f.space.images)"
            alt="Imagen del espacio"
            class="w-full h-48 md:h-full object-cover rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none"
          />
          <div
            class="absolute top-2 right-2 bg-white bg-opacity-80 backdrop-blur-md rounded-full p-2 shadow-sm hover:bg-opacity-100 transition-all"
          >
            <font-awesome-icon icon="heart" class="text-primary" />
          </div>
        </div>

        <!-- Info -->
        <div class="flex flex-col justify-between flex-1 p-4">
          <!-- Encabezado -->
          <div>
            <h3 class="text-lg font-bold text-gray-800 flex items-center gap-2">
              <font-awesome-icon icon="warehouse" class="text-primary" />
              {{ f.space.name }}
            </h3>
            <p class="text-sm text-gray-500">{{ f.space.location.split(',')[0] }}</p>
            <p class="text-sm text-gray-400 capitalize mt-1">
              Tipo: {{ getSpanishCategory(f.space.type) }} · Superficie: {{ f.space.parking_type }}
            </p>
          </div>

          <!-- Datos inferiores -->
          <div class="flex items-center justify-between mt-4">
            <!-- Precio estimado -->
            <div class="text-sm">
              <p class="font-semibold text-primary">
                ${{ f.space.vehicle_capacities?.[0]?.price_per_hour?.toLocaleString() }}/hora
              </p>
              <p class="text-xs text-gray-400">
                Publicado desde: {{ formatDate(f.space.created_at) }}
              </p>
            </div>

            <!-- Rating -->
            <div class="flex items-center gap-1 text-yellow-500 font-semibold">
              <font-awesome-icon icon="star" />
              <span class="text-gray-700 text-sm">{{ f.space.average_rating.toFixed(1) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { formatDate } from "../../../utils/FormatDate";
import { getUserFavorites } from "../../../services/favoriteService";
import { getSpanishCategory } from "../../../utils/SpaceCategoryTraslation";
import ItemSkeleton from "../../layout/skeletons/ItemSkeleton.vue";

const favorites = ref<any[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const res = await getUserFavorites();
    favorites.value = res || [];
  } catch (error) {
    console.error("Error al cargar tus favoritos:", error);
  } finally {
    loading.value = false;
  }
});

const getImageUrl = (images: string[] | string) => {
  if (!images) return "/src/assets/no-image.png";
  const parsed = typeof images === "string" ? JSON.parse(images) : images;
  return parsed?.[0] || "/src/assets/no-image.png";
};
</script>

<style scoped>
section {
  animation: fadeIn 0.4s ease-in-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
