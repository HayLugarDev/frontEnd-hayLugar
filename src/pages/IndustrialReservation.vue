<template>
  <div class="min-h-screen bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] text-white">
    <!-- Header -->
    <header class="flex items-center justify-between px-6 md:px-12 py-6 border-b border-white/10 bg-[#0D1B2A]/70 backdrop-blur">
      <div class="flex items-center gap-3">
        <img :src="logo" alt="HayLugar" class="h-10 w-10" />
        <h1 class="text-xl md:text-2xl font-semibold tracking-wide">Confirmar reserva</h1>
      </div>
      <button @click="router.back()" class="text-sm bg-white/10 hover:bg-white/15 px-4 py-2 rounded-xl border border-white/10">
        ← Volver
      </button>
    </header>

    <!-- ===== MAIN ===== -->
    <section class="container mx-auto px-6 md:px-12 py-8 grid md:grid-cols-3 gap-8">
      <!-- Columna izquierda -->
      <div class="md:col-span-2 space-y-6">
        <!-- Summary -->
        <div class="bg-[#1B263B]/60 border border-white/10 rounded-2xl p-6">
          <h2 class="text-lg font-semibold mb-2">{{ space?.name || 'Cargando…' }}</h2>
          <p class="text-[#B0BEC5] text-sm">{{ space?.location }}</p>
          <div class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-[#B0BEC5]">
            <div class="bg-white/5 rounded-xl p-3 flex items-center justify-between">
              <i class="fa-solid fa-layer-group text-[#FFD166]"></i>
              <span>{{ formatType(space?.subcategory) }}</span>
            </div>
            <div class="bg-white/5 rounded-xl p-3 flex items-center justify-between">
              <i class="fa-solid fa-ruler-combined text-[#06D6A0]"></i>
              <span>{{ space?.capacity_m2 ?? '—' }} m²</span>
            </div>
            <div class="bg-white/5 rounded-xl p-3 flex items-center justify-between">
              <i class="fa-solid fa-up-down text-[#00B4D8]"></i>
              <span>{{ space?.height_m ?? '—' }} m</span>
            </div>
            <div class="bg-white/5 rounded-xl p-3 flex items-center justify-between">
              <i class="fa-solid fa-bolt text-[#06D6A0]"></i>
              <span>Trifásica {{ space?.energy_3phase ? '✔' : '—' }}</span>
            </div>
          </div>
        </div>

        <!-- Formulario -->
        <div class="bg-[#1B263B]/60 border border-white/10 rounded-2xl p-6 space-y-5">
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs uppercase tracking-wider text-[#B0BEC5] mb-1">Desde</label>
              <input type="datetime-local" v-model="startDate" class="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#00B4D8] outline-none" />
            </div>
            <div>
              <label class="block text-xs uppercase tracking-wider text-[#B0BEC5] mb-1">Hasta</label>
              <input type="datetime-local" v-model="endDate" class="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#00B4D8] outline-none" />
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs uppercase tracking-wider text-[#B0BEC5] mb-1">Unidad de precio</label>
              <select v-model="pricingUnit" class="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-sm">
                <option value="hour">Hora</option>
                <option value="day">Día</option>
                <option value="week">Semana</option>
                <option value="month">Mes</option>
              </select>
            </div>
            <div>
              <label class="block text-xs uppercase tracking-wider text-[#B0BEC5] mb-1">Método</label>
              <select v-model="method" class="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-sm">
                <option value="wallet">Billetera HayLugar</option>
                <option value="mercadopago">Mercado Pago</option>
                <option value="manual_contract">Contrato (reservar sin pagar)</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs uppercase tracking-wider text-[#B0BEC5] mb-1">Notas (opcional)</label>
            <textarea v-model="notes" rows="3" placeholder="Ej: Detallar horarios de carga/descarga, requerimientos de acceso, etc."
              class="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-sm placeholder-gray-400"></textarea>
          </div>
        </div>

        <!-- Disponibilidad -->
        <div class="bg-[#1B263B]/60 border border-white/10 rounded-2xl p-6">
          <h3 class="text-lg font-semibold mb-3">Disponibilidad</h3>
          <div class="grid grid-cols-7 gap-2 text-xs">
            <div v-for="d in demoDays" :key="d.label" class="rounded-lg px-2 py-3 text-center border"
                 :class="d.available ? 'bg-[#06D6A0]/15 border-[#06D6A0]/30' : 'bg-white/5 border-white/10 text-[#B0BEC5]'">
              <div class="font-semibold">{{ d.label }}</div>
              <div class="opacity-80">{{ d.range }}</div>
            </div>
          </div>
          <p class="text-[#B0BEC5] text-xs mt-2">* Vista ilustrativa según ventana operativa informada por el anfitrión.</p>
        </div>
      </div>

      <!-- Columna derecha -->
      <aside class="bg-[#1B263B]/60 border border-white/10 rounded-2xl p-6 h-fit sticky top-8">
        <h4 class="text-lg font-semibold mb-4">Resumen</h4>
        <ul class="space-y-2 text-sm text-[#B0BEC5]">
          <li class="flex justify-between"><span>Espacio</span><span class="text-white">{{ space?.name }}</span></li>
          <li class="flex justify-between"><span>Desde</span><span class="text-white">{{ startDate || '—' }}</span></li>
          <li class="flex justify-between"><span>Hasta</span><span class="text-white">{{ endDate || '—' }}</span></li>
          <li class="flex justify-between"><span>Unidad</span><span class="text-white capitalize">{{ pricingUnit }}</span></li>
          <li class="flex justify-between"><span>Precio unidad</span><span class="text-white">${{ pricePerUnit || 0 }}</span></li>
          <li class="flex justify-between"><span>Método</span><span class="text-white">{{ methodLabel }}</span></li>
        </ul>

        <div class="my-4 border-t border-white/10"></div>

        <div class="flex items-center justify-between">
          <span class="text-lg font-semibold">Total estimado</span>
          <span class="text-3xl font-bold text-[#00B4D8]">${{ estimation }}</span>
        </div>

        <button
          :disabled="!canConfirm"
          @click="openConfirm = true"
          class="w-full mt-5 bg-gradient-to-r from-[#00B4D8] to-[#06D6A0] hover:opacity-90 text-[#0D1B2A] font-semibold py-3 rounded-xl transition-all disabled:opacity-50"
        >
          Continuar
        </button>

        <p class="text-[11px] text-[#B0BEC5] mt-3">
          La confirmación final y cobro (si aplica) se realizará cuando conectemos con el backend.
        </p>
      </aside>
    </section>

    <!-- Modal Confirmación -->
    <div v-if="openConfirm" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-6">
      <div class="bg-[#0D1B2A] border border-white/10 rounded-2xl p-6 w-full max-w-lg">
        <h3 class="text-lg font-semibold">Confirmar reserva</h3>
        <p class="text-[#B0BEC5] text-sm mt-1">
          Revisá los datos antes de confirmar. Este paso no realiza cobros reales.
        </p>

        <div class="mt-4 bg-[#1B263B] rounded-xl p-4 text-sm text-[#CFD8DC] space-y-2">
          <div class="flex justify-between"><span>Espacio</span><span class="text-white">{{ space?.name }}</span></div>
          <div class="flex justify-between"><span>Período</span><span class="text-white">{{ startDate }} → {{ endDate }}</span></div>
          <div class="flex justify-between"><span>Método</span><span class="text-white">{{ methodLabel }}</span></div>
          <div class="flex justify-between"><span>Total estimado</span><span class="text-[#00B4D8] font-semibold">${{ estimation }}</span></div>
          <div v-if="method==='manual_contract'" class="text-xs text-[#FFD166]">
            * “Reserva sin pago”: el equipo comercial te contactará para formalizar contrato.
          </div>
        </div>

        <div class="mt-5 flex items-center gap-3">
          <button @click="confirmReservation" class="px-4 py-2 rounded-xl bg-white text-[#0D1B2A] font-semibold hover:opacity-90">
            Confirmar
          </button>
          <button @click="openConfirm=false" class="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10">
            Cancelar
          </button>
        </div>
      </div>
    </div>

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
            Logística inteligente
          </div>
        </div>
      </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import logo from '../assets/logo.png'
import api from '../services/apiService'
import { useSpaceStore } from '../store/spaceStore'
import { useReservationIndustrialStore } from '../store/reservationIndustrialStore' // ✅ nuevo

const route = useRoute()
const router = useRouter()
const spaceStore = useSpaceStore()
const reservationStore = useReservationIndustrialStore() // ✅

const space = ref<any>(null)
const startDate = ref('')
const endDate = ref('')
const pricingUnit = ref<'hour'|'day'|'week'|'month'>('day')
const method = ref<'wallet'|'mercadopago'|'manual_contract'>('wallet')
const notes = ref('')
const openConfirm = ref(false)

const pricePerUnit = computed(() => Number(space.value?.price_per_unit || 0))
const methodLabel = computed(() =>
  method.value === 'wallet' ? 'Billetera HayLugar'
  : method.value === 'mercadopago' ? 'Mercado Pago'
  : 'Contrato (sin pago)'
)

const estimation = computed(() =>
  spaceStore.estimateCost(pricingUnit.value, pricePerUnit.value, startDate.value, endDate.value)
)
const canConfirm = computed(() => Boolean(space.value && startDate.value && endDate.value))

const demoDays = computed(() => {
  const base = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom']
  return base.map((label, i) => ({
    label,
    range: space.value?.availability?.start && space.value?.availability?.end
      ? `${space.value.availability.start}–${space.value.availability.end}`
      : '08:00–18:00',
    available: i < 5
  }))
})

onMounted(async () => {
  const slug = route.params.slug as string
  const res = await api.get(`/spaces/getbyslug/${slug}`)
  const sp = res.data
  let imgs = sp?.images
  if (typeof imgs === 'string') { try { imgs = JSON.parse(imgs) } catch { imgs = [] } }
  space.value = { ...sp, images: Array.isArray(imgs) ? imgs : [] }

  pricingUnit.value = (space.value?.pricing_unit || 'day')
  startDate.value = new Date().toISOString().slice(0,16)
  const end = new Date(); end.setDate(end.getDate()+1)
  endDate.value = end.toISOString().slice(0,16)
})

async function confirmReservation() {
  reservationStore.setReservationData({
    space_id: space.value?.id,
    slug: route.params.slug as string,
    start_time: new Date(startDate.value).toISOString(),
    end_time: new Date(endDate.value).toISOString(),
    pricing_unit: pricingUnit.value,
    price_per_unit: pricePerUnit.value,
    estimated_total: estimation.value,
    method: method.value,
    notes: notes.value,
  })

  try {
    const res = await reservationStore.submitIndustrialReservation()
    console.log('✅ Reserva creada correctamente:', res)
    openConfirm.value = false
    router.push({ name: 'IndustrialDetail', params: { slug: route.params.slug } })
  } catch (err) {
    console.error('❌ Error al crear la reserva industrial:', err)
  }
}

function formatType(type?: string) {
  const map: Record<string, string> = {
    warehouse: 'Depósito',
    dock: 'Dársena',
    yard: 'Patio Logístico',
    cold_storage: 'Cámara Fría',
    logistics: 'Centro Logístico',
  }
  return type ? (map[type] || 'Industrial') : 'Industrial'
}
</script>
