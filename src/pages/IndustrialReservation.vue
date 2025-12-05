<template>
  <div
    class="min-h-screen bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] text-white flex flex-col"
  >
    <MainHeader class="hidden md:block" />

    <!-- HEADER -->
    <header
      class="flex items-center justify-between px-6 md:px-12 py-6 border-b border-white/10 bg-[#0D1B2A]/80 backdrop-blur-xl shadow-lg"
    >
      <div class="flex items-center gap-3">
        <img :src="logo" alt="HayLugar" class="h-10 w-10" />
        <div>
          <p class="text-xs md:text-sm text-[#A0B0C0] tracking-wide">
            Reserva industrial · Paso 1
          </p>
          <h1 class="text-xl md:text-2xl font-semibold tracking-wide">
            Confirmar reserva del espacio
          </h1>
        </div>
      </div>

      <button
        @click="router.back()"
        class="text-xs md:text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl border border-white/10 transition-all"
      >
        ← Volver
      </button>
    </header>

    <!-- MAIN -->
    <section class="container mx-auto px-6 md:px-12 py-10 grid md:grid-cols-3 gap-10">

      <!-- ======================== COLUMNA IZQUIERDA ======================== -->
      <div class="md:col-span-2 flex flex-col gap-8">

        <!-- === RESUMEN DEL ESPACIO === -->
        <div class="bg-[#1B263B]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
          <h2 class="text-xl font-semibold">{{ space?.name }}</h2>
          <p class="text-[#B0BEC5] text-sm">{{ space?.location }}</p>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-sm">
            <div class="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-1">
              <span class="text-[10px] text-[#78909C] uppercase">Tipo</span>
              <div class="flex items-center gap-2">
                <i class="fa-solid fa-layer-group text-[#FFD166]"></i>
                <span class="font-medium">{{ formatType(space?.subcategory) }}</span>
              </div>
            </div>

            <div class="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-1">
              <span class="text-[10px] text-[#78909C] uppercase">Superficie</span>
              <div class="flex items-center gap-2">
                <i class="fa-solid fa-ruler-combined text-[#06D6A0]"></i>
                <span class="font-medium">{{ space?.capacity_m2 }} m²</span>
              </div>
            </div>

            <div class="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-1">
              <span class="text-[10px] text-[#78909C] uppercase">Altura útil</span>
              <div class="flex items-center gap-2">
                <i class="fa-solid fa-up-down text-[#00B4D8]"></i>
                <span class="font-medium">{{ space?.height_m ?? '—' }} m</span>
              </div>
            </div>

            <div class="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-1">
              <span class="text-[10px] text-[#78909C] uppercase">Energía</span>
              <div class="flex items-center gap-2">
                <i
                  class="fa-solid fa-bolt"
                  :class="space?.energy_3phase ? 'text-[#FFD166]' : 'text-[#607D8B]'"
                ></i>
                <span class="font-medium">
                  {{ space?.energy_3phase ? 'Trifásica' : 'No trifásica' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- === FORMULARIO === -->
        <div class="bg-[#1B263B]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">

          <!-- Fechas -->
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs uppercase tracking-wider text-[#B0BEC5] mb-1">Desde</label>
              <input
                v-model="startDate"
                type="datetime-local"
                class="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#00B4D8] outline-none"
              />
              <p v-if="errors.startDate" class="text-xs text-red-400 mt-1">{{ errors.startDate }}</p>
            </div>

            <div>
              <label class="block text-xs uppercase tracking-wider text-[#B0BEC5] mb-1">Hasta</label>
              <input
                v-model="endDate"
                type="datetime-local"
                class="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#00B4D8] outline-none"
              />
              <p v-if="errors.endDate" class="text-xs text-red-400 mt-1">{{ errors.endDate }}</p>
            </div>
          </div>

          <!-- AVAILABILITY UI REAL -->
          <div class="mt-1 space-y-2">
            <p v-if="errors.availability" class="text-xs text-red-400">
              {{ errors.availability }}
            </p>

            <div v-if="availability.checked">
              <!-- DISPONIBLE -->
              <div
                v-if="availability.available"
                class="flex items-center gap-3 bg-[#06D6A0]/20 border border-[#06D6A0]/40 text-[#06D6A0] px-4 py-3 rounded-xl"
              >
                <i class="fa-solid fa-circle-check text-xl"></i>
                <div>
                  <p class="font-semibold">Disponible</p>
                  <p class="text-xs opacity-80">
                    Este espacio se encuentra libre en el horario seleccionado.
                  </p>
                </div>
              </div>

              <!-- NO DISPONIBLE -->
              <div
                v-else
                class="flex flex-col gap-3 bg-red-500/20 border border-red-500/40 text-red-300 px-4 py-3 rounded-xl"
              >
                <div class="flex items-center gap-3">
                  <i class="fa-solid fa-circle-xmark text-xl"></i>
                  <div>
                    <p class="font-semibold">No disponible</p>
                    <p class="text-xs opacity-80">
                      El horario seleccionado se superpone con una reserva existente.
                    </p>
                  </div>
                </div>

                <!-- Conflictos -->
                <div
                  v-for="c in availability.conflicts"
                  :key="c.id"
                  class="text-xs bg-white/5 border border-white/10 rounded-xl px-3 py-2"
                >
                  <p>
                    <span class="font-medium text-white">Reserva #{{ c.id }}</span>
                  </p>
                  <p class="opacity-80">
                    {{ c.start_time }} → {{ c.end_time }}
                  </p>
                  <p class="opacity-60 capitalize">
                    Estado: {{ c.status }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- PRECIOS + MÉTODO -->
          <div class="grid md:grid-cols-2 gap-4 mt-4">
            <div>
              <label class="block text-xs uppercase tracking-wider text-[#B0BEC5] mb-1">Unidad de precio</label>
              <select
                v-model="pricingUnit"
                class="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#00B4D8]"
              >
                <option value="hour">Hora</option>
                <option value="day">Día</option>
                <option value="week">Semana</option>
                <option value="month">Mes</option>
              </select>
            </div>

            <div>
              <label class="block text-xs uppercase tracking-wider text-[#B0BEC5] mb-1">Método de pago</label>
              <select
                v-model="method"
                class="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#00B4D8]"
              >
                <option value="wallet">Billetera HayLugar</option>
                <option value="mercadopago">Mercado Pago</option>
                <option value="manual_contract">Contrato (sin pago)</option>
              </select>
            </div>
          </div>

          <!-- DESCRIPCIÓN DE OPERACIÓN -->
          <div>
            <label class="block text-xs uppercase tracking-wider text-[#B0BEC5] mb-1">
              Descripción de la operación
            </label>
            <textarea
              v-model="operationDetails"
              rows="3"
              class="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#00B4D8] outline-none resize-none placeholder-gray-400"
              placeholder="Ej: 45 pallets semanal, carga seca, ingreso de flota 3 unidades..."
            ></textarea>
            <p v-if="errors.operationDetails" class="text-xs text-red-400 mt-1">
              {{ errors.operationDetails }}
            </p>
          </div>

          <!-- RESPONSABLE -->
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs uppercase tracking-wider text-[#B0BEC5] mb-1">Responsable</label>
              <input
                v-model="contactName"
                type="text"
                class="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#00B4D8]"
                placeholder="Nombre y apellido"
              />
              <p v-if="errors.contactName" class="text-xs text-red-400 mt-1">
                {{ errors.contactName }}
              </p>
            </div>

            <div>
              <label class="block text-xs uppercase tracking-wider text-[#B0BEC5] mb-1">Teléfono / WhatsApp</label>
              <input
                v-model="contactPhone"
                type="text"
                class="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#00B4D8]"
                placeholder="+54 9 ..."
              />
              <p v-if="errors.contactPhone" class="text-xs text-red-400 mt-1">
                {{ errors.contactPhone }}
              </p>
            </div>
          </div>
        </div>

        <!-- === VENTANA OPERATIVA (DEMO) === -->
        <div class="bg-[#1B263B]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
          <h3 class="text-lg font-semibold mb-3">Ventana operativa</h3>

          <div class="grid grid-cols-7 gap-2 text-xs">
            <div
              v-for="d in demoDays"
              :key="d.label"
              class="rounded-lg px-2 py-3 text-center border"
              :class="d.available ? 'bg-[#06D6A0]/15 border-[#06D6A0]/30' : 'bg-white/5 border-white/10 text-[#B0BEC5]'"
            >
              <div class="font-semibold">{{ d.label }}</div>
              <div class="opacity-80">{{ d.range }}</div>
            </div>
          </div>

          <p class="text-[#B0BEC5] text-xs mt-2">
            * Orientativo según disponibilidad general del parque industrial.
          </p>
        </div>
      </div>

      <!-- ======================== COLUMNA DERECHA ======================== -->
      <aside
        class="bg-[#1B263B]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-fit sticky top-8 shadow-xl"
      >
        <h4 class="text-lg font-semibold mb-4">Resumen</h4>

        <!-- ALERTA DISPONIBILIDAD -->
        <div
          v-if="availability.checked && availability.available === false"
          class="bg-red-500/20 border border-red-500/40 text-red-300 px-3 py-2 rounded-xl text-xs mb-3"
        >
          El espacio no está disponible en el horario seleccionado.
        </div>

        <ul class="space-y-2 text-sm text-[#B0BEC5]">
          <li class="flex justify-between">
            <span>Espacio</span>
            <span class="text-white">{{ space?.name }}</span>
          </li>
          <li class="flex justify-between">
            <span>Desde</span>
            <span class="text-white">{{ startDate || '—' }}</span>
          </li>
          <li class="flex justify-between">
            <span>Hasta</span>
            <span class="text-white">{{ endDate || '—' }}</span>
          </li>
          <li class="flex justify-between">
            <span>Unidad</span>
            <span class="text-white capitalize">{{ pricingUnit }}</span>
          </li>
          <li class="flex justify-between">
            <span>Precio unidad</span>
            <span class="text-white">${{ pricePerUnit }}</span>
          </li>
          <li class="flex justify-between">
            <span>Método</span>
            <span class="text-white">{{ methodLabel }}</span>
          </li>
        </ul>

        <div class="my-4 border-t border-white/10"></div>

        <div class="flex items-center justify-between">
          <span class="text-lg font-semibold">Total estimado</span>
          <span class="text-3xl font-bold text-[#00B4D8]">${{ estimation }}</span>
        </div>

        <button
          :disabled="!canConfirm"
          @click="openConfirm = true"
          class="w-full mt-6 bg-gradient-to-r from-[#00B4D8] to-[#06D6A0] hover:opacity-90 text-[#0D1B2A] font-semibold py-3 rounded-xl transition-all shadow-md hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continuar
        </button>

        <p class="text-[11px] text-[#90A4AE] mt-4">
          No se realiza ningún cobro en esta instancia.
        </p>
      </aside>
    </section>

    <!-- ======================== MODAL ======================== -->
    <div
      v-if="openConfirm"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-6"
    >
      <div class="bg-[#0D1B2A] border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
        <h3 class="text-lg font-semibold">Confirmar reserva</h3>
        <p class="text-[#B0BEC5] text-sm mt-1">Revisá los datos antes de continuar.</p>

        <div class="bg-[#1B263B] p-4 rounded-xl mt-4 text-sm space-y-2 border border-white/10">
          <div class="flex justify-between">
            <span>Espacio</span>
            <span class="text-white">{{ space?.name }}</span>
          </div>
          <div class="flex justify-between">
            <span>Período</span>
            <span class="text-white">{{ startDate }} → {{ endDate }}</span>
          </div>
          <div class="flex justify-between">
            <span>Método</span>
            <span class="text-white">{{ methodLabel }}</span>
          </div>
          <div class="flex justify-between">
            <span>Total</span>
            <span class="text-[#00B4D8] font-semibold">${{ estimation }}</span>
          </div>
          <div
            v-if="method === 'manual_contract'"
            class="text-xs text-[#FFD166]"
          >
            * El equipo comercial se pondrá en contacto para formalizar contrato.
          </div>
        </div>

        <div class="flex items-center gap-3 mt-5">
          <button
            @click="confirmReservation"
            class="px-4 py-2 bg-white text-[#0D1B2A] rounded-xl font-semibold hover:opacity-90"
          >
            Confirmar
          </button>

          <button
            @click="openConfirm = false"
            class="px-4 py-2 bg-white/10 border border-white/10 rounded-xl hover:bg-white/20"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>

    <!-- FOOTER -->
    <footer class="mt-10 border-t border-white/10 bg-[#0D1B2A]/80 backdrop-blur-xl">
      <div
        class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between 
              gap-4 px-6 py-8 text-[#B0BEC5] text-sm"
      >
        <div class="flex items-center gap-2">
          <span class="text-white font-semibold tracking-wide">HayLugar</span>
          <span class="text-xs text-[#78909C]">© {{ new Date().getFullYear() }}</span>
        </div>
        <div class="flex gap-6">
          <router-link to="/PrivacyPolicy" class="hover:text-white transition-colors duration-200">
            Política de Privacidad
          </router-link>
          <router-link to="/termsConditions" class="hover:text-white transition-colors duration-200">
            Términos y Condiciones
          </router-link>
        </div>
        <div class="text-xs text-[#78909C]">
          Logística inteligente
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import logo from "../assets/logo.png";
import MainHeader from "../components/layout/header/MainHeader.vue";

import api from "../services/apiService";
import { useSpaceStore } from "../store/spaceStore";
import { useReservationIndustrialStore } from "../store/reservationIndustrialStore";

const route = useRoute();
const router = useRouter();

// Stores
const spaceStore = useSpaceStore();
const reservationStore = useReservationIndustrialStore();

// Data refs
const space = ref<any>(null);

const startDate = ref("");
const endDate = ref("");

const pricingUnit = ref<"hour" | "day" | "week" | "month">("day");
const method = ref<"wallet" | "mercadopago" | "manual_contract">("wallet");

const operationDetails = ref("");
const contactName = ref("");
const contactPhone = ref("");

const notes = ref("");
const openConfirm = ref(false);

const errors = ref<Record<string, string>>({});

// Availability from store
const availability = computed(() => reservationStore.availability);

// Computed
const pricePerUnit = computed(() => Number(space.value?.price_per_unit || 0));

const methodLabel = computed(() => {
  return method.value === "wallet"
    ? "Billetera HayLugar"
    : method.value === "mercadopago"
    ? "Mercado Pago"
    : "Contrato (sin pago)";
});

const estimation = computed(() =>
  spaceStore.estimateCost(
    pricingUnit.value,
    pricePerUnit.value,
    startDate.value,
    endDate.value
  )
);

const canConfirm = computed(() => {
  return (
    !!space.value &&
    !!startDate.value &&
    !!endDate.value &&
    availability.value.available !== false
  );
});

const demoDays = computed(() => {
  const base = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
  return base.map((label, i) => ({
    label,
    range:
      space.value?.availability?.start && space.value?.availability?.end
        ? `${space.value.availability.start}–${space.value.availability.end}`
        : "08:00–18:00",
    available: i < 5,
  }));
});

// On mount
onMounted(async () => {
  const slug = route.params.slug as string;

  const res = await api.get(`industrial/spaces/slug/${slug}`);
  const sp = res.data;

  let imgs = sp?.images;
  if (typeof imgs === "string") {
    try {
      imgs = JSON.parse(imgs);
    } catch {
      imgs = [];
    }
  }

  space.value = { ...sp, images: Array.isArray(imgs) ? imgs : [] };

  pricingUnit.value = space.value?.pricing_unit || "day";

  startDate.value = new Date().toISOString().slice(0, 16);
  const end = new Date();
  end.setDate(end.getDate() + 1);
  endDate.value = end.toISOString().slice(0, 16);
});

// Watch fechas -> availability real
watch([startDate, endDate], async () => {
  // reset error de disponibilidad
  delete errors.value.availability;

  if (!startDate.value || !endDate.value || !space.value?.id) return;

  reservationStore.setReservationData({
    space_id: space.value.id,
    slug: route.params.slug as string,
    start_time: new Date(startDate.value).toISOString(),
    end_time: new Date(endDate.value).toISOString(),
    pricing_unit: pricingUnit.value,
    price_per_unit: pricePerUnit.value,
  });

  try {
    await reservationStore.checkAvailability();
  } catch (err) {
    console.warn("Availability check failed:", err);
  }
});

// Validate
function validateForm() {
  errors.value = {};

  if (!startDate.value) {
    errors.value.startDate = "Ingresá la fecha de inicio.";
  }
  if (!endDate.value) {
    errors.value.endDate = "Ingresá la fecha de fin.";
  }

  // Validar rango lógico
  if (startDate.value && endDate.value) {
    const start = new Date(startDate.value);
    const end = new Date(endDate.value);
    if (end <= start) {
      errors.value.endDate = "La fecha de fin debe ser posterior a la de inicio.";
    }
  }

  if (!operationDetails.value || operationDetails.value.length < 10) {
    errors.value.operationDetails = "Describí brevemente tu operación.";
  }
  if (!contactName.value) {
    errors.value.contactName = "Ingresá un responsable.";
  }
  if (!contactPhone.value) {
    errors.value.contactPhone = "Ingresá teléfono de contacto.";
  }

  if (availability.value.available === false) {
    errors.value.availability = "El horario seleccionado no está disponible.";
  }

  return Object.keys(errors.value).length === 0;
}

// Confirm reservation
async function confirmReservation() {
  if (!validateForm()) return;

  reservationStore.setReservationData({
    space_id: space.value.id,
    slug: route.params.slug as string,
    start_time: new Date(startDate.value).toISOString(),
    end_time: new Date(endDate.value).toISOString(),
    pricing_unit: pricingUnit.value,
    price_per_unit: pricePerUnit.value,
    estimated_total: estimation.value,
    method: method.value,
    notes: notes.value,
    operation_details: operationDetails.value,
    contact_name: contactName.value,
    contact_phone: contactPhone.value,
  });

  try {
    await reservationStore.submitIndustrialReservation();
    openConfirm.value = false;

    router.push({
      name: "IndustrialDetail",
      params: { slug: route.params.slug },
    });
  } catch (err) {
    console.error("Error al crear reserva industrial:", err);
  }
}

// Format
function formatType(type?: string) {
  const map: Record<string, string> = {
    warehouse: "Depósito",
    dock: "Dársena",
    yard: "Patio Logístico",
    cold_storage: "Cámara Fría",
    logistics: "Centro Logístico",
  };
  return type ? map[type] || "Industrial" : "Industrial";
}
</script>
