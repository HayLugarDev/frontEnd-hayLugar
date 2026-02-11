<template>
  <section class="p-4 md:p-8 w-full md:w-2/3">
    <!-- Contenedor con fondo glass & modo oscuro -->
    <div
      class="bg-white/10 border-white/10 border rounded-2xl shadow-xl overflow-hidden"
    >
      <!-- Título -->
      <div class="flex items-center justify-between px-6 py-4">
        <div>
          <h2 class="hidden text-2xl font-bold text-white md:flex items-center gap-2">
            <font-awesome-icon icon="heart" class="text-primary" />
            Mis Favoritos
          </h2>
          <p class="text-sm text-gray-300 mt-1">
            Accedé rápidamente a tus espacios preferidos
          </p>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="space-y-4 px-6 pb-6">
        <ItemSkeletonDark />
        <ItemSkeletonDark />
      </div>

      <!-- Sin favoritos -->
      <div
        v-else-if="favorites.length === 0"
        class="text-gray-400 text-center py-10 text-sm px-6"
      >
        Aún no tienes favoritos.  
        <br />
        <span class="text-primary font-medium">¡Explorá y guardá tus espacios preferidos!</span>
      </div>

      <!-- Lista de favoritos -->
      <div v-else class="space-y-4 px-6 pb-6">
        <div
          v-for="f in favorites"
          :key="f.id"
          @click="$router.push(`/espacio/${f.space.slug}`)"
          class="flex flex-col md:flex-row gap-4 bg-white/10 border-white/10 border
                 rounded-2xl shadow-md hover:shadow-2xl transition-all cursor-pointer overflow-hidden"
        >
          <!-- Imagen -->
          <div class="relative md:w-48 w-full h-48 md:h-auto">
            <img
              :src="getImageUrl(f.space.images)"
              alt="Imagen del espacio"
              class="w-full h-full object-cover rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none"
            />
            <div
              class="absolute top-2 right-2 bg-white/20 backdrop-blur-md p-2 rounded-full shadow-sm 
                     hover:bg-white/30 transition-all"
            >
              <font-awesome-icon icon="heart" class="text-primary text-lg" />
            </div>
          </div>

          <!-- Info -->
          <div class="flex flex-col justify-between flex-1 p-4">
            <!-- Encabezado -->
            <div>
              <h3 class="text-lg font-semibold text-white flex items-center gap-2">
                <font-awesome-icon icon="warehouse" class="text-primary" />
                {{ f.space.name }}
              </h3>
              <p class="text-sm text-gray-300 mt-1">
                {{ f.space.location.split(',')[0] }}
              </p>
              <p class="text-sm text-gray-400 capitalize mt-1">
                Tipo: {{ getSpanishCategory(f.space.type) }} · Superficie: {{ f.space.parking_type }}
              </p>
            </div>

            <!-- Datos inferiores: precio y rating -->
            <div class="flex items-center justify-between mt-4">
              <!-- Precio estimado -->
              <div>
                <p class="text-sm font-semibold text-newgreen">
                  ${{ f.space.vehicle_capacities?.[0]?.price_per_hour?.toLocaleString() }}/h
                </p>
                <p class="text-xs text-gray-400 mt-1">
                  Publicado desde: {{ formatDate(f.space.created_at) }}
                </p>
              </div>

              <!-- Rating -->
              <div class="flex items-center gap-1">
                <font-awesome-icon icon="star" class="text-yellow-400" />
                <span class="text-gray-200 text-sm">{{ f.space.average_rating.toFixed(1) }}</span>
              </div>
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
