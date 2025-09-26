<template>
    <section class="lg:bg-white p-2 md:p-8 rounded-lg shadow-lg mb-8 w-full md:w-2/3">
        <h2 class="text-2xl font-bold mb-4 text-primary">Mis Favoritos</h2>

        <div v-if="loading" class="text-gray-500">Cargando favoritos...</div>

        <div v-else-if="favorites.length === 0" class="text-gray-500">
            Aún no tienes favoritos.
        </div>

        <div v-else class="space-y-4">
            <div v-for="f in favorites" :key="f.id" class="flex gap-4 border-b p-4 hover:bg-gray-50 cursor-pointer"
                @click="$router.push(`/espacios/${f.space.id}`)">

                <!-- Imagen -->
                <img :src="f.space.images?.[0]" class="w-28 h-28 object-cover rounded-lg" />

                <!-- Info -->
                <div class="flex flex-col justify-between flex-1">
                    <div>
                        <p class="font-bold text-lg">{{ f.space.name }}</p>
                        <p class="text-gray-600">{{ f.space.location }}</p>
                        <p class="text-sm text-gray-400 capitalize">
                            Tipo: {{ getSpanishCategory(f.space.type) }} · Superficie: {{ f.space.parking_type }}
                        </p>
                    </div>

                    <div class="flex items-center justify-between mt-2">
                        <!-- Precio estimado -->
                        <span class="font-semibold text-primary">
                            ${{ f.space.vehicle_capacities?.[0]?.price_per_hour }}/hora
                        </span>

                        <!-- Rating -->
                        <span>
                            ⭐ {{ f.space.average_rating.toFixed(1) }}
                        </span>
                    </div>

                    <p class="text-xs text-gray-400 mt-1">
                        Publicado desde: {{ formatDate(f.space.created_at) }}
                    </p>
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

const favorites = ref([]);
const loading = ref(true);

onMounted(async () => {
    try {
        const res = await getUserFavorites();
        console.log(res);
        favorites.value = res;
        loading.value = false;
    } catch (error) {
        console.log("Error al cargar tus favoritos: ", error);
    }
});
</script>
