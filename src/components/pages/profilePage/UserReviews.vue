<template>
  <section class="bg-white/10 border-white/10 p-2 md:p-8 rounded-2xl shadow-xl mb-8 w-full md:w-2/3 border border-gray-200">
    <!-- Título -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <h2 class="hidden md:flex text-2xl font-bold text-primary">⭐ Mis Calificaciones</h2>
        <p class="text-sm text-gray-400 px-4">Leé lo que otros opinan sobre tus espacios y tu atención</p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="space-y-4">
      <ItemSkeleton />
      <ItemSkeleton />
    </div>

    <!-- Sin reseñas -->
    <div v-else-if="reviews.length === 0" class="text-gray-400 text-center py-10 text-sm">
      Aún no tienes calificaciones.
    </div>

    <!-- Lista de reseñas -->
    <div v-else class="space-y-6">
      <div
        v-for="r in reviews"
        :key="r.id"
        class="border border-gray-200 rounded-2xl bg-white/10 border-white/10 shadow-md hover:shadow-lg transition-all overflow-hidden p-5"
      >
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-3">
          <div class="flex items-center gap-3">
            <!-- Avatar del revisor -->
            <div class="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center text-gray-200 text-lg font-semibold shadow-sm">
              {{ getInitials(r.reviewer?.name, r.reviewer?.last_name) }}
            </div>
            <div>
              <p class="font-semibold text-gray-200">
                {{ r.reviewer?.name }} {{ r.reviewer?.last_name }}
              </p>
              <p class="text-xs text-gray-400">Fecha: {{ formatDate(r.created_at) }}</p>
            </div>
          </div>

          <!-- Estrellas -->
          <div class="flex mt-2 md:mt-0">
            <font-awesome-icon
              v-for="i in 5"
              :key="i"
              :icon="['fas', i <= r.rating ? 'star' : 'star']"
              :class="i <= r.rating ? 'text-yellow-400' : 'text-gray-300'"
              class="text-sm"
            />
          </div>
        </div>

        <!-- Comentario -->
        <p class="text-gray-400 text-sm leading-relaxed border-l-4 border-primary/40 pl-3">
          "{{ r.comment }}"
        </p>

        <!-- Información del espacio -->
        <div
          v-if="r.space"
          class="mt-3 flex items-center justify-between text-xs text-gray-200 bg-white/10 border-white/10 rounded-xl p-2 px-3"
        >
          <span class="flex items-center gap-1">
            <font-awesome-icon icon="warehouse" class="text-primary" />
            {{ r.space.name }}
          </span>
          <span>{{ r.space.location.split(',')[0] }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getReviewsByUser } from "../../../services/reviewService";
import { useUserStore } from "../../../store/userStore";
import { formatDate } from "../../../utils/FormatDate";
import ItemSkeleton from "../../layout/skeletons/ItemSkeleton.vue";

const reviews = ref<any[]>([]);
const loading = ref(true);

const userStore = useUserStore();
const userId = userStore.user?.id;

onMounted(async () => {
  try {
    const res = await getReviewsByUser(userId);
    reviews.value = res || [];
  } catch (error) {
    console.error("Error al cargar calificaciones: ", error);
  } finally {
    loading.value = false;
  }
});

const getInitials = (name?: string, lastName?: string) => {
  if (!name && !lastName) return "?";
  const n = name ? name.charAt(0) : "";
  const l = lastName ? lastName.charAt(0) : "";
  return (n + l).toUpperCase();
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
