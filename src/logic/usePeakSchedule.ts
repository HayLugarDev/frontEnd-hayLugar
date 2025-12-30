import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

export type PeakStatus = 'peak' | 'offPeak'

/* ===================== LÓGICA BASE (NO CAMBIA) ===================== */

function calcPeakStatus(date = new Date()): PeakStatus {
  const day = date.getDay() // 0 domingo
  const hour = date.getHours()

  // Lunes a viernes
  if (day >= 1 && day <= 5) {
    // Pico mañana
    if (hour >= 7 && hour <= 10) return 'peak'
    // Pico tarde
    if (hour >= 17 && hour <= 20) return 'peak'
  }

  return 'offPeak'
}

/* ===================== COMPOSABLE REACTIVO ===================== */

export function usePeakSchedule() {
  const peakStatus = ref<PeakStatus>(calcPeakStatus())

  let timer: number | null = null

  function update() {
    peakStatus.value = calcPeakStatus()
  }

  onMounted(() => {
    update()

    // 🔁 Actualiza cada 5 minutos (más que suficiente)
    timer = window.setInterval(update, 5 * 60 * 1000)
  })

  onBeforeUnmount(() => {
    if (timer) clearInterval(timer)
  })

  const isPeakNow = computed(() => peakStatus.value === 'peak')

  return {
    peakStatus,
    isPeakNow,
  }
}
