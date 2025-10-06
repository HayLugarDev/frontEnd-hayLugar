<template>
  <section class="lg:bg-white p-2 md:p-8 rounded-lg shadow-lg mb-8 w-full md:w-2/3">
    <!-- Título -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-primary">📦 Tus publicaciones</h2>
        <p class="text-sm text-gray-600 px-4">Gestioná tus espacios publicados de forma simple y visual</p>
      </div>
    </div>

    <div v-if="loading" class="space-y-4">
      <ItemSkeleton />
      <ItemSkeleton />
    </div>

    <div v-else-if="publications.length">
      <div v-for="(publication, index) in publications" :key="index"
        class="border border-gray-200 rounded-2xl bg-gradient-to-b from-gray-50 to-white shadow-md hover:shadow-lg transition-all overflow-hidden">
        <div class="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-100">
          <div>
            <h3 class="text-lg font-bold text-gray-800 flex items-center gap-2">
              <font-awesome-icon icon="warehouse" class="text-primary" />
              {{ publication.name }}
            </h3>
            <p class="text-xs text-gray-500">{{ publication.location.split(',')[0] }}</p>
          </div>
          <span :class="[
            'px-3 py-1 rounded-full text-xs font-semibold',
            publication.status === 'active'
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-600'
          ]">
            {{ getSpanishState(publication.status) }}
          </span>
        </div>

        <div class="p-5 space-y-3 text-sm text-gray-700">
          <div class="grid md:grid-cols-2 gap-x-4 gap-y-2">
            <p><span class="font-semibold">📅 Publicado:</span> {{ formatDate(publication.created_at) }}</p>
            <p><span class="font-semibold">🏷️ Tipo:</span> {{ publication.type.toUpperCase() }}</p>
            <p><span class="font-semibold">🧭 Categoría:</span> {{ getSpanishCategory(publication.category) }}</p>
            <p><span class="font-semibold">🚘 Vehículos:</span> {{ publication.vehicle_capacities.length }}</p>
          </div>

          <div class="pt-2">
            <p class="font-semibold mb-2 text-gray-800 flex items-center gap-1">
              <font-awesome-icon icon="car" class="text-primary" /> Vehículos aceptados
            </p>
            <div class="flex flex-wrap gap-2">
              <div v-for="v in publication.vehicle_capacities" :key="v.type"
                class="flex flex-col items-center p-2 border rounded-xl bg-white shadow-sm hover:shadow-md transition-all w-24">
                <font-awesome-icon :icon="['fas', getVehicleIcon(v.type)]" class="text-gray-700 text-lg mb-1" />
                <span class="text-xs capitalize text-gray-600">{{ getVehicleType(v.type) }}</span>
                <span v-if="v.price_per_hour" class="text-xs font-semibold text-primary">
                  ${{ v.price_per_hour.toLocaleString() }}/h
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Acciones -->
        <div class="flex items-center justify-between border-t border-gray-200 p-4 bg-gray-50">
          <button @click="editPublication(publication)"
            class="flex items-center justify-center gap-2 text-sm font-semibold bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-4 py-2 rounded-xl shadow hover:shadow-lg transition-all">
            <font-awesome-icon :icon="['fas', 'pen-to-square']" /> Editar
          </button>
          <button @click="openConfirm(publication)"
            class="flex items-center justify-center gap-2 text-sm font-semibold bg-gradient-to-r from-red-400 to-red-500 text-white px-4 py-2 rounded-xl shadow hover:shadow-lg transition-all">
            <font-awesome-icon :icon="['fas', 'trash']" /> Eliminar
          </button>
        </div>
      </div>
    </div>

    <p v-else-if="!loading" class="text-gray-500">No tienes publicaciones anteriores.</p>

    <EditPublications :visible="openModal" :spaceId="space?.id" @close="openModal = false"
      @updated="fetchPublications" />
    <ConfirmModal :visible="showConfirmModal" :message="modalConfig.message" :button-text="modalConfig.buttonText"
      @close="showConfirmModal = false" @acept="() => { modalConfig.onConfirm(); showConfirmModal = false }" />
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '../../../store/userStore';
import api from '../../../services/apiService';
import { getVehicleIcon, getVehicleType } from '../../../utils/vehicleTypeIconTraslation';
import { getSpanishState, SpaceStatus } from '../../../utils/SpaceStatusTraslation';
import { SpaceCategory, getSpanishCategory } from '../../../utils/SpaceCategoryTraslation';
import EditPublications from './UI/EditPublications.vue';
import { formatDate } from '../../../utils/FormatDate';
import ConfirmModal from '../../common/ConfirmModal.vue';
import ItemSkeleton from '../../layout/skeletons/ItemSkeleton.vue';

export interface VehicleCapacity {
  type: 'car' | 'motorcycle' | 'van' | 'bicycle';
  capacity: number;
  price_per_hour: number;
}

export interface Publication {
  id: number;
  name: string;
  location: string;
  description: string;
  created_at: string;
  type: string;
  category: SpaceCategory;
  status: SpaceStatus;
  vehicle_capacities: VehicleCapacity[];
}

const publications = ref<Publication[]>([]);
const space = ref<Publication | null>(null);
const selectedPublication = ref<Publication | null>(null);

const userStore = useUserStore();
const showConfirmModal = ref(false);
const openModal = ref(false);
const loading = ref(true);

const modalConfig = ref({
  message: '',
  buttonText: 'Aceptar',
  onConfirm: () => { }
});

function openConfirm(publication: Publication) {
  selectedPublication.value = publication;
  modalConfig.value = {
    message: '¿Eliminar esta publicación?',
    buttonText: 'Eliminar',
    onConfirm: () => deletePublication(publication.id)
  };
  showConfirmModal.value = true;
}

const fetchPublications = async () => {
  loading.value = true;
  const userId = userStore.user?.id;
  if (!userId) {
    console.error('No se encontró el ID de usuario en userStore');
    publications.value = [];
    return;
  }
  try {
    const { data } = await api.get(`spaces/myspaces`, { withCredentials: true });
    publications.value = data || [];
  } catch (error) {
    console.error('Error al obtener publicaciones', error);
    publications.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchPublications();
});

const editPublication = (pub: Publication) => {
  space.value = pub;
  openModal.value = true;
};

const deletePublication = async (id: number) => {
  try {
    await api.delete(`spaces/${id}`, { withCredentials: true });
    publications.value = publications.value.filter(p => p.id !== id);
  } catch (error) {
    console.error('Error al eliminar publicación', error);
  }
};
</script>
