<template>
  <section class="space-y-6 px-6">

    <!-- Encabezado -->
    <div class="flex flex-col md:flex-row justify-between items-center">
      <h2 class="text-2xl font-bold text-primary tracking-wide">Espacios</h2>

      <div class="flex gap-6 mt-3 md:mt-0">
        <div class="flex flex-col items-center bg-white/5 backdrop-blur px-4 py-2 rounded-lg border border-white/10">
          <p class="text-xs text-gray-300">Total</p>
          <p class="text-lg font-semibold text-primary">{{ spaces.length }}</p>
        </div>

        <div class="flex flex-col items-center bg-white/5 backdrop-blur px-4 py-2 rounded-lg border border-white/10">
          <p class="text-xs text-gray-300">Recientes</p>
          <p class="text-lg font-semibold text-primary">{{ recentSpaces.length }}</p>
        </div>
      </div>
    </div>

    <!-- Lista de espacios -->
    <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <li v-for="s in spaces" :key="s.id" @click="openModal(s)"
        class="group p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-md hover:shadow-lg hover:bg-white/10 transition cursor-pointer flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-primary truncate">{{ s.name }}</h3>
          <span class="text-xs bg-primary/20 text-primary px-2 py-1 rounded-lg">
            {{ formatStatus(s.status) }}
          </span>
        </div>

        <p class="text-gray-300 text-sm truncate">{{ s.location }}</p>

        <p class="text-xs text-gray-400">
          Publicado: <strong>{{ formatDate(s.created_at) }}</strong>
        </p>
      </li>
    </ul>

    <!-- Modal -->
    <transition name="fade">
      <div v-if="selectedSpace"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
        <div
          class="bg-[#0D1B2A] text-white rounded-2xl shadow-2xl p-8 max-w-3xl w-full relative max-h-[92vh] overflow-y-auto border border-white/10">
          <!-- Cerrar -->
          <button @click="closeModal" class="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl">
            ✕
          </button>

          <!-- Header -->
          <div class="mb-6 border-b border-white/10 pb-4">
            <h3 class="text-3xl font-bold text-primary">{{ selectedSpace.name }}</h3>
            <p class="text-gray-300">{{ selectedSpace.location }}</p>
            <p class="text-sm text-gray-400">
              Publicado: {{ formatDate(selectedSpace.created_at) }}
            </p>
          </div>

          <!-- Imágenes -->
          <div v-if="selectedSpace.images?.length" class="grid grid-cols-2 gap-3 mb-6">
            <img v-for="(img, idx) in selectedSpace.images" :key="idx" :src="img"
              class="rounded-xl w-full h-40 object-cover border border-white/10" />
          </div>

          <!-- Info general -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-200 mb-6">
            <InfoRow label="Tipo">{{ formatType(selectedSpace.type) }}</InfoRow>
            <InfoRow label="Periodo">{{ formatPeriod(selectedSpace.reservation_period) }}</InfoRow>
            <InfoRow label="Estado">{{ formatStatus(selectedSpace.status) }}</InfoRow>
            <InfoRow label="Categoría">{{ formatCategory(selectedSpace.category) }}</InfoRow>
            <InfoRow label="Estacionamiento">{{ selectedSpace.parking_type || "N/A" }}</InfoRow>
            <InfoRow label="Calificación">⭐ {{ selectedSpace.average_rating }}</InfoRow>
          </div>

          <!-- Vehículos -->
          <div v-if="selectedSpace.vehicle_capacities?.length" class="mb-6">
            <h4 class="font-semibold text-lg mb-2 text-primary">Vehículos permitidos</h4>
            <ul class="space-y-3">
              <li v-for="(v, idx) in selectedSpace.vehicle_capacities" :key="idx"
                class="p-3 bg-white/5 border border-white/10 rounded-xl flex justify-between items-center">
                <span class="capitalize">{{ vehicleTypeTranslations[v.type] }}</span>
                <span class="text-gray-300">Capacidad: {{ v.capacity }}</span>
                <span class="font-semibold text-primary">${{ v.price_per_hour }}/h</span>
              </li>
            </ul>
          </div>

          <!-- Métodos de pago -->
          <div v-if="selectedSpace.paymentMethods?.length" class="mb-6">
            <h4 class="font-semibold text-lg mb-2 text-primary">Métodos de pago</h4>
            <div class="flex flex-wrap gap-2">
              <span v-for="(method, idx) in selectedSpace.paymentMethods" :key="idx"
                class="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm">
                {{ method }}
              </span>
            </div>
          </div>

          <!-- Descripción -->
          <div v-if="selectedSpace.description" class="mb-6">
            <h4 class="font-semibold text-lg mb-2 text-primary">Descripción</h4>
            <p class="text-gray-300 leading-relaxed whitespace-pre-line">
              {{ selectedSpace.description }}
            </p>
          </div>

          <!-- Ubicación -->
          <div class="mb-6">
            <h4 class="font-semibold text-lg mb-2 text-primary">Ubicación detallada</h4>
            <p class="text-gray-300">
              {{ selectedSpace.location_details || "Sin detalles" }}
            </p>
            <p class="text-gray-400 text-sm mt-1">
              Lat: {{ selectedSpace.latitude }} | Lng: {{ selectedSpace.longitude }}
            </p>
          </div>

          <!-- Disponibilidad -->
          <div v-if="selectedSpace.availability" class="mb-8">
            <h4 class="font-semibold text-lg mb-2 text-primary">Disponibilidad</h4>
            <pre class="bg-white/5 p-3 rounded-xl border border-white/10 text-sm text-gray-200 overflow-auto">
              {{ JSON.stringify(selectedSpace.availability, null, 2) }}
            </pre>
          </div>

          <!-- Botones -->
          <div class="flex justify-end gap-4">
            <button @click="closeModal" class="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition">
              Cerrar
            </button>

            <button @click="editSelected(selectedSpace)"
              class="px-4 py-2 rounded-xl bg-yellow-500 text-white hover:bg-yellow-600 shadow-lg">
              Editar
            </button>

            <button @click="openConfirm(selectedSpace)"
              class="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 shadow-lg">
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
