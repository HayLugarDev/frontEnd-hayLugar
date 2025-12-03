<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center text-white bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] px-6 py-10"
  >
    <!-- ICONO ÉXITO -->
    <div class="flex flex-col items-center mb-10 animate-fadeInSlow">
      <div
        class="w-28 h-28 rounded-full bg-gradient-to-br from-[#00B4D8] to-[#06D6A0] flex items-center justify-center shadow-2xl"
      >
        <i class="fa-solid fa-check text-5xl text-[#0D1B2A]"></i>
      </div>
    </div>

    <!-- TITULOS -->
    <div class="text-center max-w-xl animate-fadeIn">
      <h1 class="text-3xl md:text-4xl font-bold mb-3 tracking-wide">
        ¡Reserva enviada con éxito!
      </h1>

      <p class="text-[#B0BEC5] text-sm md:text-base leading-relaxed">
        Tu solicitud fue registrada correctamente.
        El propietario del espacio industrial revisará los datos y te responderá
        dentro de las próximas <strong>24 a 48 horas hábiles</strong>.
      </p>

      <p class="text-[#90A4AE] text-xs md:text-sm mt-3">
        Si ya tenés un correo verificado en HayLugar, te enviamos un
        <strong>email con el resumen de la reserva</strong>.
      </p>
    </div>

    <!-- CARD DETALLES -->
    <div
      v-if="reservation"
      class="mt-10 bg-[#1B263B]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl w-full max-w-xl animate-fadeInUp"
    >
      <h2 class="text-lg md:text-xl font-semibold mb-4 text-center">
        Detalles de tu solicitud
      </h2>

      <ul class="space-y-3 text-sm md:text-base">
        <li class="flex justify-between border-b border-white/10 pb-2">
          <span class="text-[#B0BEC5]">Espacio</span>
          <span class="font-semibold text-right">
            {{ reservation.space_name || reservation.slug }}
          </span>
        </li>

        <li class="flex justify-between border-b border-white/10 pb-2">
          <span class="text-[#B0BEC5]">Desde</span>
          <span class="text-right">{{ reservation.start_time }}</span>
        </li>

        <li class="flex justify-between border-b border-white/10 pb-2">
          <span class="text-[#B0BEC5]">Hasta</span>
          <span class="text-right">{{ reservation.end_time }}</span>
        </li>

        <li class="flex justify-between border-b border-white/10 pb-2">
          <span class="text-[#B0BEC5]">Método</span>
          <span class="text-right">{{ methodLabel }}</span>
        </li>

        <li class="flex justify-between">
          <span class="text-[#B0BEC5]">Total estimado</span>
          <span class="text-[#00B4D8] font-bold text-xl text-right">
            ${{ reservation.estimated_total }}
          </span>
        </li>
      </ul>
    </div>

    <!-- BOTONES -->
    <div class="flex flex-col md:flex-row flex-wrap gap-4 mt-12 justify-center animate-fadeInUp">
      <button
        @click="goToSpace"
        class="bg-gradient-to-r from-[#00B4D8] to-[#06D6A0] text-[#0D1B2A] font-semibold px-6 py-3 rounded-xl shadow-lg hover:opacity-90 transition-all"
      >
        Volver al espacio
      </button>

      <button
        @click="goToDashboard"
        class="bg-white/10 border border-white/10 px-6 py-3 rounded-xl text-white hover:bg-white/20 transition-all"
      >
        Ir a mis reservas
      </button>

      <button
        @click="downloadPdf"
        :disabled="downloadingPdf || !reservation?.id"
        class="bg-white/10 border border-[#00B4D8]/40 px-6 py-3 rounded-xl text-sm flex items-center gap-2 hover:bg-white/15 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <i class="fa-solid fa-file-arrow-down text-[#00B4D8]"></i>
        <span>
          {{ downloadingPdf ? 'Generando PDF…' : 'Descargar PDF' }}
        </span>
      </button>

      <button
        @click="contactByWhatsApp"
        class="bg-[#25D366]/90 hover:bg-[#25D366] px-6 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg transition-all"
      >
        <i class="fa-brands fa-whatsapp text-xl"></i>
        <span>Contactar por WhatsApp</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useReservationIndustrialStore } from '../store/reservationIndustrialStore'
import api from '../services/apiService'

const route = useRoute()
const router = useRouter()
const reservationStore = useReservationIndustrialStore()

// ✅ Reserva actual guardada en el store al confirmar
const reservation = computed(() => reservationStore.reservation)

// Texto del método de pago
const methodLabel = computed(() => {
  if (!reservation.value) return ''
  const m = reservation.value.method
  return m === 'wallet'
    ? 'Billetera HayLugar'
    : m === 'mercadopago'
    ? 'Mercado Pago'
    : 'Contrato (sin pago)'
})

// === NAVEGACIÓN ===
function goToSpace() {
  if (!reservation.value) return
  router.push({ name: 'IndustrialDetail', params: { slug: reservation.value.slug } })
}

function goToDashboard() {
  router.push('/dashboard/reservas')
}

// === PDF ===
const downloadingPdf = ref(false)

async function downloadPdf() {
  if (!reservation.value?.id) return

  try {
    downloadingPdf.value = true

    const response = await api.get(`/industrial-reservations/${reservation.value.id}/pdf`, {
      responseType: 'blob',
    })

    const blob = new Blob([response.data], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = `reserva-industrial-${reservation.value.id}.pdf`
    document.body.appendChild(link)
    link.click()
    link.remove()

    window.URL.revokeObjectURL(url)
  } catch (err) {
    console.error('Error al descargar PDF de reserva:', err)
    alert('No pudimos generar el PDF en este momento. Intentá nuevamente más tarde.')
  } finally {
    downloadingPdf.value = false
  }
}

// === WHATSAPP ===
const WHATSAPP_NUMBER =
  (import.meta as any).env?.VITE_HAYLUGAR_WHATSAPP || '+5493810000000'

function contactByWhatsApp() {
  if (!reservation.value) return

  const phone = WHATSAPP_NUMBER.replace(/[^0-9]/g, '')
  const text = encodeURIComponent(
    `Hola, soy usuario de HayLugar y acabo de enviar una solicitud de reserva industrial.\n\n` +
      `Espacio: ${reservation.value.space_name || reservation.value.slug}\n` +
      `Período: ${reservation.value.start_time} → ${reservation.value.end_time}\n` +
      `Total estimado: $${reservation.value.estimated_total}\n\n` +
      `Me gustaría coordinar los próximos pasos.`
  )

  window.open(`https://wa.me/${phone}?text=${text}`, '_blank')
}
</script>

<style scoped>
@keyframes fadeInSlow {
  0% { opacity: 0; transform: scale(0.9); }
  100% { opacity: 1; transform: scale(1); }
}

@keyframes fadeIn {
  0% { opacity: 0; transform: translateY(8px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInUp {
  0% { opacity: 0; transform: translateY(30px); }
  100% { opacity: 1; transform: translateY(0); }
}

.animate-fadeInSlow {
  animation: fadeInSlow 0.9s ease forwards;
}

.animate-fadeIn {
  animation: fadeIn 0.8s ease forwards;
}

.animate-fadeInUp {
  animation: fadeInUp 1s ease forwards;
}
</style>
