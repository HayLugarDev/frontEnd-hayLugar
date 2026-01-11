<template>

  <MainHeader />

  <!-- BOTÓN ATRÁS MOBILE -->
  <div class="w-full flex justify-end p-4 sm:hidden fixed top-0 left-0 z-50">
    <BackButton />
  </div>

  <!-- MENÚ INFERIOR MOBILE -->
  <MobileButtonNav @navigate="(p) => router.push(p)" class="md:hidden" :showMap="false" />

  <!-- FONDO -->
  <div class="min-h-screen bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A]
           text-white p-6 md:p-10">
    <section class="pt-10 md:pt-16 max-w-4xl mx-auto p-6 md:p-10">
      <!-- HEADER -->
      <header class="mb-8">
        <h2 class="text-3xl font-bold text-primary flex items-center gap-2">
          📦 Tus publicaciones
        </h2>
        <p class="text-sm text-gray-400 mt-1">
          Gestioná tus espacios publicados de forma simple y visual
        </p>
      </header>

      <!-- LOADING -->
      <div v-if="loading" class="space-y-4">
        <ItemSkeleton />
        <ItemSkeleton />
      </div>

      <!-- LISTA PUBLICACIONES -->
      <div v-else-if="publications.length" class="space-y-6">
        <div v-for="(publication, index) in publications" :key="index" class="bg-white/5 border border-white/10 rounded-2xl overflow-hidden
                 shadow-lg hover:shadow-xl transition-all backdrop-blur-xl">
          <!-- CARD HEADER -->
          <div class="flex justify-between items-center p-4 bg-white/10 border-b border-white/10">
            <div>
              <h3 class="text-lg font-semibold text-gray-200 flex items-center gap-2">
                <font-awesome-icon icon="warehouse" class="text-primary" />
                {{ publication.name }}
              </h3>
              <p class="text-xs text-gray-400">
                {{ publication.location.split(',')[0] }}
              </p>
            </div>

            <span :class="[
              'px-3 py-1 rounded-full text-xs font-semibold shadow-sm',
              publication.status === 'active'
                ? 'bg-green-200/20 text-green-400'
                : 'bg-gray-200/20 text-gray-400'
            ]">
              {{ getSpanishState(publication.status) }}
            </span>
          </div>

          <!-- CARD BODY -->
          <div class="p-5 space-y-4 text-gray-300">
            <!-- GRID DATOS -->
            <div class="grid md:grid-cols-2 gap-4 text-sm">
              <p>
                <span class="font-semibold">📅 Publicado:</span>
                {{ formatDate(publication.created_at) }}
              </p>
              <p>
                <span class="font-semibold">🏷️ Tipo:</span>
                {{ publication.type.toUpperCase() }}
              </p>
              <p>
                <span class="font-semibold">🧭 Categoría:</span>
                {{ getSpanishCategory(publication.category) }}
              </p>
              <p>
                <span class="font-semibold">🚘 Vehículos:</span>
                {{ publication.vehicle_capacities.length }}
              </p>
            </div>

            <!-- VEHÍCULOS ACEPTADOS -->
            <div class="pt-2">
              <p class="font-semibold mb-2 text-gray-200 flex items-center gap-1">
                <font-awesome-icon icon="car" class="text-primary" /> Vehículos aceptados
              </p>

              <div class="flex flex-wrap gap-3">
                <div v-for="v in publication.vehicle_capacities" :key="v.type" class="flex flex-col items-center p-3 border rounded-xl bg-white/10 border-white/10
                         shadow-sm hover:shadow-md transition-all w-24">
                  <font-awesome-icon :icon="['fas', getVehicleIcon(v.type)]" class="text-gray-200 text-lg mb-1" />
                  <span class="text-xs capitalize text-gray-200">{{ getVehicleType(v.type) }}</span>
                  <span v-if="v.price_per_hour" class="text-xs font-semibold text-primary">
                    ${{ v.price_per_hour.toLocaleString() }}/h
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- ACCIONES -->
          <div class="flex items-center justify-end gap-2 border-t border-white/10 p-4 bg-white/5">
            <button @click="editPublication(publication)" class="flex items-center justify-center gap-2 text-sm font-semibold
                     bg-newgreen/20 hover:bg-newgreen/30 text-white px-4 py-2
                     rounded-xl shadow hover:shadow-lg transition-all">
              <font-awesome-icon :icon="['fas', 'pen-to-square']" /> Editar
            </button>

            <button @click="openConfirm(publication)" class="flex items-center justify-center gap-2 text-sm font-semibold
                     bg-gradient-to-r from-red-400 to-red-500 text-white px-4 py-2
                     rounded-xl shadow hover:shadow-lg transition-all">
              <font-awesome-icon :icon="['fas', 'trash']" /> Eliminar
            </button>
          </div>
        </div>
      </div>

      <!-- SIN PUBLICACIONES -->
      <p v-else class="text-gray-400 text-center py-12 italic">
        No tenés publicaciones aún.
      </p>
    </section>
  </div>

  <!-- MODALES -->
  <StatusModal :visible="showErrorModal" type="error" title="¡Atención!" :message="errorMessage"
    icon="/src/assets/logo.png" @confirm="showErrorModal = false" />

  <EditPublications :visible="openModal" :spaceId="space?.id" @close="openModal = false" @updated="fetchPublications" />

  <ConfirmModal :visible="showConfirmModal" :message="modalConfig.message" :button-text="modalConfig.buttonText"
    @close="showConfirmModal = false" @acept="() => { modalConfig.onConfirm(); showConfirmModal = false }" />
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useUserStore } from "../store/userStore";
import { useSpaceStore } from "../store/spaceStore";
import { useRouter } from "vue-router";

import api from "../services/apiService";
import { deleteSpaceById } from "../services/spaceService";

import { getVehicleIcon, getVehicleType } from "../utils/vehicleTypeIconTraslation";
import { getSpanishState } from "../utils/SpaceStatusTraslation";
import { getSpanishCategory } from "../utils/SpaceCategoryTraslation";
import { formatDate } from "../utils/FormatDate";

import ItemSkeleton from "../components/layout/skeletons/ItemSkeleton.vue";
import ConfirmModal from "../components/common/ConfirmModal.vue";
import StatusModal from "../components/pages/addSpacePage/StatusModal.vue";
import EditPublications from "../components/pages/profilePage/UI/EditPublications.vue";
import MainHeader from "../components/layout/header/MainHeader.vue";
import MobileButtonNav from "../components/layout/MobileButtonNav.vue";
import BackButton from "../components/common/BackButton.vue";

const router = useRouter();
const userStore = useUserStore();
const spaceStore = useSpaceStore();

const publications = ref([]);
const space = ref(null);
const selectedPublication = ref(null);

const loading = ref(true);
const openModal = ref(false);
const showConfirmModal = ref(false);
const showErrorModal = ref(false);
const errorMessage = ref("");

const modalConfig = ref({
  message: "",
  buttonText: "Aceptar",
  onConfirm: () => { },
});

function openConfirm(publication) {
  selectedPublication.value = publication;
  modalConfig.value = {
    message: "¿Eliminar esta publicación?",
    buttonText: "Eliminar",
    onConfirm: () => deletePublication(publication.id),
  };
  showConfirmModal.value = true;
}

async function deletePublication(id) {
  if (!id) {
    errorMessage.value = "No se pudo eliminar la publicación";
    showErrorModal.value = true;
    return;
  }

  try {
    await deleteSpaceById(id);
    publications.value = publications.value.filter((p) => p.id !== id);
    spaceStore.removeSpaceFromStore(id);
  } catch (error) {
    console.error("Error al eliminar publicación", error);
  }
}

const fetchPublications = async () => {
  loading.value = true;
  const userId = userStore.user?.id;

  if (!userId) {
    publications.value = [];
    return;
  }

  try {
    const { data } = await api.get("spaces/myspaces", { withCredentials: true });
    publications.value = data || [];
  } catch (err) {
    console.error("Error al obtener publicaciones", err);
    publications.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(fetchPublications);

function editPublication(pub) {
  space.value = pub;
  openModal.value = true;
}
</script>

<style scoped>
section {
  animation: fadeIn 0.3s ease-in-out;
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
