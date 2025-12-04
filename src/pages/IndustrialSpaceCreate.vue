<template>
  <div class="min-h-screen bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] text-white">
    <MainHeader class="hidden md:block" />

    <div class="max-w-4xl mx-auto px-6 md:px-12 py-12">

      <h1 class="text-3xl font-bold mb-6 flex items-center gap-3">
        <i class="fa-solid fa-industry text-[#06D6A0]"></i>
        Crear Espacio Industrial
      </h1>

      <div class="bg-[#1B263B]/60 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-xl space-y-6">

        <!-- Nombre -->
        <div>
          <label class="block text-sm text-[#B0BEC5] mb-1">Nombre del espacio</label>
          <input
            v-model="form.name"
            type="text"
            placeholder="Ej: Nave A – Depósito Frío"
            class="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-2
                   text-sm text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#00B4D8]"
          />
        </div>

        <!-- Parque -->
        <div>
          <label class="block text-sm text-[#B0BEC5] mb-1">Parque Industrial</label>

          <select
            v-model="form.park_id"
            class="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-2
                   text-sm text-white outline-none focus:ring-2 focus:ring-[#00B4D8]"
          >
            <option disabled value="">Seleccionar parque…</option>
            <option
              v-for="p in parks"
              :key="p.id"
              :value="p.id"
              class="bg-[#1B263B] text-white"
            >
              {{ p.name }}
            </option>
          </select>
        </div>

        <!-- Tipo -->
        <div>
          <label class="block text-sm text-[#B0BEC5] mb-1">Tipo de espacio</label>

          <select
            v-model="form.subcategory"
            class="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-2
                   text-sm text-white outline-none focus:ring-2 focus:ring-[#00B4D8]"
          >
            <option value="warehouse" class="bg-[#1B263B] text-white">Depósito</option>
            <option value="cold_storage" class="bg-[#1B263B] text-white">Cámara Fría</option>
            <option value="dock" class="bg-[#1B263B] text-white">Dársena</option>
            <option value="yard" class="bg-[#1B263B] text-white">Patio Logístico</option>
            <option value="logistics" class="bg-[#1B263B] text-white">Centro Logístico</option>
          </select>
        </div>

        <!-- Dimensiones -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm text-[#B0BEC5] mb-1">Superficie (m²)</label>
            <input
              v-model.number="form.capacity_m2"
              type="number"
              class="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-2
                     text-sm text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#00B4D8]"
            />
          </div>

          <div>
            <label class="block text-sm text-[#B0BEC5] mb-1">Altura (m)</label>
            <input
              v-model.number="form.height_m"
              type="number"
              step="0.1"
              class="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-2
                     text-sm text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#00B4D8]"
            />
          </div>
        </div>

        <!-- Infraestructura -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-[#B0BEC5]">
          <label class="flex items-center gap-2">
            <input type="checkbox" v-model="form.has_security" class="accent-[#06D6A0]" /> Seguridad
          </label>
          <label class="flex items-center gap-2">
            <input type="checkbox" v-model="form.has_loading_dock" class="accent-[#06D6A0]" /> Muelle
          </label>
          <label class="flex items-center gap-2">
            <input type="checkbox" v-model="form.has_cold_chain" class="accent-[#06D6A0]" /> Frío
          </label>
          <label class="flex items-center gap-2">
            <input type="checkbox" v-model="form.energy_3phase" class="accent-[#06D6A0]" /> Trifásica
          </label>
        </div>

        <!-- Pricing -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm text-[#B0BEC5] mb-1">Precio</label>
            <input
              v-model.number="form.price_per_unit"
              type="number"
              class="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-2
                     text-sm text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#00B4D8]"
            />
          </div>

          <div>
            <label class="block text-sm text-[#B0BEC5] mb-1">Unidad</label>
            <select
              v-model="form.pricing_unit"
              class="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-2
                     text-sm text-white outline-none focus:ring-2 focus:ring-[#00B4D8]"
            >
              <option value="hour" class="bg-[#1B263B] text-white">Hora</option>
              <option value="day" class="bg-[#1B263B] text-white">Día</option>
              <option value="week" class="bg-[#1B263B] text-white">Semana</option>
              <option value="month" class="bg-[#1B263B] text-white">Mes</option>
              <option value="year" class="bg-[#1B263B] text-white">Año</option>
            </select>
          </div>
        </div>

        <!-- IMÁGENES -->
        <div>
          <label class="block text-sm text-[#B0BEC5] mb-2">Agregar imágenes del dispositivo</label>

          <input type="file" multiple accept="image/*" @change="handleFiles" class="text-sm mt-2 text-[#B0BEC5]" />

          <div v-if="previews.length" class="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            <div v-for="(src, index) in previews" :key="index" class="relative group">
              <img :src="src" class="w-full h-28 object-cover rounded-xl shadow-md" />
              <button
                @click="removeImage(index)"
                class="absolute top-2 right-2 text-red-400 opacity-0 group-hover:opacity-100 transition"
              >
                <i class="fa-solid fa-circle-xmark text-xl"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Botones -->
        <div class="flex flex-col md:flex-row gap-3 mt-6">
          <button
            @click="createSpace"
            class="flex-1 bg-gradient-to-r from-[#00B4D8] to-[#06D6A0]
                   hover:opacity-90 text-[#0D1B2A] font-semibold rounded-xl
                   transition-all shadow-lg py-3 text-center text-lg"
          >
            Crear Espacio Industrial
          </button>

          <button
            @click="router.back()"
            class="w-full md:w-auto bg-white/10 hover:bg-white/20 text-sm px-4 py-3
                   rounded-xl transition-all text-center"
          >
            Cancelar
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/apiService'
import MainHeader from '../components/layout/header/MainHeader.vue'

const router = useRouter()

// Matchea tu modelo IndustrialSpace, usando defaults donde ya los pusiste en backend/DB
const form = ref({
  name: '',
  park_id: '',
  category: 'industrial',      // existe en el modelo, lo dejamos fijo así
  subcategory: 'warehouse',

  capacity_m2: null,
  height_m: null,

  has_security: false,
  has_loading_dock: false,
  has_cold_chain: false,
  energy_3phase: false,

  price_per_unit: null,
  pricing_unit: 'month',       // vos ya tenés 'month' cargado en el ejemplo

  // estos dos tienen default en el modelo, pero si los querés manejar desde el front:
  pricing_mode: 'public',
  requires_contract: false,

  // también tiene default/null, lo dejamos con algo coherente
  reservation_period: '',
})

const files = ref<File[]>([])
const previews = ref<string[]>([])
const parks = ref<any[]>([])

async function loadParks() {
  const res = await api.get('/industrial/parks')
  parks.value = res.data.data || []
}

function handleFiles(e: Event) {
  const target = e.target as HTMLInputElement
  if (!target.files) return

  for (const file of target.files) {
    files.value.push(file)
    previews.value.push(URL.createObjectURL(file))
  }
}

function removeImage(i: number) {
  files.value.splice(i, 1)
  previews.value.splice(i, 1)
}

async function createSpace() {
  if (!form.value.name || !form.value.park_id) {
    alert('Nombre y parque industrial son obligatorios.')
    return
  }

  const fd = new FormData()

  // Acomodamos los tipos para que al backend le lleguen prolijos
  Object.entries(form.value).forEach(([key, val]) => {
    if (val === null || val === undefined) {
      return // si querés mandarlos igual, podés usar fd.append(key, '')
    }

    if (typeof val === 'boolean') {
      // Si tu backend ya maneja 'true'/'false', podés dejar String(val)
      fd.append(key, val ? '1' : '0')
    } else {
      fd.append(key, String(val))
    }
  })

  files.value.forEach(file => fd.append('images', file))

  try {
    await api.post('/industrial/spaces', fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    alert('Espacio industrial creado correctamente')
    router.push('/industrial')
  } catch (err) {
    console.error(err)
    alert('Error al crear espacio.')
  }
}

onMounted(loadParks)
</script>
