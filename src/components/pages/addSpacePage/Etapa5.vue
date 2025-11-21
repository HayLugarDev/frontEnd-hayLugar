<template>
  <div
    class="md:min-h-[80vh] flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] text-white animate-fade-in"
  >
    <!-- Capa decorativa -->
    <div class="pointer-events-none absolute inset-0 overflow-hidden -z-10">
      <div class="absolute -right-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-white/10 blur-3xl"></div>
      <div class="absolute -left-32 -bottom-40 h-[26rem] w-[26rem] rounded-full bg-accent/20 blur-3xl"></div>
    </div>

    <!-- Contenedor principal -->
    <div
      class="rounded-2xl shadow-2xl backdrop-blur-lg w-full max-w-3xl space-y-8"
    >
      <!-- Título -->
      <div class="text-center">
        <h2 class="text-3xl font-extrabold text-primary mb-2">
            Resumen antes de publicar
        </h2>
        <p class="text-gray-300 text-sm">
          Verificá los datos antes de confirmar tu publicación
        </p>
      </div>

      <!-- Datos principales -->
      <div class="grid sm:grid-cols-2 gap-4 p-2">
        <div>
          <p class="text-gray-500 text-sm">📍 Nombre</p>
          <p class="font-semibold text-lg">{{ modelValue.name }}</p>
        </div>

        <div>
          <p class="text-gray-500 text-sm">🏷️ Tipo de espacio</p>
          <p class="font-semibold capitalize">{{ modelValue.parking_type }}</p>
        </div>

        <div class="sm:col-span-2">
          <p class="text-gray-500 text-sm">📬 Dirección</p>
          <p class="font-semibold">{{ modelValue.location }}, {{ modelValue.locationDetails }}</p>
        </div>

        <div>
          <p class="text-gray-500 text-sm">💡 Tipo de plazo ofrecido</p>
          <p class="font-semibold capitalize">
            {{
              modelValue.reservation_period === 'hour'
                ? 'Por hora'
                : modelValue.reservation_period === 'day'
                ? 'Por día'
                : modelValue.reservation_period === 'week'
                ? 'Por semana'
                : 'Por mes'
            }}
          </p>
        </div>

        <div>
          <p class="text-gray-500 text-sm">🕒 Horarios disponibles</p>
          <p class="font-semibold">
            {{
              modelValue.reservation_period === 'month'
                ? 'Todos los días'
                : `${modelValue.availability.start} - ${modelValue.availability.end} hs`
            }}
          </p>
        </div>

        <div>
          <p class="text-gray-500 text-sm">💳 Métodos de pago</p>
          <p class="font-semibold">
            MercadoPago
          </p>
        </div>

        <div>
          <p class="text-gray-500 text-sm">📢 Publicación activa</p>
          <p
            :class="modelValue.status === 'active' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'"
          >
            {{ modelValue.status === 'active' ? 'Sí' : 'No' }}
          </p>
        </div>
      </div>

      <!-- Capacidades y precios -->
      <div>
        <h3 class="text-lg font-bold text-primary">🚘 Tipos de vehículos y precios</h3>
        <div
          class="grid sm:grid-cols-2 gap-1"
          v-if="modelValue.vehicle_capacities && modelValue.vehicle_capacities.length"
        >
          <div
            v-for="(v, i) in modelValue.vehicle_capacities"
            :key="i"
            class="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 shadow-sm"
          >
            <div class="flex items-center gap-2">
              <font-awesome-icon :icon="['fas', `${getVehicleIcon(v.type)}`]"
                class="text-primary text-lg"
              />
              <span class="font-semibold capitalize">{{ getVehicleType(v.type) }}</span>
            </div>
            <span class="font-bold text-gray-700">${{ v.price_per_hour.toLocaleString() }}/h</span>
          </div>
        </div>
        <p v-else class="text-gray-400 italic">No hay vehículos configurados.</p>
      </div>

      <!-- Descripción -->
      <div>
        <h3 class="text-lg font-bold text-primary mb-3">📝 Descripción</h3>
        <p class="bg-gray-50 text-gray-700 rounded-xl p-4 border border-gray-200 whitespace-pre-wrap">
          {{ modelValue.description || 'Sin descripción disponible.' }}
        </p>
      </div>

      <!-- Imágenes -->
      <div>
        <h3 class="text-lg font-bold text-primary mb-3">🖼️ Imágenes cargadas</h3>
        <div v-if="modelValue.images.length" class="flex flex-wrap gap-3">
          <img
            v-for="(img, index) in modelValue.images"
            :key="index"
            :src="getImageSrc(img)"
            class="w-28 h-28 object-cover rounded-xl shadow-md border border-gray-200"
          />
        </div>
        <p v-else class="text-gray-400 italic">No se subieron imágenes aún.</p>
      </div>

      <!-- Acciones -->
      <div class="flex flex-col md:flex-row gap-4 justify-between pt-6 border-t border-gray-200">
        <button
          @click="emit('prev')"
          class="px-6 py-2 border-2 border-primary text-primary rounded-full font-semibold hover:bg-primary hover:text-white transition-all"
        >
          ← Volver a editar
        </button>

        <button
          type="button"
          @click="submitForm"
          class="px-8 py-2 bg-primary text-white rounded-full font-bold shadow-md hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <img v-if="cargando" :src="loadIcon" alt="Cargando" class="w-5 h-5 animate-spin" />
          <span v-else>Confirmar y Publicar</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import loadIcon from '../../../assets/load-icon_secondary.svg';
import { getVehicleIcon, getVehicleType } from '../../../utils/vehicleTypeIconTraslation';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue', 'next', 'prev', 'submit']);

const cargando = ref(false);

onMounted(() => {
    console.log(props.modelValue);
});

// Función segura para mostrar imágenes
const getImageSrc = (img: string | File | null | undefined) => {
    if (!img) return '';
    return typeof img === 'string' ? img : URL.createObjectURL(img);
};

onUnmounted(() => {
    props.modelValue.images.forEach((img: string | File | null | undefined) => {
        if (img instanceof File) {
            URL.revokeObjectURL(img as any);
        }
    });
});


const submitForm = () => {
    cargando.value = true;
    emit('submit');
};
</script>

<style scoped>
.input-field {
    @apply w-full mt-2 p-2 border border-gray-300 rounded;
}
</style>
