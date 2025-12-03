<template>
  <!-- ========== ESTADO CARGANDO ========== -->
  <div
    v-if="loading"
    class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] text-[#B0BEC5]"
  >
    <div class="w-12 h-12 border-4 border-[#00B4D8]/40 border-t-[#00B4D8] rounded-full animate-spin mb-4"></div>
    <p class="text-sm md:text-base">Cargando datos del espacio logístico...</p>
  </div>

  <!-- ========== ESTADO NO ENCONTRADO ========== -->
  <div
    v-else-if="notFound"
    class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] text-[#B0BEC5]"
  >
    <p class="text-lg font-semibold mb-2">No encontramos este espacio industrial.</p>
    <p class="text-sm mb-6 text-[#90A4AE]">
      Puede que el enlace esté desactualizado o que el espacio ya no esté disponible.
    </p>
    <button
      @click="router.push('/industrial')"
      class="px-5 py-2 rounded-xl bg-[#00B4D8] text-[#0D1B2A] font-semibold hover:bg-[#06D6A0] transition-all"
    >
      Volver al listado industrial
    </button>
  </div>

  <!-- ========== VISTA PRINCIPAL ========== -->
  <div
    v-else-if="space"
    class="min-h-screen bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] text-white flex flex-col"
  >
    <MainHeader class="hidden md:block" />

    <!-- HEADER SUPERIOR -->
    <header
      class="flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/10 bg-[#0D1B2A]/80 backdrop-blur-lg shadow-lg"
    >
      <div class="flex items-center gap-3">
        <img :src="logo" alt="HayLugar" class="h-10 w-10" />
        <div>
          <p class="text-xs md:text-sm text-[#B0BEC5]/80 flex items-center gap-2">
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
              <i class="fa-solid fa-industry text-[#00B4D8]"></i>
              Industrial · Tucumán
            </span>
            <span class="hidden md:inline text-[#90A4AE]">
              {{ formattedType }} · Nodo logístico urbano
            </span>
          </p>
          <h1 class="text-xl md:text-3xl font-semibold tracking-wide mt-1 flex items-center gap-2">
            {{ space.name }}
            <span
              class="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-[#06D6A0]/15 text-[#B2FFDA] border border-[#06D6A0]/40"
            >
              <i class="fa-solid fa-circle-check text-[#06D6A0]"></i>
              Espacio verificado
            </span>
          </h1>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="shareSpace"
          class="hidden md:flex items-center gap-2 text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all"
        >
          <i class="fa-solid fa-share-nodes text-[#00B4D8]"></i>
          Compartir
        </button>
        <button
          @click="router.back()"
          class="text-xs md:text-sm bg-[#06D6A0]/20 hover:bg-[#06D6A0]/40 px-4 py-2 rounded-xl transition-all duration-300"
        >
          ← Volver
        </button>
      </div>
    </header>

    <!-- GALERÍA + RESUMEN HERO -->
    <section class="relative w-full h-[260px] md:h-[440px] overflow-hidden">
      <Swiper
        :modules="[Navigation, Pagination, Autoplay]"
        :navigation="true"
        :pagination="{ clickable: true }"
        :autoplay="{ delay: 6000, disableOnInteraction: false }"
        class="w-full h-full"
      >
        <SwiperSlide
          v-for="(img, index) in galleryImages"
          :key="index"
          class="relative"
        >
          <img
            :src="img"
            class="w-full h-full object-cover"
            :alt="`Imagen ${index + 1} de ${space.name}`"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-[#0D1B2A]/90 via-transparent"></div>
        </SwiperSlide>
      </Swiper>

      <!-- CARD FLOTANTE HERO -->
      <div
        class="pointer-events-none absolute inset-x-0 bottom-4 md:bottom-8 flex justify-center md:justify-between px-6 md:px-12"
      >
        <div
          class="pointer-events-auto max-w-3xl w-full md:w-auto bg-[#0B1725]/90 border border-white/10 rounded-2xl p-4 md:p-5 shadow-2xl flex flex-col md:flex-row md:items-center gap-4"
        >
          <div class="flex-1">
            <p class="text-[11px] uppercase tracking-[0.2em] text-[#90A4AE] mb-1">
              Espacio logístico en red
            </p>
            <h2 class="text-lg md:text-2xl font-semibold flex items-center gap-2 mb-1">
              {{ space.name }}
            </h2>
            <p class="text-xs md:text-sm text-[#B0BEC5] line-clamp-2">
              {{ formattedSubtitle }}
            </p>
          </div>

          <div class="grid grid-cols-3 gap-3 text-[11px] md:text-xs text-[#CFD8DC] md:w-72">
            <div class="bg-white/5 rounded-xl px-3 py-2 flex flex-col gap-0.5">
              <span class="text-[10px] uppercase tracking-wide text-[#78909C]">Superficie</span>
              <span class="font-semibold text-sm">
                {{ space.capacity_m2 ?? '—' }} m²
              </span>
            </div>
            <div class="bg-white/5 rounded-xl px-3 py-2 flex flex-col gap-0.5">
              <span class="text-[10px] uppercase tracking-wide text-[#78909C]">Altura útil</span>
              <span class="font-semibold text-sm">
                {{ space.height_m ?? '—' }} m
              </span>
            </div>
            <div class="bg-white/5 rounded-xl px-3 py-2 flex flex-col gap-0.5">
              <span class="text-[10px] uppercase tracking-wide text-[#78909C]">Tipo</span>
              <span class="font-semibold text-sm">
                {{ formattedType }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- UBICACIÓN BADGE -->
      <div
        class="absolute top-4 left-6 md:left-12 bg-[#1B263B]/80 backdrop-blur-md px-3 md:px-4 py-2 rounded-xl text-[11px] md:text-xs flex items-center gap-2 border border-white/10"
      >
        <i class="fa-solid fa-map-marker-alt text-[#06D6A0]"></i>
        <span class="truncate max-w-[220px] md:max-w-xs">
          {{ formattedLocation }}
        </span>
      </div>
    </section>

    <!-- CONTENIDO PRINCIPAL -->
    <section class="container mx-auto px-6 md:px-12 py-10">
      <div class="flex flex-col md:flex-row justify-between items-start gap-10">
        <!-- COLUMNA IZQUIERDA -->
        <div class="flex-1">
          <!-- RESUMEN OPERATIVO -->
          <div class="mb-6">
            <h2 class="text-xl md:text-2xl font-semibold mb-2">
              Resumen operativo
            </h2>
            <p class="text-[#B0BEC5] text-sm md:text-base">
              {{ space.suitable_for || defaultSuitableText }}
            </p>
          </div>

          <!-- GRID DE HIGHLIGHTS -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 text-xs md:text-sm">
            <div class="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col gap-1">
              <span class="text-[#78909C] uppercase text-[10px] tracking-[0.16em]">
                Operación
              </span>
              <span class="font-semibold">
                {{ formattedType }}
              </span>
              <span class="text-[11px] text-[#90A4AE]">
                Ideal para logística y almacenamiento
              </span>
            </div>
            <div class="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col gap-1">
              <span class="text-[#78909C] uppercase text-[10px] tracking-[0.16em]">
                Disponibilidad
              </span>
              <span class="font-semibold">
                {{ space.capacity_m2 ?? '—' }} m² útiles
              </span>
              <span class="text-[11px] text-[#90A4AE]">
                Configurable según tu proyecto
              </span>
            </div>
            <div class="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col gap-1">
              <span class="text-[#78909C] uppercase text-[10px] tracking-[0.16em]">
                Infraestructura
              </span>
              <span class="font-semibold">
                {{ space.has_loading_dock ? 'Con muelle de carga' : 'Sin muelle dedicado' }}
              </span>
              <span class="text-[11px] text-[#90A4AE]">
                Adaptable a operaciones de camión
              </span>
            </div>
            <div class="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col gap-1">
              <span class="text-[#78909C] uppercase text-[10px] tracking-[0.16em]">
                Seguridad
              </span>
              <span class="font-semibold">
                {{ space.has_security ? 'Seguridad 24/7' : 'Seguridad a coordinar' }}
              </span>
              <span class="text-[11px] text-[#90A4AE]">
                Accesos controlados según acuerdo
              </span>
            </div>
          </div>

          <!-- ESPECIFICACIONES TÉCNICAS -->
          <h3 class="text-lg font-semibold mb-4 border-l-4 border-[#06D6A0] pl-3">
            Especificaciones técnicas
          </h3>
          <ul
            class="grid md:grid-cols-2 gap-3 text-sm text-[#B0BEC5] bg-white/5 rounded-2xl p-4 border border-white/10"
          >
            <li
              class="flex items-center gap-2 rounded-xl px-3 py-2"
              :class="space.has_security ? 'bg-[#06D6A0]/10' : 'bg-transparent opacity-70'"
            >
              <i
                :class="[
                  'fa-solid',
                  space.has_security ? 'fa-shield-halved text-[#06D6A0]' : 'fa-shield-halved text-[#B0BEC5]'
                ]"
              ></i>
              <div>
                <p class="font-medium text-sm">Seguridad perimetral</p>
                <p class="text-xs text-[#90A4AE]">
                  {{ space.has_security ? 'Control de accesos y vigilancia activa.' : 'A definir según la operación.' }}
                </p>
              </div>
            </li>

            <li
              class="flex items-center gap-2 rounded-xl px-3 py-2"
              :class="space.has_loading_dock ? 'bg-[#06D6A0]/10' : 'bg-transparent opacity-70'"
            >
              <i
                :class="[
                  'fa-solid',
                  space.has_loading_dock ? 'fa-truck-ramp-box text-[#06D6A0]' : 'fa-truck-ramp-box text-[#B0BEC5]'
                ]"
              ></i>
              <div>
                <p class="font-medium text-sm">Muelle de carga</p>
                <p class="text-xs text-[#90A4AE]">
                  {{ space.has_loading_dock ? 'Operación directa de camiones y contenedores.' : 'Sin muelle dedicado.' }}
                </p>
              </div>
            </li>

            <li
              class="flex items-center gap-2 rounded-xl px-3 py-2"
              :class="space.has_cold_chain ? 'bg-[#06D6A0]/10' : 'bg-transparent opacity-70'"
            >
              <i
                :class="[
                  'fa-solid',
                  space.has_cold_chain ? 'fa-snowflake text-[#06D6A0]' : 'fa-snowflake text-[#B0BEC5]'
                ]"
              ></i>
              <div>
                <p class="font-medium text-sm">Cadena de frío</p>
                <p class="text-xs text-[#90A4AE]">
                  {{
                    space.has_cold_chain
                      ? 'Infraestructura preparada para productos refrigerados.'
                      : 'Sin cámaras de frío integradas.'
                  }}
                </p>
              </div>
            </li>

            <li
              class="flex items-center gap-2 rounded-xl px-3 py-2"
              :class="space.energy_3phase ? 'bg-[#06D6A0]/10' : 'bg-transparent opacity-70'"
            >
              <i
                :class="[
                  'fa-solid',
                  space.energy_3phase ? 'fa-bolt text-[#FFD166]' : 'fa-bolt text-[#B0BEC5]'
                ]"
              ></i>
              <div>
                <p class="font-medium text-sm">Energía trifásica</p>
                <p class="text-xs text-[#90A4AE]">
                  {{
                    space.energy_3phase
                      ? 'Apto para maquinaria y equipamiento industrial.'
                      : 'Disponible a coordinar con el operador.'
                  }}
                </p>
              </div>
            </li>
          </ul>

          <!-- IDEAL PARA... -->
          <div class="mt-8">
            <h3 class="text-lg font-semibold mb-3">
              Ideal para este tipo de operaciones
            </h3>
            <div class="flex flex-wrap gap-2 text-xs md:text-sm">
              <span class="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#CFD8DC]">
                Centros de e-commerce y fulfillment
              </span>
              <span class="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#CFD8DC]">
                Logística de última milla
              </span>
              <span class="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#CFD8DC]">
                Almacenaje de insumos industriales
              </span>
              <span class="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#CFD8DC]">
                Operaciones con flotas de camiones
              </span>
              <span class="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#CFD8DC]">
                Alimentos y cadena de frío (según equipamiento)
              </span>
            </div>
          </div>
        </div>

        <!-- PANEL DERECHO (RESERVA) -->
        <div
          class="md:w-80 bg-[#1B263B]/75 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl sticky top-8"
        >
          <h4 class="text-lg font-semibold mb-4 text-center">Reserva este espacio</h4>

          <div class="flex flex-col items-center mb-4">
            <p class="text-3xl md:text-4xl font-bold text-[#00B4D8] leading-none mb-1">
              {{ space.price_per_unit ? `\$${space.price_per_unit}` : 'A convenir' }}
            </p>
            <p class="text-xs text-[#B0BEC5]">
              <span v-if="space.price_per_unit">
                por {{ space.pricing_unit || 'mes' }}
              </span>
              <span v-else>
                Consultar valor con el propietario
              </span>
            </p>
          </div>

          <div class="flex items-center justify-center gap-2 mb-4 text-[11px] text-[#B0BEC5]">
            <i class="fa-solid fa-circle-check text-[#06D6A0]"></i>
            <span>Propietario verificado por HayLugar</span>
          </div>

          <div class="mb-4">
            <label class="block text-xs uppercase tracking-wider text-[#B0BEC5] mb-1">
              Método de pago preferido
            </label>
            <select
              class="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#00B4D8] outline-none"
              v-model="selectedPayment"
            >
              <option value="wallet">Billetera HayLugar</option>
              <option value="mercadopago">Mercado Pago</option>
            </select>
          </div>

          <button
            @click="goToReservation(space.slug)"
            class="w-full mt-2 bg-gradient-to-r from-[#00B4D8] to-[#06D6A0] hover:opacity-90 text-[#0D1B2A] font-semibold py-3 rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            Solicitar reserva
          </button>

          <p class="text-[11px] text-[#B0BEC5]/90 mt-4 text-center border-t border-white/10 pt-3">
            <i class="fa-solid fa-lock text-[#06D6A0]"></i>
            Pagos protegidos y trazabilidad completa dentro de HayLugar.
          </p>

          <p class="text-[11px] text-[#78909C] mt-3 text-center">
            Tiempo estimado de respuesta del propietario: 24-48 hs hábiles.
          </p>
        </div>
      </div>
    </section>

    <!-- MAPA + CONTEXTO -->
    <section class="px-6 md:px-12 pb-16">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-lg font-semibold border-l-4 border-[#06D6A0] pl-3">
          Ubicación y conectividad
        </h3>
        <div class="hidden md:flex items-center gap-2 text-[11px] text-[#B0BEC5]">
          <span class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/5 border border-white/10">
            <span class="h-2 w-2 rounded-full bg-[#00B4D8]"></span>
            Entrada principal del espacio
          </span>
        </div>
      </div>

      <p class="text-xs md:text-sm text-[#B0BEC5] mb-4 max-w-2xl">
        Ubicación estratégica dentro del parque industrial, pensada para optimizar tiempos de acceso a rutas
        principales, centros urbanos y nodos logísticos clave.
      </p>

      <div class="rounded-2xl overflow-hidden shadow-lg border border-white/10 h-[320px] md:h-[360px]">
        <CustomGoogleMap
          :center="mapCenter"
          :zoom="15"
          :options="{ disableDefaultUI: true, zoomControl: true }"
        >
          <GMapMarker
            :position="mapCenter"
            :options="{
              title: space.name,
              icon: { url: '/assets/logo.png', scaledSize: { width: 48, height: 48 } }
            }"
          />
        </CustomGoogleMap>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="mt-10 border-t border-white/10 bg-[#0D1B2A]/80 backdrop-blur-xl">
      <div
        class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-8 text-[#B0BEC5] text-sm"
      >
        <div class="flex items-center gap-2">
          <span class="text-white font-semibold tracking-wide">HayLugar</span>
          <span class="text-xs text-[#78909C]">© {{ new Date().getFullYear() }}</span>
        </div>
        <div class="flex gap-6">
          <router-link
            to="/PrivacyPolicy"
            class="hover:text-white transition-colors duration-200"
          >
            Política de Privacidad
          </router-link>
          <router-link
            to="/termsConditions"
            class="hover:text-white transition-colors duration-200"
          >
            Términos y Condiciones
          </router-link>
        </div>
        <div class="text-xs text-[#78909C]">
          Logística inteligente
        </div>
      </div>
    </footer>

    <!-- CTA MOBILE FIJO -->
    <div
      class="md:hidden fixed bottom-0 left-0 right-0 bg-[#0B1725]/95 border-t border-white/10 backdrop-blur-xl px-4 py-3 flex items-center justify-between gap-3"
      @click="goToReservation(space.slug)"
    >
      <div class="flex flex-col">
        <span class="text-[11px] text-[#90A4AE] uppercase tracking-[0.16em]">Reservar</span>
        <span class="text-sm font-semibold">
          {{ space.price_per_unit ? `\$${space.price_per_unit} / ${space.pricing_unit || 'mes'}` : 'Consultar valor' }}
        </span>
      </div>
      <button
        class="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00B4D8] to-[#06D6A0] text-[#0D1B2A] text-sm font-semibold shadow-md"
      >
        Solicitar reserva
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

import logo from '../assets/logo.png';
import CustomGoogleMap from '../components/layout/GoogleMap.vue';
import MainHeader from '../components/layout/header/MainHeader.vue';

import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import { useIndustrialStore } from '../store/industrialStore';

const route = useRoute();
const router = useRouter();

const industrialStore = useIndustrialStore();
const { selectedSpace } = storeToRefs(industrialStore);

const loading = ref(true);
const notFound = ref(false);
const selectedPayment = ref<'wallet' | 'mercadopago'>('wallet');

const space = computed(() => selectedSpace.value as any | null);

const defaultCenter = { lat: -26.8109807, lng: -65.1686014 };

const mapCenter = computed(() => {
  if (!space.value) return defaultCenter;

  const lat = Number((space.value as any).latitude);
  const lng = Number((space.value as any).longitude);

  if (!isNaN(lat) && !isNaN(lng)) {
    return { lat, lng };
  }

  return defaultCenter;
});

const galleryImages = computed(() => {
  if (!space.value) return ['/assets/industrial_cover.jpg'];

  let imgs = (space.value as any).images;

  if (!imgs) {
    return ['/assets/industrial_cover.jpg'];
  }

  if (typeof imgs === 'string') {
    try {
      const parsed = JSON.parse(imgs);
      if (Array.isArray(parsed)) {
        imgs = parsed;
      } else {
        imgs = [parsed];
      }
    } catch {
      imgs = [imgs];
    }
  }

  if (!Array.isArray(imgs)) {
    imgs = [imgs];
  }

  const cleaned = (imgs as unknown[])
    .filter((i) => typeof i === 'string' && (i as string).trim().length > 0) as string[];

  return cleaned.length ? cleaned : ['/assets/industrial_cover.jpg'];
});

const formattedType = computed(() => {
  const type = space.value?.subcategory as string | undefined;
  const map: Record<string, string> = {
    warehouse: 'Depósito',
    dock: 'Dársena',
    yard: 'Patio Logístico',
    cold_storage: 'Cámara Fría',
    logistics: 'Centro Logístico'
  };
  return type ? map[type] || 'Espacio industrial' : 'Espacio industrial';
});

const formattedLocation = computed(() => {
  return space.value?.location || 'Ubicación estratégica en parque industrial';
});

const formattedSubtitle = computed(() => {
  if (!space.value) return 'Espacio industrial preparado para almacenamiento, logística y distribución.';
  return (
    space.value.suitable_for ||
    'Infraestructura lista para operaciones de almacenamiento, distribución y logística urbana inteligente.'
  );
});

const defaultSuitableText =
  'Espacio industrial preparado para almacenamiento, logística y distribución con infraestructura moderna y adaptable a distintos tipos de operación.';

onMounted(async () => {
  const slug = route.params.slug as string;

  try {
    await industrialStore.fetchSpaceBySlug(slug);

    if (!selectedSpace.value) {
      notFound.value = true;
    } else {
      document.title = `${selectedSpace.value.name} | HayLugar Industrial`;
    }
  } catch (err) {
    console.error('Error al cargar el espacio industrial:', err);
    notFound.value = true;
  } finally {
    loading.value = false;
  }
});

function goToReservation(slug: string) {
  // Mantener la ruta como la tenés definida en el router
  router.push(`/industrial/${slug}/industrial-reservation`);
}

function shareSpace() {
  if (!space.value) return;
  const url = window.location.href;

  if (navigator.share) {
    navigator.share({
      title: `HayLugar — ${space.value.name}`,
      text: `Encontrá este espacio logístico en HayLugar.`,
      url
    });
  } else {
    navigator.clipboard.writeText(url);
    alert('🔗 Enlace copiado al portapapeles');
  }
}
</script>

<style scoped>
.swiper-button-next,
.swiper-button-prev {
  color: #00b4d8;
  filter: drop-shadow(0 0 4px rgba(0, 180, 216, 0.5));
}
.swiper-pagination-bullet {
  background-color: #06d6a0 !important;
  opacity: 0.8;
}
.swiper-pagination-bullet-active {
  background-color: #00b4d8 !important;
  opacity: 1;
}
</style>
