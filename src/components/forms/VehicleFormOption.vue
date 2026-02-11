<template>
  <div
    class="bg-white/5 border border-white/10 rounded-2xl shadow-sm backdrop-blur
           transition-all hover:shadow-md">

    <!-- Header -->
    <div class="flex justify-between items-start px-5 py-4 cursor-pointer"
         @click="toggleExpanded">
      <div class="space-y-1">
        <h2 class="text-lg sm:text-xl font-semibold text-gray-100">
          {{ title }}
        </h2>

        <p class="text-gray-400 text-sm">{{ text }}</p>

        <transition name="fade">
          <p v-if="configured"
             class="text-newgreen mt-1 text-sm font-medium">
            ✔ Configurado: capacidad {{ configuration.capacity }},
            ${{ configuration.price_per_hour }}/hora
          </p>
        </transition>
      </div>

      <button
        class="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold
               shadow hover:bg-primary/90 active:scale-95 transition-all"
        @click.stop="toggleExpanded">
        {{ expanded ? 'Cerrar' : configured ? 'Editar' : 'Configurar' }}
      </button>
    </div>

    <!-- Form expanded -->
    <transition name="expand">
      <div
        v-if="expanded"
        class="px-5 pb-6 space-y-4 bg-white/5 border-t border-white/10 pt-3">

        <!-- Capacidad -->
        <div>
          <label class="text-sm text-gray-200 font-medium mb-1 block">
            Capacidad
          </label>
          <input
            type="number"
            v-model="localConfig.capacity"
            class="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-2
                   text-gray-200 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            placeholder="Cantidad de vehículos" />
        </div>

        <!-- Precio por hora -->
        <div>
          <label class="text-sm text-gray-200 font-medium mb-1 block">
            Precio por hora ($)
          </label>
          <input
            type="number"
            v-model="localConfig.price_per_hour"
            class="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-2
                   text-gray-200 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            placeholder="Precio" />
        </div>

        <!-- Action buttons -->
        <div class="flex justify-end gap-3 pt-1">
          <button
            class="px-4 py-2 bg-white/10 text-gray-200 rounded-lg text-sm font-medium
                   hover:bg-white/20 active:scale-95 transition-all"
            @click="cancel">
            Cancelar
          </button>

          <button
            v-if="configured"
            class="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium
                   hover:bg-red-600 active:scale-95 transition-all"
            @click="remove">
            Eliminar
          </button>

          <button
            class="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium
                   hover:bg-primary/90 active:scale-95 transition-all"
            @click="save">
            Guardar
          </button>
        </div>
      </div>
    </transition>
  </div>

  <!-- Error modal -->
  <StatusModal
    :visible="showErrorModal"
    :message="errorMessage"
    title="¡Atención!"
    :icon="logo"
    @confirm="showErrorModal = false"
  />
</template>

<script setup>
import { ref, watch } from 'vue'
import StatusModal from '../pages/addSpacePage/StatusModal.vue';
import logo from "../../assets/logo.png";

const props = defineProps(['value', 'title', 'text', 'configured', 'configuration'])
const emit = defineEmits(['save', 'remove'])

const showErrorModal = ref(false);
const errorMessage = ref('');

const expanded = ref(false)
const localConfig = ref({
  type: props.value,
  capacity: props.configuration?.capacity || '',
  price_per_hour: props.configuration?.price_per_hour || '',
})

// Actualiza los valores locales si cambia la configuración externa
watch(
  () => props.configuration,
  (newVal) => {
    if (!newVal) return;

    localConfig.value = {
      type: props.value,
      capacity: newVal.capacity,
      price_per_hour: newVal.price_per_hour
    }
  },
  { immediate: true }
);


function toggleExpanded() {
  expanded.value = !expanded.value
}

function cancel() {
  expanded.value = false
}

function save() {

  if (localConfig.value.capacity < 1) {
    errorMessage.value = 'La cantidad de vehículos debe ser al menos 1';
    showErrorModal.value = true;
    return;
  }
  if (localConfig.value.price_per_hour < 100) {
    errorMessage.value = 'El precio por hora debe ser al menos $100';
    showErrorModal.value = true;
    return;
  }

  emit('save', { ...localConfig.value })
  expanded.value = false
}

function remove() {
  emit('remove', props.value)
  expanded.value = false
}
</script>

<style scoped>
/* Transición suave al abrir/cerrar */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}

.expand-enter-to,
.expand-leave-from {
  max-height: 500px;
  opacity: 1;
}

/* Suaviza aparición de texto */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
