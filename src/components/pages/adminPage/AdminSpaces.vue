<template>
  <section>
    <!-- Encabezado -->
    <div class="flex flex-col md:flex-row justify-between items-center">
      <h2 class="text-2xl font-semibold mb-4">Espacios</h2>
      <div class="flex gap-4">
        <span>Total: <strong class="text-primary">{{ spaces.length }}</strong></span>
        <span>Recientes: <strong class="text-primary">{{ recentSpaces.length }}</strong></span>
      </div>
    </div>

    <!-- Lista de espacios -->
    <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <li v-for="s in spaces" :key="s.id"
        class="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition cursor-pointer"
        @click="openModal(s)">
        <h3 class="text-lg font-bold text-primary">{{ s.name }}</h3>
        <p class="text-sm text-gray-500 truncate">{{ s.location }}</p>
        <p class="text-sm text-gray-400">Publicado: {{ formatDate(s.created_at) }}</p>
      </li>
    </ul>

    <!-- Modal de detalles -->
    <transition name="fade">
      <div v-if="selectedSpace" class="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
        <div class="bg-white rounded-2xl shadow-xl p-6 max-w-3xl w-full relative overflow-y-auto max-h-[90vh]">
          <!-- Cerrar -->
          <button @click="closeModal" class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl">
            ✕
          </button>

          <!-- Encabezado -->
          <div class="mb-4">
            <h3 class="text-2xl font-bold text-primary">{{ selectedSpace.name }}</h3>
            <p class="text-gray-600">{{ selectedSpace.location }}</p>
            <p class="text-sm text-gray-400">
              Publicado: {{ formatDate(selectedSpace.created_at) }}
            </p>
          </div>

          <!-- Imágenes -->
          <div v-if="selectedSpace.images?.length" class="grid grid-cols-2 gap-2 mb-4">
            <img v-for="(img, index) in selectedSpace.images" :key="index" :src="img"
              class="rounded-lg w-full h-40 object-cover border" />
          </div>

          <!-- Información general -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 mb-4">
            <p><strong>Tipo:</strong> {{ formatType(selectedSpace.type) }}</p>
            <p><strong>Periodo de reserva:</strong> {{ formatPeriod(selectedSpace.reservation_period) }}</p>
            <p><strong>Estado:</strong> {{ formatStatus(selectedSpace.status) }}</p>
            <p><strong>Categoría:</strong> {{ formatCategory(selectedSpace.category) }}</p>
            <p><strong>Tipo de estacionamiento:</strong> {{ selectedSpace.parking_type || 'N/A' }}</p>
            <p><strong>Calificación promedio:</strong> ⭐ {{ selectedSpace.average_rating }}</p>
          </div>

          <!-- Vehículos -->
          <div v-if="Array.isArray(selectedSpace.vehicle_capacities) && selectedSpace.vehicle_capacities.length"
            class="mb-4">
            <h4 class="font-semibold mb-2">Vehículos permitidos</h4>
            <ul class="space-y-2">
              <li v-for="(v, idx) in selectedSpace.vehicle_capacities" :key="idx"
                class="border p-2 rounded-md bg-gray-50 flex justify-between">
                <span class="capitalize">{{ vehicleTypeTranslations[v.type] }}</span>
                <span>Capacidad: {{ v.capacity }}</span>
                <span>${{ v.price_per_hour }}/hora</span>
              </li>
            </ul>
          </div>

          <!-- Métodos de pago -->
          <div v-if="selectedSpace.paymentMethods?.length" class="mb-4">
            <h4 class="font-semibold mb-2">Métodos de pago</h4>
            <div class="flex flex-wrap gap-2">
              <span v-for="(method, index) in selectedSpace.paymentMethods" :key="index"
                class="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                {{ method }}
              </span>
            </div>
          </div>

          <!-- Descripción -->
          <div v-if="selectedSpace.description" class="mb-4">
            <h4 class="font-semibold mb-1">Descripción</h4>
            <p class="text-gray-600 whitespace-pre-line">{{ selectedSpace.description }}</p>
          </div>

          <!-- Ubicación -->
          <div class="mb-4">
            <h4 class="font-semibold mb-1">Ubicación detallada</h4>
            <p class="text-gray-600">{{ selectedSpace.location_details || 'Sin detalles' }}</p>
            <p class="text-gray-500 text-sm">
              Lat: {{ selectedSpace.latitude }} | Lng: {{ selectedSpace.longitude }}
            </p>
          </div>

          <!-- Disponibilidad -->
          <div v-if="selectedSpace.availability" class="mb-4">
            <h4 class="font-semibold mb-1">Disponibilidad</h4>
            <pre
              class="text-sm bg-gray-50 p-2 rounded-md overflow-auto">{{ JSON.stringify(selectedSpace.availability, null, 2) }}</pre>
          </div>

          <!-- Botones -->
          <div class="flex justify-end mt-6 gap-3">
            <button class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition" @click="closeModal">
              Cerrar
            </button>
            <button class="px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition"
              @click="editSelected(selectedSpace)">
              Editar
            </button>
            <button class="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              @click="openConfirm(selectedSpace)">
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modales auxiliares -->
    <EditPublications :visible="showEditModal" :spaceId="selectedSpace?.id" @close="showEditModal = false"
      @updated="handleSpaceUpdated" />

    <ConfirmModal :visible="showConfirmModal" :message="modalConfig.message" :button-text="modalConfig.buttonText"
      @close="showConfirmModal = false" @acept="modalConfig.onConfirm" />

    <StatusModal :visible="showErrorModal" type="error" title="Error" :message="errorMessage"
      @confirm="showErrorModal = false" />
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { deleteSpaceById } from "../../../services/spaceService";
import { vehicleTypeTranslations } from "../../../utils/vehicleTypeIconTraslation";
import EditPublications from "../profilePage/UI/EditPublications.vue"
import ConfirmModal from "../../common/ConfirmModal.vue";
import StatusModal from "../addSpacePage/StatusModal.vue";
import { showToast } from "../../../utils/toast";

interface SpaceAttributes {
  id: number;
  name: string;
  location: string;
  created_at: string;
  images?: string[];
  type: string;
  reservation_period: string;
  status: string;
  category: string;
  parking_type?: string;
  average_rating?: number;
  vehicle_capacities?: { type: string; capacity: number; price_per_hour: number }[];
  paymentMethods?: string[];
  description?: string;
  location_details?: string;
  latitude?: number;
  longitude?: number;
  availability?: Record<string, any>;
}

const props = defineProps<{ spaces: SpaceAttributes[] }>();
const emit = defineEmits(["refresh"]);

const selectedSpace = ref<SpaceAttributes | null>(null);
const showEditModal = ref(false);
const showConfirmModal = ref(false);
const showErrorModal = ref(false);
const errorMessage = ref("");

const handleSpaceUpdated = async (data?: any) => {
  await refreshSpaces('edit', data);
  showEditModal.value = false;

  if (data) {
    selectedSpace.value = data;
    showEditModal.value = true;
  }
};

const modalConfig = ref({
  message: "",
  buttonText: "Eliminar",
  onConfirm: () => { },
});

const openModal = (space: SpaceAttributes) => (selectedSpace.value = space);
const closeModal = () => (selectedSpace.value = null);

const recentSpaces = computed(() =>
  props.spaces.filter((s) => {
    const diff = (Date.now() - new Date(s.created_at || "").getTime()) / (1000 * 3600 * 24);
    return diff <= 7;
  })
);

const formatDate = (value: any) =>
  new Date(value).toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" });

const formatType = (type: string) => ({ garage: "Garaje", large_space: "Espacio grande", private_parking: "Estacionamiento privado" }[type] || type);
const formatPeriod = (period: string) => ({ hour: "Por hora", day: "Por día", week: "Por semana", month: "Por mes" }[period] || period);
const formatStatus = (status: string) => ({ active: "Activo", paused: "Pausado", pending_review: "Pendiente de revisión" }[status] || status);
const formatCategory = (category: string) => ({ private: "Privado", university: "Universitario", public: "Público" }[category] || category);

const openConfirm = (space: SpaceAttributes) => {
  modalConfig.value = {
    message: `¿Eliminar el espacio "${space.name}"?`,
    buttonText: "Eliminar",
    onConfirm: async () => {
      await deleteSpace(space.id);
      showConfirmModal.value = false;
    },
  };
  showConfirmModal.value = true;
};

const editSelected = (space: SpaceAttributes) => {
  selectedSpace.value = space;
  showEditModal.value = true;
};

const deleteSpace = async (id: number) => {
  try {
    await deleteSpaceById(id);
    closeModal();
    showToast("Espacio eliminado correctamente.", "success");
    await refreshSpaces('delete', { id });
  } catch (error) {
    errorMessage.value = "Error al eliminar el espacio.";
    showErrorModal.value = true;
  }
};

const refreshSpaces = async (action?: string, payload?: any) => {
  emit("refresh", action, payload);
  showEditModal.value = false;
};

</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
