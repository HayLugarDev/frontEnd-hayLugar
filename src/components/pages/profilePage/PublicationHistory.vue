<template>
  <section class="bg-white p-2 md:p-8 rounded-lg shadow-lg mb-8 w-full md:w-2/3">
    <ul v-if="publications?.length" class="divide-y divide-gray-300 relative">
      <li v-for="(publication, index) in publications" :key="index"
        class="border border-yellow-200 rounded-xl p-5 shadow-md hover:shadow-lg transition-all bg-gray-50 space-y-1 text-sm lg:text-lg">
        <div
          class="flex flex-col xl:grid xl:grid-cols-4 xl:grid-rows-4 text-gray-700 font-semibold text-[.9rem] sm:text-[1rem]">
          <div class="col-span-2 flex flex-row gap-1">
            <span class="font-bold">Nombre del espacio: </span>
            <p class="text-gray-500 font-normal">{{ publication.name }}</p>
          </div>
          <div class="col-span-2 flex flex-row gap-1">
            <span class="font-bold">Dirección: </span>
            <p class="text-gray-500 font-normal">{{ publication.location.split(',')[0] }}</p>
          </div>
          <div class="col-span-2 flex flex-row gap-1">
            <span class="font-bold">Publicado: </span>
            <p class="text-gray-500 font-normal">{{ formatDate(publication.created_at) }}</p>
          </div>
          <div class="col-span-2 flex flex-row gap-1">
            <span class="font-bold">Tipo: </span>
            <p class="text-gray-500 font-normal">{{ publication.type.toUpperCase() }}</p>
          </div>
          <div class="col-span-2 flex flex-row gap-1">
            <span class="font-bold">Categoría: </span>
            <p class="text-gray-500 font-normal">{{ getSpanishCategory(publication.category) }}</p>
          </div>
          <div class="col-span-2 flex flex-row gap-1">
            <span class="font-bold">Estado: </span>
            <p class="text-green-800">{{ getSpanishState(publication.status) }}</p>
          </div>
        </div>
        <div class="flex lg:flex-row flex-col lg:items-center space-x-2 mt-2">
          <div class="flex flex-row gap-1 items-center">
            <font-awesome-icon icon="car" class="mr-2 text-primary" />
            <span class="font-bold">Vehículos aceptados:</span>
          </div>
          <div class="flex flex-wrap gap-2 mt-2 lg:mt-0">
            <div v-for="v in publication.vehicle_capacities" :key="v.type"
              class="p-2 border rounded-xl text-center w-28 bg-white shadow-sm hover:shadow-md transition">
              <font-awesome-icon :icon="['fas', getVehicleIcon(v.type)]" class="text-gray-600 text-xl mb-1" />
              <p class="text-xs text-gray-700 capitalize">{{ getVehicleType(v.type) }}</p>
              <p v-if="v.price_per_hour" class="text-sm font-medium text-primary">
                ${{ v.price_per_hour.toLocaleString() }}/h
              </p>
            </div>
          </div>
        </div>
        <div class="flex flex-row items-center justify-end gap-1">

          <button @click="editPublication(publication)"
            class="bg-yellow-300 text-white px-4 py-2 rounded-lg shadow hover:bg-yellow-400 transition-all flex items-center justify-center gap-2 w-full md:w-auto mt-4">
            <font-awesome-icon :icon="['fas', 'pen-to-square']" />
            Editar
          </button>

          <button @click="deletePublication(publication)"
            class="bg-red-400 text-white px-4 py-2 rounded-lg shadow hover:bg-red-500 transition-all flex items-center justify-center gap-2 w-full md:w-auto mt-4">
            <font-awesome-icon :icon="['fas', 'square-xmark']" />
            Eliminar
          </button>

        </div>
      </li>
    </ul>
    <p v-else class="text-gray-500">No tienes publicaciones anteriores.</p>
    <EditPublications :visible="openModal" :spaceId="space?.id" @close="openModal = false"
      @updated="fetchPublications" />
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

const userStore = useUserStore();
const openModal = ref(false);

const fetchPublications = async () => {
  const userId = userStore.user?.id;
  if (!userId) {
    console.error("No se encontró el ID de usuario en userStore");
    return;
  }
  try {
    const response = await api.get(`spaces/myspaces`);
    publications.value = response.data;
    console.log(publications.value);
  } catch (error) {
    console.error("Error al obtener historial de publicaciones", error);
  }
};

onMounted(() => {
  fetchPublications();
});

const editPublication = (pub: Publication) => {
  space.value = pub;  // pasamos la publicación seleccionada
  openModal.value = true;
};

const deletePublication = async (pub: Publication) => {
  if (!confirm(`¿Seguro que deseas eliminar "${pub.name}"?`)) return;
  try {
    await api.delete(`spaces/${pub.id}`, { withCredentials: true });
    publications.value = publications.value.filter((p: any) => p.id !== pub.id);
  } catch (error) {
    console.error("Error al eliminar publicación", error);
  }
};
</script>