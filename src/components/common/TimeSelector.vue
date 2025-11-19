<template>
  <Teleport to="body">
    <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center 
             bg-black/40 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-xl w-[300px] max-h-[80vh] 
               flex flex-col overflow-hidden border border-gray-200">
        <!-- Header -->
        <div class="px-4 py-3 border-b bg-gray-50 text-primary font-bold text-lg">
          Seleccioná horario
        </div>

        <!-- Content -->
        <div class="flex justify-center items-center flex-1 overflow-hidden">
          <div class="flex gap-4 px-4 py-6">

            <!-- Horas -->
            <select v-model="selectedHour" class="scroll-picker bg-gray-100 text-black rounded-xl px-3 py-2 
                     border border-gray-300 shadow-sm focus:ring-2 
                     focus:ring-primary/50 focus:border-primary transition">
              <option v-for="h in validHours" :key="h" :value="h">
                {{ h.toString().padStart(2, '0') }}
              </option>
            </select>

            <span class="text-xl font-bold text-gray-600">:</span>

            <!-- Minutos -->
            <select v-model="selectedMinute" class="scroll-picker bg-gray-100 text-black rounded-xl px-3 py-2 
                     border border-gray-300 shadow-sm focus:ring-2 
                     focus:ring-primary/50 focus:border-primary transition">
              <option v-for="m in validMinutes" :key="m" :value="m">
                {{ m.toString().padStart(2, '0') }}
              </option>
            </select>

          </div>
        </div>

        <!-- Footer -->
        <div class="border-t px-4 py-3 flex justify-between bg-gray-50">
          <button @click="close" class="text-sm text-gray-500 hover:text-primary transition">
            Cancelar
          </button>
          <button @click="confirm" class="text-sm text-primary font-semibold hover:opacity-80 transition">
            Confirmar
          </button>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  visible: Boolean,
  start: String,
  end: String
});
const emit = defineEmits(['close', 'select']);

const selectedHour = ref(null);
const selectedMinute = ref(null);

const [startHour, startMin] = props.start.split(':').map(Number);
const [endHour, endMin] = props.end.split(':').map(Number);

const validHours = computed(() => {
  const hours = [];
  for (let h = startHour; h <= endHour; h++) {
    hours.push(h);
  }
  return hours;
});

const validMinutes = computed(() => {
  const mins = [];
  for (let m = 0; m < 60; m++) {
    mins.push(m);
  }
  return mins;
});

watch(() => props.visible, (val) => {
  if (val) {
    selectedHour.value = startHour;
    selectedMinute.value = startMin;
  }
});

function close() {
  emit('close');
}

function confirm() {
  const selected = new Date();
  selected.setHours(selectedHour.value, selectedMinute.value, 0, 0);

  // Validación dentro del rango permitido
  const min = new Date();
  min.setHours(startHour, startMin, 0, 0);
  const max = new Date();
  max.setHours(endHour, endMin, 0, 0);

  if (selected >= min && selected <= max) {
    const formatted = selected.toTimeString().slice(0, 5);
    emit('select', formatted);
    close();
  }
}
</script>

<style scoped>
.scroll-picker {
  height: 160px;
  overflow-y: scroll;
  font-size: 1.25rem;
  font-weight: 500;
  border: none;
  background: transparent;
  text-align: center;
  appearance: none;
}

.scroll-picker::-webkit-scrollbar {
  width: 0;
}
</style>
