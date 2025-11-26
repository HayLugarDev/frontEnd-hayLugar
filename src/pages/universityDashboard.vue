<template>

  <!-- HEADER SOLO EN DESKTOP -->
  <MainHeader class="hidden md:block" />

  <!-- MENÚ INFERIOR MOBILE -->
  <MobileButtonNav @navigate="(path) => router.push(path)" class="md:hidden" :showMap="false" />

  <div class="relative min-h-screen bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] text-white">

    <!-- Encabezado + Tabs -->
    <div class="px-6 py-6 flex items-center gap-3">
      <h2 class="text-2xl sm:text-3xl font-bold text-white drop-shadow">
        Estacionamientos Inteligentes — UTN
      </h2>

      <div class="ml-auto flex items-center gap-2">
        <button class="px-4 py-1.5 rounded-xl text-sm font-medium transition-all border border-white/10
                 backdrop-blur-md bg-white/10 hover:bg-white/20" :class="showMap ? 'text-[#06D6A0]' : 'text-gray-300'"
          @click="showMap = true">
          Ver mapa
        </button>

        <button class="px-4 py-1.5 rounded-xl text-sm font-medium transition-all border border-white/10
                 backdrop-blur-md bg-white/10 hover:bg-white/20" :class="!showMap ? 'text-[#06D6A0]' : 'text-gray-300'"
          @click="showMap = false">
          Ver lista
        </button>
      </div>
    </div>

    <!-- Filtros -->
    <div class="px-6 mt-6 py-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 
             flex flex-wrap gap-3 items-center container mx-auto">
      <button class="px-4 py-2 rounded-xl text-sm font-semibold transition-all border border-white/10
               backdrop-blur-sm" :class="filters.groups.students
                ? 'bg-[#06D6A0]/30 text-[#06D6A0]'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'" @click="toggleGroup('students')">
        🎓 Alumnos
      </button>

      <button class="px-4 py-2 rounded-xl text-sm font-semibold transition-all border border-white/10
               backdrop-blur-sm" :class="filters.groups.staff
                ? 'bg-[#00B4D8]/30 text-[#00B4D8]'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'" @click="toggleGroup('staff')">
        🧑‍🏫 Docentes
      </button>

      <button class="px-4 py-2 rounded-xl text-sm font-semibold transition-all border border-white/10
               backdrop-blur-sm" :class="filters.onlyAvailable
                ? 'bg-amber-300/20 text-amber-300'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'"
        @click="filters.onlyAvailable = !filters.onlyAvailable">
        ✅ Sólo disponibles
      </button>

      <span class="ml-auto text-xs text-[#B0BEC5]">
        Última actualización: {{ lastUpdatedText }}
      </span>
    </div>

    <div class="p-6 container mx-auto">
      <!-- MAPA -->
      <div v-if="showMap" class="w-full h-[68vh] relative rounded-2xl overflow-hidden shadow-xl border border-white/10">
        <CustomGoogleMap :center="center" :zoom="zoom" :options="mapOptions" :locateUser="true">

          <!-- Polígonos -->
          <GMapPolygon v-for="(zona, i) in zonasFiltradas" :key="'zone-' + i" :paths="zona.paths"
            :options="{ ...zona.options, clickable: false, zIndex: 1 }" />

          <!-- Icono UTN -->
          <GMapMarker :position="utnMarkerPosition" :icon="universityIcon" :options="{ zIndex: 3, clickable: false }" />

          <!-- Marcadores -->
          <GMapMarker v-for="(espacio, idx) in espaciosFiltrados" :key="'mk-' + espacio.id + '-' + idx"
            :position="{ lat: Number(espacio.latitude), lng: Number(espacio.longitude) }" :icon="getMarkerIcon(espacio)"
            :options="{ zIndex: 2, clickable: true }" @mouseover="setHovered(espacio)" @mouseout="clearHovered"
            @click="openAccessModal(espacio)" />
        </CustomGoogleMap>

        <!-- Panel lateral hover -->
        <transition name="slide-fade">
          <div v-if="hoveredSpace" class="absolute right-4 top-4 w-[320px] bg-[#1B263B]/80 backdrop-blur-md border border-white/10 
                   rounded-xl shadow-xl p-5">
            <div class="flex items-start gap-3">
              <div class="px-2 py-0.5 rounded text-xs font-semibold" :class="badgeClass(hoveredSpace)">
                {{ groupLabel(hoveredSpace) }}
              </div>

              <div class="ml-auto text-xs" :class="hoveredSpace.capacity > 0 ? 'text-[#06D6A0]' : 'text-rose-400'">
                {{ hoveredSpace.capacity > 0 ? 'Disponible' : 'Completo' }}
              </div>
            </div>

            <h3 class="mt-2 text-lg font-semibold text-white leading-tight">
              {{ hoveredSpace.name }}
            </h3>
            <p class="text-sm text-[#B0BEC5] mt-1">📍 {{ hoveredSpace.location }}</p>

            <div class="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div class="p-3 rounded-xl bg-white/5 border border-white/10">
                <div class="text-[#B0BEC5]">Capacidad</div>
                <div class="font-semibold text-white">
                  {{ hoveredSpace.capacity ?? capacityFromVehicle(hoveredSpace) }}
                </div>
              </div>

              <div class="p-3 rounded-xl bg-white/5 border border-white/10">
                <div class="text-[#B0BEC5]">Grupo</div>
                <div class="font-semibold text-white">{{ groupLabel(hoveredSpace) }}</div>
              </div>
            </div>

            <button
              class="mt-4 w-full bg-[#00B4D8] hover:bg-[#06D6A0] text-dark font-semibold rounded-xl py-2 transition-all"
              @click="openAccessModal(hoveredSpace)">
              Confirmar acceso
            </button>
          </div>
        </transition>

        <!-- Leyenda -->
        <div class="absolute left-4 bottom-4 bg-[#1B263B]/80 backdrop-blur-md border border-white/10 
                 rounded-xl shadow-xl p-4 text-xs text-gray-200">
          <div class="font-semibold mb-2 text-white">Leyenda</div>

          <div class="flex items-center gap-2 mb-1">
            <span class="inline-block w-3 h-3 rounded-full bg-emerald-500"></span>
            <span>Zona Alumnos</span>
          </div>
          <div class="flex items-center gap-2 mb-2">
            <span class="inline-block w-3 h-3 rounded-full bg-blue-500"></span>
            <span>Zona Docentes</span>
          </div>

          <div class="flex items-center gap-2 mb-1">
            <img :src="icons.students.available" class="w-4 h-4" />
            <span>Alumno — Disponible</span>
          </div>

          <div class="flex items-center gap-2 mb-1">
            <img :src="icons.students.full" class="w-4 h-4" />
            <span>Alumno — Completo</span>
          </div>

          <div class="flex items-center gap-2 mb-1">
            <img :src="icons.staff.available" class="w-4 h-4" />
            <span>Docente — Disponible</span>
          </div>

          <div class="flex items-center gap-2">
            <img :src="icons.staff.full" class="w-4 h-4" />
            <span>Docente — Completo</span>
          </div>
        </div>
      </div>

      <!-- LISTA -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <SpaceCard v-for="espacio in espaciosFiltrados" :key="espacio.id" :espacio="espacio" />
      </div>
    </div>

    <ConfirmAccessModal :open="modalOpen" :space="selectedSpace" @close="modalOpen = false"
      @success="onAccessSuccess" />

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
        Universidad inteligente
      </div>
    </div>
  </footer>

  </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue'
import MainHeader from '../components/layout/header/MainHeader.vue'
import CustomGoogleMap from '../components/layout/GoogleMap.vue'
import SpaceCard from '../components/pages/dashboardPage/SpaceCard.vue'
import { getUniversitySpaces } from '../services/universityService'
import { useUniversityMap } from '../logic/useUniversityMap'
import ConfirmAccessModal from '../components/confirmAccessDialog.vue'
import MobileButtonNav from '../components/layout/MobileButtonNav.vue'
import { useRouter } from 'vue-router'

const router = useRouter();

/** ICONOS (SVG en data-URI) */
const icons = {
  students: {
    available:
      'data:image/svg+xml;utf8,<svg width="40" height="40" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><filter id="s"><feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="%23000000" flood-opacity="0.3"/></filter></defs><circle cx="32" cy="32" r="30" fill="%23E8F7EF"/><g filter="url(%23s)"><path d="M6 24l26-10 26 10-26 10L6 24z" fill="%2310B981"/><path d="M16 30v8c0 2 10 6 16 6s16-4 16-6v-8l-16 6-16-6z" fill="%2322C55E"/></g><path d="M48 28v8a2 2 0 0 0 4 0v-8h-4z" fill="%2310B981"/></svg>',
    full:
      'data:image/svg+xml;utf8,<svg width="40" height="40" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><filter id="s"><feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="%23000000" flood-opacity="0.3"/></filter></defs><circle cx="32" cy="32" r="30" fill="%23FDECEC"/><g filter="url(%23s)"><path d="M6 24l26-10 26 10-26 10L6 24z" fill="%23DC2626"/><path d="M16 30v8c0 2 10 6 16 6s16-4 16-6v-8l-16 6-16-6z" fill="%23EF4444"/></g><path d="M48 28v8a2 2 0 0 0 4 0v-8h-4z" fill="%23DC2626"/></svg>'
  },
  staff: {
    available:
      'data:image/svg+xml;utf8,<svg width="40" height="40" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><filter id="s"><feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="%23000000" flood-opacity="0.3"/></filter></defs><circle cx="32" cy="32" r="30" fill="%23E8F7EF"/><g filter="url(%23s)"><path d="M6 24l26-10 26 10-26 10L6 24z" fill="%2310B981"/><path d="M16 30v8c0 2 10 6 16 6s16-4 16-6v-8l-16 6-16-6z" fill="%2322C55E"/></g><path d="M48 28v8a2 2 0 0 0 4 0v-8h-4z" fill="%2310B981"/></svg>',
    full:
      'data:image/svg+xml;utf8,<svg width="40" height="40" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><filter id="s"><feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="%23000000" flood-opacity="0.3"/></filter></defs><circle cx="32" cy="32" r="30" fill="%23FDECEC"/><g filter="url(%23s)"><path d="M6 24l26-10 26 10-26 10L6 24z" fill="%23DC2626"/><path d="M16 30v8c0 2 10 6 16 6s16-4 16-6v-8l-16 6-16-6z" fill="%23EF4444"/></g><path d="M48 28v8a2 2 0 0 0 4 0v-8h-4z" fill="%23DC2626"/></svg>'
  },
  university:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQxDogY_QPvIai_GqjWgiHGJVSL7TwaMS4jA&s'
}

const showMap = ref(true)
const error = ref(null)
const espacios = ref([])
const lastUpdated = ref(new Date())

// Mapa (centrado en UTN) + opciones
const { center, zoom, mapOptions, setCenterToLocation } = useUniversityMap()

// Marker fijo de la UTN FRT
const utnMarkerPosition = { lat: -26.817180602149435, lng: -65.19934057381433 }
const universityIcon = { url: icons.university, scaledSize: { width: 46, height: 46 } }

// Zonas (rectángulos ajustados alrededor de anclas provistas)
const zonas = ref([
  // Alumnos (alrededor de -26.81676322927546, -65.19852170727803)
  {
    group: 'students',
    paths: [
      { lat: -26.81690, lng: -65.19866 },
      { lat: -26.81690, lng: -65.19838 },
      { lat: -26.81662, lng: -65.19838 },
      { lat: -26.81662, lng: -65.19866 }
    ],
    options: {
      fillColor: '#10b981',
      fillOpacity: 0.18,
      strokeColor: '#059669',
      strokeOpacity: 0.9,
      strokeWeight: 2
    }
  },
  // Docentes (alrededor de -26.81747062254733, -65.1986508902072)
  {
    group: 'staff',
    paths: [
      { lat: -26.81760, lng: -65.19878 },
      { lat: -26.81760, lng: -65.19853 },
      { lat: -26.81735, lng: -65.19853 },
      { lat: -26.81735, lng: -65.19878 }
    ],
    options: {
      fillColor: '#3b82f6',
      fillOpacity: 0.16,
      strokeColor: '#2563eb',
      strokeOpacity: 0.9,
      strokeWeight: 2
    }
  }
])

// Filtros
const filters = ref({
  groups: { students: true, staff: true },
  onlyAvailable: false
})

// Helpers UI/datos
const lastUpdatedText = computed(() => lastUpdated.value.toLocaleTimeString())
const badgeClass = (esp) => (esp.access_group === 'staff'
  ? 'bg-blue-100 text-blue-700'
  : 'bg-emerald-100 text-emerald-700')
const groupLabel = (esp) => (esp.access_group === 'staff' ? 'Docentes' : 'Alumnos')

// Capacidad derivada si viene por vehicle_capacities
const capacityFromVehicle = (esp) => {
  try {
    const caps = typeof esp.vehicle_capacities === 'string'
      ? JSON.parse(esp.vehicle_capacities)
      : (esp.vehicle_capacities || [])
    return caps.reduce((acc, it) => acc + Number(it.capacity || 0), 0)
  } catch { return 0 }
}

// Normalización de access_group (backend puede mandar docentes/teacher/etc.)
const normalizeGroup = (g) =>
  (g && ['staff', 'docentes', 'teacher', 'profesor', 'profesores'].includes(String(g).toLowerCase()))
    ? 'staff'
    : 'students'

// Filtrado de espacios
const espaciosFiltrados = computed(() =>
  (espacios.value || [])
    .filter(e => !!e.university_id)
    .filter(e => filters.value.groups[(e.access_group || 'students')])
    .filter(e => (filters.value.onlyAvailable
      ? (Number(e.capacity ?? capacityFromVehicle(e)) > 0)
      : true))
)

const zonasFiltradas = computed(() => {
  const out = []
  if (filters.value.groups.students) out.push(zonas.value.find(z => z.group === 'students'))
  if (filters.value.groups.staff) out.push(zonas.value.find(z => z.group === 'staff'))
  return out.filter(Boolean)
})

// Hover/panel
const hoveredSpace = ref(null)
const setHovered = (esp) => { hoveredSpace.value = esp }
const clearHovered = () => { hoveredSpace.value = null }

// Icono por grupo/estado (rojo si sin capacidad)
const getMarkerIcon = (esp) => {
  const group = esp.access_group === 'staff' ? 'staff' : 'students'
  const cap = Number(esp.capacity ?? capacityFromVehicle(esp))
  const url = cap > 0 ? icons[group].available : icons[group].full
  return { url, scaledSize: { width: 40, height: 40 } }
}

const toggleGroup = (g) => (filters.value.groups[g] = !filters.value.groups[g])

// Modal Acceso
const modalOpen = ref(false)
const selectedSpace = ref(null)
const openAccessModal = (esp) => {
  selectedSpace.value = esp
  modalOpen.value = true
}
const onAccessSuccess = (_payload) => {
  modalOpen.value = false
  loadSpaces()
}

// Carga de datos
const loadSpaces = async () => {
  try {
    const data = await getUniversitySpaces()
    espacios.value = (data || []).map(e => ({
      ...e,
      access_group: normalizeGroup(e.access_group),
      capacity: e.capacity ?? null
    }))
    lastUpdated.value = new Date()
  } catch (e) {
    console.error(e)
    error.value = 'Error al cargar espacios universitarios'
  }
}

onMounted(async () => {
  setCenterToLocation(-26.81705, -65.19855) // centro del campus aprox
  await loadSpaces()
  setInterval(loadSpaces, 10000) // refresco “real-time”
})
</script>

<style scoped>
/* Transición panel lateral */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all .18s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}
</style>
