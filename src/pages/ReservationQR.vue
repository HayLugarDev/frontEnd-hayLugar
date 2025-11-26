<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] text-white p-6 relative overflow-hidden">
    <!-- Fondo decorativo -->
    <div class="absolute inset-0 -z-10 opacity-20">
      <div class="absolute top-0 left-0 w-64 h-64 bg-[#06D6A0]/30 blur-[160px]"></div>
      <div class="absolute bottom-0 right-0 w-64 h-64 bg-[#00B4D8]/30 blur-[160px]"></div>
    </div>

    <!-- HEADER -->
    <header class="w-full max-w-lg flex items-center justify-between mb-10">
      <button @click="goBack" class="flex items-center gap-2 text-[#B0BEC5] hover:text-white transition">
        <i class="fa-solid fa-chevron-left"></i>
        <span>Volver</span>
      </button>
      <h1 class="text-lg font-semibold tracking-wide">Pase Digital</h1>
      <span class="text-xs text-[#06D6A0] uppercase font-medium">Activo</span>
    </header>

    <!-- TARJETA QR -->
    <div
      class="relative w-full max-w-sm bg-[#1B263B]/80 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl p-8 flex flex-col items-center text-center animate-fade-in"
    >
      <img :src="logo" alt="HayLugar" class="w-14 h-14 mb-4 opacity-90" />

      <h2 class="text-xl font-semibold mb-1">Acceso Verificado</h2>
      <p class="text-sm text-[#B0BEC5] mb-6">Mostrá este código en el control de ingreso</p>

      <!-- QR CODE -->
      <div class="bg-white p-3 rounded-2xl shadow-inner mb-6">
        <qrcode-vue
          v-if="qrToken"
          :value="qrToken"
          :size="220"
          level="H"
          class="rounded-xl"
        />
      </div>

      <!-- INFO -->
      <div class="w-full text-sm text-[#B0BEC5] space-y-1 border-t border-white/10 pt-4">
        <p><span class="text-white font-semibold">Evento:</span> {{ eventName || '—' }}</p>
        <p><span class="text-white font-semibold">Zona:</span> {{ zoneName || '—' }}</p>
        <p><span class="text-white font-semibold">Válido hasta:</span> {{ formattedExpiry }}</p>
      </div>

      <!-- BOTONES -->
      <div class="mt-6 flex flex-col gap-3 w-full">
        <button
          @click="copyToken"
          class="w-full bg-[#00B4D8] hover:bg-[#06D6A0] text-[#0D1B2A] font-semibold rounded-xl px-5 py-2 transition"
        >
          Copiar token
        </button>
        <button
          @click="goBack"
          class="w-full bg-white/10 hover:bg-white/15 border border-white/10 text-white rounded-xl px-5 py-2 transition"
        >
          Cerrar
        </button>
      </div>

      <transition name="fade">
        <p v-if="copied" class="absolute bottom-4 left-1/2 -translate-x-1/2 text-[#06D6A0] text-xs font-semibold animate-bounce">
          ¡Token copiado!
        </p>
      </transition>
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

        <router-link to="/termsConditions" class="hover:text-white transition-colors duration-200">
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
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import QrcodeVue from 'qrcode'
import logo from '../assets/logo.png';

const router = useRouter();
const route = useRoute();

const qrToken = ref<string>('');
const eventName = ref<string | null>(null);
const zoneName = ref<string | null>(null);
const expiry = ref<string | null>(null);
const copied = ref(false);

onMounted(() => {
  // Recuperar token desde params o localStorage
  const tokenParam = route.params.token as string;
  qrToken.value = tokenParam || localStorage.getItem('last_qr_token') || '';

  // Si viene desde reserva, guardar offline
  if (qrToken.value) {
    localStorage.setItem('last_qr_token', qrToken.value);
  }

  // Recuperar metadata básica si fue pasada como query
  eventName.value = (route.query.event as string) || 'Evento';
  zoneName.value = (route.query.zone as string) || 'General';
  expiry.value = (route.query.exp as string) || null;
});

const formattedExpiry = computed(() => {
  if (!expiry.value) return '—';
  return new Date(expiry.value).toLocaleString('es-AR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
});

function goBack() {
  router.push('/events');
}

async function copyToken() {
  if (!qrToken.value) return;
  try {
    await navigator.clipboard.writeText(qrToken.value);
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
  } catch {
    copied.value = false;
  }
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.6s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
