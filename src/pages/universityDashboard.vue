<template>
  <div class="relative min-h-screen bg-secondary">
    <MainHeader />

    <!-- Encabezado + tabs -->
    <div class="px-4 pt-4 flex items-center gap-3">
      <h2 class="text-2xl sm:text-3xl font-bold text-primary">
        Estacionamientos Inteligentes — UTN
      </h2>
      <div class="ml-auto flex items-center gap-2">
        <button
          class="px-3 py-1.5 rounded-full text-sm font-medium border bg-white hover:bg-gray-50 transition"
          :class="showMap ? 'text-primary border-primary/30' : 'text-gray-700 border-gray-300'"
          @click="showMap = true"
        >
          Mapa
        </button>
        <button
          class="px-3 py-1.5 rounded-full text-sm font-medium border bg-white hover:bg-gray-50 transition"
          :class="!showMap ? 'text-primary border-primary/30' : 'text-gray-700 border-gray-300'"
          @click="showMap = false"
        >
          Lista
        </button>
      </div>
    </div>

    <!-- Filtros -->
    <div class="px-4 mt-3 flex flex-wrap gap-2 items-center">
      <button
        class="px-3 py-1.5 rounded-full text-sm font-semibold transition border"
        :class="filters.groups.students ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-white text-gray-700 border-gray-300'"
        @click="toggleGroup('students')"
      >
        🎓 Alumnos
      </button>
      <button
        class="px-3 py-1.5 rounded-full text-sm font-semibold transition border"
        :class="filters.groups.staff ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-white text-gray-700 border-gray-300'"
        @click="toggleGroup('staff')"
      >
        🧑‍🏫 Docentes
      </button>
      <button
        class="px-3 py-1.5 rounded-full text-sm font-semibold transition border"
        :class="filters.onlyAvailable ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-white text-gray-700 border-gray-300'"
        @click="filters.onlyAvailable = !filters.onlyAvailable"
      >
        ✅ Sólo disponibles
      </button>

      <span class="ml-auto text-xs text-gray-500">
        Última actualización: {{ lastUpdatedText }}
      </span>
    </div>

    <div class="p-4">
      <div v-if="error" class="text-red-500 mb-4">{{ error }}</div>

      <!-- MAPA -->
      <div v-if="showMap" class="w-full h-[68vh] relative rounded-xl overflow-hidden shadow">
        <CustomGoogleMap :center="center" :zoom="zoom" :options="mapOptions">
          <!-- Zonas exactas (polígonos) -->
          <GMapPolygon
            v-for="(zona, i) in zonasFiltradas"
            :key="'zone-'+i"
            :paths="zona.paths"
            :options="{ ...zona.options, clickable: false, zIndex: 1 }"
          />

          <!-- Pin fijo de la Universidad (UTN FRT) -->
          <GMapMarker
            :position="utnMarkerPosition"
            :icon="universityIcon"
            :options="{ zIndex: 3, clickable: false }"
          />

          <!-- Marcadores con iconos por grupo/estado y clic habilitado -->
          <GMapMarker
            v-for="(espacio, idx) in espaciosFiltrados"
            :key="'mk-'+espacio.id+'-'+idx"
            :position="{ lat: Number(espacio.latitude), lng: Number(espacio.longitude) }"
            :icon="getMarkerIcon(espacio)"
            :options="{ zIndex: 2, clickable: true }"
            @mouseover="setHovered(espacio)"
            @mouseout="clearHovered"
            @click="openAccessModal(espacio)"
          />
        </CustomGoogleMap>

        <!-- Panel lateral (hover) -->
        <transition name="slide-fade">
          <div
            v-if="hoveredSpace"
            class="absolute right-4 top-4 w-[320px] bg-white border border-gray-200 rounded-xl shadow-lg p-4"
          >
            <div class="flex items-start gap-3">
              <div
                class="px-2 py-0.5 rounded text-xs font-semibold"
                :class="badgeClass(hoveredSpace)"
              >
                {{ groupLabel(hoveredSpace) }}
              </div>
              <div class="ml-auto text-xs" :class="hoveredSpace.capacity > 0 ? 'text-emerald-600' : 'text-rose-600'">
                {{ hoveredSpace.capacity > 0 ? 'Disponible' : 'Completo' }}
              </div>
            </div>

            <h3 class="mt-2 text-lg font-semibold text-gray-900 leading-tight">
              {{ hoveredSpace.name }}
            </h3>
            <p class="text-sm text-gray-600 mt-1">📍 {{ hoveredSpace.location }}</p>

            <div class="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div class="p-2 rounded bg-gray-50">
                <div class="text-gray-500">Capacidad</div>
                <div class="font-semibold">
                  {{ hoveredSpace.capacity ?? capacityFromVehicle(hoveredSpace) }}
                </div>
              </div>
              <div class="p-2 rounded bg-gray-50">
                <div class="text-gray-500">Grupo</div>
                <div class="font-semibold">{{ groupLabel(hoveredSpace) }}</div>
              </div>
            </div>

            <button
              class="mt-4 w-full bg-primary text-white font-semibold rounded-lg py-2 hover:bg-primary-dark transition"
              @click="openAccessModal(hoveredSpace)"
            >
              Confirmar acceso
            </button>
          </div>
        </transition>

        <!-- Leyenda -->
        <div
          class="absolute left-4 bottom-4 bg-white/90 backdrop-blur border border-gray-200 rounded-lg shadow p-3 text-xs text-gray-700"
        >
          <div class="font-semibold mb-2">Leyenda</div>

          <div class="flex items-center gap-2 mb-1">
            <span class="inline-block w-3 h-3 rounded-full bg-emerald-500"></span>
            <span>Zona Alumnos</span>
          </div>
          <div class="flex items-center gap-2 mb-2">
            <span class="inline-block w-3 h-3 rounded-full bg-blue-500"></span>
            <span>Zona Docentes</span>
          </div>

          <div class="flex items-center gap-2 mb-1">
            <img :src="icons.students.available" class="w-4 h-4" alt="Alumno disponible" />
            <span>Alumno — Disponible</span>
          </div>
          <div class="flex items-center gap-2 mb-1">
            <img :src="icons.students.full" class="w-4 h-4" alt="Alumno completo" />
            <span>Alumno — Completo</span>
          </div>
          <div class="flex items-center gap-2 mb-1">
            <img :src="icons.staff.available" class="w-4 h-4" alt="Docente disponible" />
            <span>Docente — Disponible</span>
          </div>
          <div class="flex items-center gap-2">
            <img :src="icons.staff.full" class="w-4 h-4" alt="Docente completo" />
            <span>Docente — Completo</span>
          </div>
        </div>
      </div>

      <!-- LISTA -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <SpaceCard
          v-for="espacio in espaciosFiltrados"
          :key="espacio.id"
          :espacio="espacio"
        />
      </div>
    </div>

    <!-- Menú móvil -->
    <div class="fixed bottom-0 left-0 w-full z-50">
      <MobileMenu :showMap="showMap" @toggle="showMap = !showMap" />
    </div>

    <!-- Modal Confirmar Acceso (legajo + patente) -->
    <ConfirmAccessModal
      :open="modalOpen"
      :space="selectedSpace"
      @close="modalOpen = false"
      @success="onAccessSuccess"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import MainHeader from '../components/layout/header/MainHeader.vue'
import CustomGoogleMap from '../components/layout/GoogleMap.vue'
import MobileMenu from '../components/layout/MobileMenu.vue'
import SpaceCard from '../components/pages/dashboardPage/SpaceCard.vue'
import { getUniversitySpaces } from '../services/universityService'
import { useUniversityMap } from '../logic/useUniversityMap'
import ConfirmAccessModal from '../components/confirmAccessDialog.vue'

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
  (g && ['staff','docentes','teacher','profesor','profesores'].includes(String(g).toLowerCase()))
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
