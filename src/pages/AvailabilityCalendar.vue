<template>
  <div
    class="bg-[#1B263B]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-xl text-white"
  >
    <!-- HEADER CALENDARIO -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <p class="text-[11px] uppercase tracking-[0.16em] text-[#90A4AE]">
          Disponibilidad calendario
        </p>
        <h3 class="text-lg font-semibold">
          {{ monthLabel }} {{ currentYear }}
        </h3>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="prevMonth"
          class="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs"
        >
          <i class="fa-solid fa-chevron-left"></i>
        </button>
        <button
          @click="nextMonth"
          class="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs"
        >
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </div>

    <!-- LEYENDA -->
    <div class="flex items-center flex-wrap gap-3 mb-4 text-[11px] text-[#B0BEC5]">
      <div class="inline-flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-[#06D6A0]/40 border border-[#06D6A0]/70"></span>
        <span>Disponible</span>
      </div>
      <div class="inline-flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-[#EF4444]/30 border border-[#EF4444]"></span>
        <span>Ocupado / reservado</span>
      </div>
      <div class="inline-flex items-center gap-2">
        <span class="w-3 h-3 rounded-full border border-white/20"></span>
        <span>Sin datos</span>
      </div>
    </div>

    <!-- HEAD DÍAS SEMANA -->
    <div class="grid grid-cols-7 text-[11px] text-center text-[#90A4AE] mb-1 uppercase tracking-[0.16em]">
      <div v-for="d in weekDays" :key="d">{{ d }}</div>
    </div>

    <!-- GRID DE DÍAS -->
    <div class="grid grid-cols-7 gap-1 text-sm">
      <!-- Espacios vacíos al inicio -->
      <div
        v-for="n in startOffset"
        :key="'empty-' + n"
        class="h-9 md:h-10"
      ></div>

      <!-- DÍAS DEL MES -->
      <button
        v-for="day in daysInMonth"
        :key="day"
        class="relative h-9 md:h-10 flex items-center justify-center rounded-xl border text-xs md:text-sm transition-all
          focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/70"
        :class="dayClasses(day)"
        :disabled="isPast(day)"
      >
        <span>{{ day }}</span>

        <!-- Punto para “hoy” -->
        <span
          v-if="isToday(day)"
          class="absolute bottom-0.5 w-1.5 h-1.5 rounded-full bg-[#00B4D8]"
        ></span>
      </button>
    </div>

    <!-- NOTA -->
    <p class="text-[11px] text-[#90A4AE] mt-3 leading-relaxed">
      El calendario refleja los rangos ocupados informados por el parque industrial.
      Para operaciones especiales o ventanas fuera de calendario, coordiná directamente con el propietario.
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

interface Slot {
  start: string
  end: string
}

const props = defineProps<{
  slots?: Slot[] | null
}>()

/**
 * Estado local de mes/año visible
 */
const today = new Date()
const currentMonth = ref(today.getMonth()) // 0-11
const currentYear = ref(today.getFullYear())

/**
 * Normalizamos los slots a Date una sola vez (cuando cambian los props)
 */
const normalizedSlots = computed(() => {
  if (!props.slots || !Array.isArray(props.slots)) return []

  return props.slots
    .map((s) => {
      const start = new Date(s.start)
      const end = new Date(s.end)

      if (isNaN(start.getTime()) || isNaN(end.getTime())) return null

      // Normalizamos a medianoche para comparación por día
      const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate())
      const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate())

      return { start: startDay, end: endDay }
    })
    .filter(Boolean) as { start: Date; end: Date }[]
})

/**
 * Utilidades de calendario
 */
const daysInMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
})

const firstDayWeekIndex = computed(() => {
  // 0 = Dom, 1 = Lun...
  const date = new Date(currentYear.value, currentMonth.value, 1)
  const day = date.getDay()
  // Queremos que la semana arranque LUNES (Lun = 0 en nuestro array visual)
  return (day + 6) % 7
})

const startOffset = computed(() => firstDayWeekIndex.value)

const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

const monthNames = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

const monthLabel = computed(() => monthNames[currentMonth.value])

/**
 * Funciones de estado de día
 */
function buildDateForDay(day: number): Date {
  return new Date(currentYear.value, currentMonth.value, day)
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function isToday(day: number): boolean {
  const d = buildDateForDay(day)
  return isSameDay(d, today)
}

function isPast(day: number): boolean {
  const d = buildDateForDay(day)
  // Comparamos solo a nivel de día
  const ref = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  return d < ref
}

function isBusy(day: number): boolean {
  const d = buildDateForDay(day)

  return normalizedSlots.value.some((slot) => {
    return d >= slot.start && d <= slot.end
  })
}

function hasData(): boolean {
  return normalizedSlots.value.length > 0
}

/**
 * Clases dinámicas de cada día
 */
function dayClasses(day: number): string {
  const base =
    'border-white/15 bg-white/5 text-white hover:bg-white/10 hover:border-white/40'

  if (!hasData()) {
    // Sin datos: neutro, pero bloqueamos días pasados visualmente
    if (isPast(day)) {
      return base + ' opacity-40 cursor-not-allowed'
    }
    return base
  }

  if (isBusy(day)) {
    return [
      'bg-[#EF4444]/20 border-[#EF4444]/70 text-[#FFE4E6]',
      'hover:bg-[#EF4444]/30 hover:border-[#EF4444]'
    ].join(' ')
  }

  // Disponible (dentro del mes visible)
  if (isPast(day)) {
    return 'border-white/10 bg-white/5 text-white/50 cursor-not-allowed opacity-50'
  }

  return [
    'bg-[#06D6A0]/10',
    'border-[#06D6A0]/50',
    'text-[#E0FDF4]',
    'hover:bg-[#06D6A0]/20 hover:border-[#06D6A0]'
  ].join(' ')
}

/**
 * Navegación de meses
 */
function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value -= 1
  } else {
    currentMonth.value -= 1
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value += 1
  } else {
    currentMonth.value += 1
  }
}

// Si en algún momento quisieras sincronizar el mes inicial con el primer slot, podríamos
// hacer un watch aquí sobre normalizedSlots y mover el mes al primer rango.
watch(
  normalizedSlots,
  (slots) => {
    if (!slots.length) return
    const first = slots[0].start
    currentMonth.value = first.getMonth()
    currentYear.value = first.getFullYear()
  },
  { immediate: false }
)
</script>
