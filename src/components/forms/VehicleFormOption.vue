<template>
  <div
    class="border border-gray-200 bg-white rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md relative overflow-hidden">
    <!-- Encabezado -->
    <div class="flex justify-between items-center cursor-pointer px-5 py-4" @click="toggleExpanded">
      <div>
        <h2 class="text-lg sm:text-xl font-semibold text-gray-800">
          {{ title }}
        </h2>
        <p class="text-gray-500 text-sm">{{ text }}</p>

        <transition name="fade">
          <p v-if="configured" class="text-emerald-600 mt-1 text-sm font-medium">
            ✅ Configurado: capacidad {{ configuration.capacity }},
            ${{ configuration.price_per_hour }}/hora
          </p>
        </transition>
      </div>

      <button
        class="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-blue-700 active:scale-95"
        @click.stop="toggleExpanded">
        {{ expanded ? 'Cerrar' : configured ? 'Editar' : 'Configurar' }}
      </button>
    </div>

    <!-- Contenido expandido -->
    <transition name="expand">
      <div v-if="expanded" class="px-5 pb-5 space-y-3 bg-gray-50 rounded-b-2xl">
        <div class="pt-3">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Capacidad
          </label>
          <input type="number" v-model="localConfig.capacity"
            class="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-200"
            placeholder="Cantidad de vehículos" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Precio por hora ($)
          </label>
          <input type="number" v-model="localConfig.price_per_hour"
            class="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-200"
            placeholder="Precio" />
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <button
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 active:scale-95 transition-all"
            @click="cancel">
            Cancelar
          </button>
          <button v-if="configured"
            class="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 active:scale-95 transition-all"
            @click="remove">
            Eliminar
          </button>
          <button
            class="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 active:scale-95 transition-all"
            @click="save">
            Guardar
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps(['value', 'title', 'text', 'configured', 'configuration'])
const emit = defineEmits(['save', 'remove'])

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
    localConfig.value.capacity = newVal?.capacity || ''
    localConfig.value.price_per_hour = newVal?.price_per_hour || ''
  }
)

function toggleExpanded() {
  expanded.value = !expanded.value
}

function cancel() {
  expanded.value = false
}

function save() {
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
