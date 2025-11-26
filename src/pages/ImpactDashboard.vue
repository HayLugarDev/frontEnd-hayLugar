<template>
  <div class="min-h-screen bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] text-white overflow-hidden relative">
    <!-- Fondo decorativo animado -->
    <div class="absolute inset-0 -z-10 opacity-30">
      <div class="absolute top-0 left-0 w-96 h-96 bg-[#06D6A0]/20 blur-[180px] animate-pulse-slow"></div>
      <div class="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-[#00B4D8]/20 blur-[180px] animate-pulse-slow delay-500"></div>
    </div>

    <!-- HEADER -->
 <MainHeader class="hidden md:block" />

    <!-- KPIs PRINCIPALES -->
    <section class="container mx-auto px-6 md:px-12 py-10 grid gap-6 md:grid-cols-3">
      <ImpactCard title="Ocupación" :value="impact?.occupancy_pct + '%'" icon="fa-solid fa-parking" color="#00B4D8" />
      <ImpactCard title="Vehículos Activos" :value="impact?.vehicles_active" icon="fa-solid fa-car" color="#06D6A0" />
      <ImpactCard title="CO₂ Evitado" :value="impact?.co2_saved_kg + ' kg'" icon="fa-solid fa-leaf" color="#FFD166" />
    </section>

    <!-- GRAFICOS DE EVOLUCIÓN -->
    <section class="container mx-auto px-6 md:px-12 grid gap-8 md:grid-cols-2">
      <div class="bg-[#1B263B]/70 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-lg">
        <h2 class="text-lg font-semibold mb-4">Evolución de Ocupación</h2>
        <canvas ref="occupancyChart" height="200"></canvas>
      </div>
      <div class="bg-[#1B263B]/70 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-lg">
        <h2 class="text-lg font-semibold mb-4">Evolución de CO₂ Evitado</h2>
        <canvas ref="co2Chart" height="200"></canvas>
      </div>
    </section>

    <!-- INFO SOCIOAMBIENTAL -->
    <section class="container mx-auto px-6 md:px-12 py-12">
      <div class="bg-[#1B263B]/70 border border-white/10 rounded-2xl p-8 text-[#B0BEC5] leading-relaxed shadow-xl backdrop-blur-md">
        <h3 class="text-xl font-semibold text-white mb-3">Análisis del Impacto</h3>
        <p>
          El sistema HayLugar está reduciendo los tiempos de espera en un promedio de
          <span class="text-[#06D6A0] font-semibold">{{ impact?.avg_wait_seconds }}</span> segundos por vehículo,
          optimizando el uso de espacio urbano y promoviendo prácticas sustentables.
        </p>
        <p class="mt-3">
          La red de movilidad inteligente genera un impacto directo en la microeconomía local, alcanzando
          <span class="text-[#FFD166] font-semibold">$ {{ formatNumber(impact?.local_income_ars) }}</span> de ingresos
          para los anfitriones y comercios asociados.
        </p>
        <div class="mt-6 flex flex-wrap gap-4 text-sm">
          <span class="px-4 py-2 rounded-xl bg-[#00B4D8]/20 border border-[#00B4D8]/30 text-[#00B4D8]">Sustentabilidad urbana</span>
          <span class="px-4 py-2 rounded-xl bg-[#06D6A0]/20 border border-[#06D6A0]/30 text-[#06D6A0]">Economía circular</span>
          <span class="px-4 py-2 rounded-xl bg-[#FFD166]/20 border border-[#FFD166]/30 text-[#FFD166]">Cultura verde</span>
        </div>
      </div>
    </section>

    <!-- ===== FOOTER ===== -->
      <footer class="mt-10 border-t border-white/10 bg-[#0D1B2A]/80 backdrop-blur-xl">
        <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between 
              gap-4 px-6 py-8 text-[#B0BEC5] text-sm">

          <!-- Branding -->
          <div class="flex items-center gap-2">
            <span class="text-white font-semibold tracking-wide">HayLugar</span>
            <span class="text-xs text-[#78909C]">© {{ new Date().getFullYear() }}</span>
          </div>

          <!-- Links -->
          <div class="flex gap-6">
            <router-link to="/PrivacyPolicy" class="hover:text-white transition-colors duration-200">
              Política de Privacidad
            </router-link>

            <router-link to="/terminos-y-condiciones" class="hover:text-white transition-colors duration-200">
              Términos y Condiciones
            </router-link>
          </div>

          <!-- Extra -->
          <div class="text-xs text-[#78909C]">
            Movilidad inteligente
          </div>
        </div>
      </footer>
      
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getImpact, getImpactSeries, type ImpactSnapshot } from '../services/eventService'
import Chart from 'chart.js/auto'
import logo from '../assets/logo.png'
import MainHeader from '../components/layout/header/MainHeader.vue'
const impact = ref<ImpactSnapshot | null>(null)
const impactSeries = ref<ImpactSnapshot[]>([])

const occupancyChart = ref<HTMLCanvasElement | null>(null)
const co2Chart = ref<HTMLCanvasElement | null>(null)

function formatNumber(value?: string | number) {
  if (!value) return '0'
  return new Intl.NumberFormat('es-AR').format(Number(value))
}

onMounted(async () => {
  try {
    const eventId = 1 // temporal o desde params
    const [snap, series] = await Promise.all([
      getImpact(eventId),
      getImpactSeries(eventId)
    ])
    impact.value = snap
    impactSeries.value = series

    // === Gráfico de Ocupación ===
    if (occupancyChart.value) {
      new Chart(occupancyChart.value, {
        type: 'line',
        data: {
          labels: series.map((s) => new Date(s.ts).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })),
          datasets: [
            {
              label: 'Ocupación (%)',
              data: series.map((s) => s.occupancy_pct),
              borderColor: '#00B4D8',
              tension: 0.3,
              fill: true,
              backgroundColor: 'rgba(0,180,216,0.1)',
            },
          ],
        },
        options: {
          scales: {
            y: { beginAtZero: true, max: 100, grid: { color: 'rgba(255,255,255,0.05)' } },
            x: { grid: { display: false }, ticks: { color: '#B0BEC5' } },
          },
          plugins: { legend: { display: false } },
        },
      })
    }

    // === Gráfico de CO₂ ===
    if (co2Chart.value) {
      new Chart(co2Chart.value, {
        type: 'bar',
        data: {
          labels: series.map((s) => new Date(s.ts).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })),
          datasets: [
            {
              label: 'CO₂ Evitado (kg)',
              data: series.map((s) => s.co2_saved_kg),
              backgroundColor: 'rgba(6,214,160,0.4)',
              borderColor: '#06D6A0',
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' } },
            x: { grid: { display: false }, ticks: { color: '#B0BEC5' } },
          },
          plugins: { legend: { display: false } },
        },
      })
    }
  } catch (err) {
    console.error('Error cargando impacto:', err)
  }
})
</script>

<script lang="ts">
export default {
  components: {
    ImpactCard: {
      props: { title: String, value: String, icon: String, color: String },
      template: `
        <div class="bg-[#1B263B]/70 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-lg hover:shadow-2xl transition">
          <i :class="icon" class="text-3xl mb-3" :style="{ color }"></i>
          <p class="text-sm text-[#B0BEC5]">{{ title }}</p>
          <p class="text-2xl font-bold mt-1" :style="{ color }">{{ value }}</p>
        </div>
      `,
    },
  },
}
</script>

<style scoped>
@keyframes pulse-slow {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.05); }
}
.animate-pulse-slow {
  animation: pulse-slow 6s ease-in-out infinite;
}
</style>
