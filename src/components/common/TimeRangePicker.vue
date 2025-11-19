<template>
  <div class="p-6 bg-white/5 backdrop-blur-xl border border-white/10 
           rounded-2xl shadow-xl text-white">
    <!-- Título -->
    <legend class="text-xl font-bold text-white mb-3">
      Horario de disponibilidad
    </legend>

    <!-- Rango -->
    <div class="flex justify-between mb-4 text-sm font-medium text-gray-300">
      <span>
        Desde:
        <strong class="text-white">{{ formattedStart }}</strong>
      </span>

      <span>
        Hasta:
        <strong class="text-white">{{ formattedEnd }}</strong>
      </span>
    </div>

    <!-- Horas -->
    <div class="grid grid-cols-6 md:grid-cols-12 gap-2 select-none">
      <div v-for="(hour, index) in hours" :key="index" @click="toggleHour(hour)" :class="[
        'h-8 flex items-center justify-center text-xs cursor-pointer rounded-md transition-all duration-150 border',
        selectedHours.includes(hour)
          ? 'bg-[#00B4D8] text-white border-[#00B4D8] shadow font-semibold'
          : 'bg-white/10 border-white/10 text-gray-300 hover:bg-white/20'
      ]">
        {{ hour }}
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, computed, watch, defineProps, defineEmits } from 'vue';

const props = defineProps({
  startTime: { type: String, default: '07:00' },
  endTime: { type: String, default: '22:00' },
  step: { type: Number, default: 30 },
  modelValue: {
    type: Object as () => { start?: string; end?: string },
    default: () => ({ start: '', end: '' })
  }
});

const emit = defineEmits(['update:modelValue']);
const selectedHours = ref<string[]>([]);

const hours = computed(() => {
  const start = props.startTime.split(':').map(Number);
  const end = props.endTime.split(':').map(Number);
  const result: string[] = [];
  let hour = start[0], minute = start[1];
  while (hour < end[0] || (hour === end[0] && minute <= end[1])) {
    result.push(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);
    minute += props.step;
    if (minute >= 60) { hour++; minute = 0; }
  }
  return result;
});

const toggleHour = (hour: string) => {
  if (selectedHours.value.length <= 1) {
    const first = selectedHours.value[0];
    if (!first || first === hour) {
      selectedHours.value = [hour];
    } else {
      const start = first < hour ? first : hour;
      const end = first > hour ? first : hour;
      const startIndex = hours.value.indexOf(start);
      const endIndex = hours.value.indexOf(end);
      selectedHours.value = hours.value.slice(startIndex, endIndex + 1);
    }
  } else {
    selectedHours.value = [hour];
  }

  emit('update:modelValue', {
    start: selectedHours.value[0],
    end: selectedHours.value[selectedHours.value.length - 1]
  });
};

const formattedStart = computed(() => selectedHours.value[0] || '--:--');
const formattedEnd = computed(() => selectedHours.value[selectedHours.value.length - 1] || '--:--');

watch(() => props.modelValue, (newVal) => {
  if (newVal.start && newVal.end) {
    const startIndex = hours.value.indexOf(newVal.start);
    const endIndex = hours.value.indexOf(newVal.end);
    if (startIndex !== -1 && endIndex !== -1) {
      selectedHours.value = hours.value.slice(startIndex, endIndex + 1);
    }
  }
}, { immediate: true });
</script>

<style scoped>
.bg-primary {
  @apply bg-blue-600;
}
</style>
