<template>
  <div class="bg-[#1B263B]/70 border border-white/10 rounded-2xl p-6">
    <h3 class="text-lg font-semibold mb-3">{{ title }}</h3>
    <canvas ref="chartCanvas" height="160"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps<{ title: string; labels: string[]; data: number[]; color?: string }>()

const chartCanvas = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
  if (!chartCanvas.value) return
  new Chart(chartCanvas.value, {
    type: 'line',
    data: {
      labels: props.labels,
      datasets: [
        {
          data: props.data,
          borderColor: props.color || '#00B4D8',
          tension: 0.3,
          fill: true,
          backgroundColor: 'rgba(0,180,216,0.1)',
        },
      ],
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: '#B0BEC5' }, grid: { display: false } },
        y: { ticks: { color: '#B0BEC5' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      },
    },
  })
})
</script>
