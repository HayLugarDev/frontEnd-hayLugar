<template>
    <section class="lg:bg-white p-2 md:p-8 rounded-lg shadow-lg mb-8 w-full md:w-2/3">
        <h2 class="text-2xl font-bold mb-4 text-primary">Mis Calificaciones</h2>

        <div v-if="loading" class="text-gray-500">Cargando reseñas...</div>

        <div v-else-if="reviews.length === 0" class="text-gray-500">
            Aún no tienes calificaciones.
        </div>

        <div v-else class="space-y-4">
            <div v-for="r in reviews" :key="r.id" class="border-b p-4">
                <div class="flex items-center justify-between">
                    <p class="font-semibold">
                        {{ r.reviewer?.name }} {{ r.reviewer?.last_name }}
                    </p>
                    <div class="flex">
                        <span v-for="i in 5" :key="i" class="text-yellow-400">
                            <font-awesome-icon :icon="['fas', i <= r.rating ? 'star' : 'star-half-alt']" />
                        </span>
                    </div>
                </div>
                <p class="text-gray-600 mt-2">{{ r.comment }}</p>
                <p class="text-xs text-gray-400 mt-1">
                    Fecha: {{ formatDate(r.created_at) }}
                </p>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getReviewsByUser } from "../../../services/reviewService";
import { useUserStore } from "../../../store/userStore";
import { formatDate } from "../../../utils/FormatDate";

const reviews = ref([]);
const loading = ref(true);

const userStore = useUserStore();
const userId = userStore.user?.id;

onMounted(async () => {
    try {
        const res = await getReviewsByUser(userId);
        reviews.value = res;
        loading.value = false;
    } catch (error) {
        console.log('Error al cargar calificaciones: ', error);
    }
});
</script>
